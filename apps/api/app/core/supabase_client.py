"""
MiniDoc - Supabase Client
Database and storage integration using Supabase.
"""
import os
from typing import Optional, List, Dict, Any
from datetime import datetime
import httpx
import json


class SupabaseClient:
    """
    Client for Supabase database and storage operations.
    Uses REST API for compatibility.
    """
    
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL", "")
        self.supabase_key = os.getenv("SUPABASE_ANON_KEY", "")
        self.service_key = os.getenv("SUPABASE_SERVICE_KEY", self.supabase_key)
        
        # Storage bucket name
        self.bucket_name = "documents"
    
    def _get_headers(self, use_service_key: bool = False) -> dict:
        """Get headers for Supabase API requests."""
        key = self.service_key if use_service_key else self.supabase_key
        return {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        }
    
    async def _request(
        self, 
        method: str, 
        endpoint: str, 
        data: dict = None,
        use_service_key: bool = False
    ) -> dict:
        """Make a request to Supabase REST API."""
        url = f"{self.supabase_url}{endpoint}"
        headers = self._get_headers(use_service_key)
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            if method == "GET":
                response = await client.get(url, headers=headers)
            elif method == "POST":
                response = await client.post(url, headers=headers, json=data)
            elif method == "PATCH":
                response = await client.patch(url, headers=headers, json=data)
            elif method == "DELETE":
                response = await client.delete(url, headers=headers)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            if response.status_code in [200, 201]:
                return {"success": True, "data": response.json()}
            else:
                print(f"[Supabase] Error: {response.status_code} - {response.text}")
                return {"success": False, "error": response.text}
    
    # ==================== USER OPERATIONS ====================
    
    async def get_or_create_user(self, user_id: str, email: str = None) -> dict:
        """Get or create a user record."""
        # Try to get existing user
        result = await self._request(
            "GET", 
            f"/rest/v1/users?id=eq.{user_id}&select=*"
        )
        
        if result["success"] and result["data"]:
            return result["data"][0]
        
        # Create new user
        user_data = {
            "id": user_id,
            "email": email or f"{user_id}@minidoc.local",
            "plan": "free",
            "messages_used": 0,
            "documents_uploaded": 0
        }
        
        result = await self._request(
            "POST",
            "/rest/v1/users",
            data=user_data,
            use_service_key=True
        )
        
        if result["success"]:
            return result["data"][0] if result["data"] else user_data
        
        return user_data
    
    async def update_user_usage(self, user_id: str, messages: int = 0, documents: int = 0) -> bool:
        """Update user usage counters."""
        # Get current values first
        result = await self._request(
            "GET",
            f"/rest/v1/users?id=eq.{user_id}&select=messages_used,documents_uploaded"
        )
        
        current = {"messages_used": 0, "documents_uploaded": 0}
        if result["success"] and result["data"]:
            current = result["data"][0]
        
        update_data = {
            "messages_used": current.get("messages_used", 0) + messages,
            "documents_uploaded": current.get("documents_uploaded", 0) + documents,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = await self._request(
            "PATCH",
            f"/rest/v1/users?id=eq.{user_id}",
            data=update_data,
            use_service_key=True
        )
        
        return result["success"]
    
    # ==================== DOCUMENT OPERATIONS ====================
    
    async def upload_document(
        self,
        user_id: str,
        file_name: str,
        file_content: bytes,
        content_type: str,
        category: str = "general"
    ) -> dict:
        """Upload a document to Supabase storage and create database record."""
        import time
        import uuid
        
        doc_id = str(uuid.uuid4())
        timestamp = int(time.time())
        storage_path = f"{user_id}/{timestamp}_{file_name}"
        
        # Upload to storage
        storage_url = f"{self.supabase_url}/storage/v1/object/{self.bucket_name}/{storage_path}"
        headers = self._get_headers(use_service_key=True)
        headers["Content-Type"] = content_type
        headers["x-upsert"] = "true"
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                storage_url,
                headers=headers,
                content=file_content
            )
            
            if response.status_code not in [200, 201]:
                print(f"[Supabase] Storage upload error: {response.status_code}")
                return {"success": False, "error": "Failed to upload to storage"}
        
        # Create database record
        doc_record = {
            "id": doc_id,
            "user_id": user_id,
            "filename": file_name,
            "original_name": file_name,
            "mime_type": content_type,
            "size": len(file_content),
            "storage_path": storage_path,
            "category": category,
            "status": "ready"
        }
        
        result = await self._request(
            "POST",
            "/rest/v1/documents",
            data=doc_record,
            use_service_key=True
        )
        
        if result["success"]:
            # Update user document count
            await self.update_user_usage(user_id, documents=1)
            
            return {
                "success": True,
                "document": {
                    **doc_record,
                    "url": self.get_document_url(storage_path)
                }
            }
        
        return {"success": False, "error": result.get("error", "Database error")}
    
    async def get_documents(self, user_id: str, limit: int = 50) -> List[dict]:
        """Get all documents for a user."""
        result = await self._request(
            "GET",
            f"/rest/v1/documents?user_id=eq.{user_id}&select=*&order=created_at.desc&limit={limit}"
        )
        
        if result["success"]:
            documents = result["data"]
            # Add URLs to documents
            for doc in documents:
                doc["url"] = self.get_document_url(doc.get("storage_path", ""))
            return documents
        
        return []
    
    async def get_document(self, document_id: str, user_id: str = None) -> Optional[dict]:
        """Get a specific document."""
        query = f"/rest/v1/documents?id=eq.{document_id}&select=*"
        if user_id:
            query += f"&user_id=eq.{user_id}"
        
        result = await self._request("GET", query)
        
        if result["success"] and result["data"]:
            doc = result["data"][0]
            doc["url"] = self.get_document_url(doc.get("storage_path", ""))
            return doc
        
        return None
    
    async def delete_document(self, document_id: str, user_id: str) -> bool:
        """Delete a document from storage and database."""
        # Get document first
        doc = await self.get_document(document_id, user_id)
        if not doc:
            return False
        
        storage_path = doc.get("storage_path", "")
        
        # Delete from storage
        if storage_path:
            storage_url = f"{self.supabase_url}/storage/v1/object/{self.bucket_name}/{storage_path}"
            headers = self._get_headers(use_service_key=True)
            
            async with httpx.AsyncClient() as client:
                await client.delete(storage_url, headers=headers)
        
        # Delete from database
        result = await self._request(
            "DELETE",
            f"/rest/v1/documents?id=eq.{document_id}&user_id=eq.{user_id}"
        )
        
        return result["success"]
    
    def get_document_url(self, storage_path: str) -> str:
        """Get public URL for a document."""
        if not storage_path:
            return ""
        return f"{self.supabase_url}/storage/v1/object/public/{self.bucket_name}/{storage_path}"
    
    # ==================== CONVERSATION OPERATIONS ====================
    
    async def create_conversation(
        self,
        user_id: str,
        title: str = "New Chat"
    ) -> dict:
        """Create a new conversation."""
        import uuid
        
        conv_id = str(uuid.uuid4())
        conv_data = {
            "id": conv_id,
            "user_id": user_id,
            "title": title
        }
        
        result = await self._request(
            "POST",
            "/rest/v1/conversations",
            data=conv_data,
            use_service_key=True
        )
        
        if result["success"]:
            return {**conv_data, "messages": []}
        
        return conv_data
    
    async def get_conversations(self, user_id: str, limit: int = 20) -> List[dict]:
        """Get all conversations for a user."""
        result = await self._request(
            "GET",
            f"/rest/v1/conversations?user_id=eq.{user_id}&select=*&order=updated_at.desc&limit={limit}"
        )
        
        if result["success"]:
            return result["data"]
        
        return []
    
    async def get_conversation(self, conversation_id: str, user_id: str = None) -> Optional[dict]:
        """Get a conversation with messages."""
        query = f"/rest/v1/conversations?id=eq.{conversation_id}&select=*"
        if user_id:
            query += f"&user_id=eq.{user_id}"
        
        result = await self._request("GET", query)
        
        if result["success"] and result["data"]:
            conversation = result["data"][0]
            
            # Get messages for this conversation
            msg_result = await self._request(
                "GET",
                f"/rest/v1/messages?conversation_id=eq.{conversation_id}&select=*&order=created_at.asc"
            )
            
            conversation["messages"] = msg_result["data"] if msg_result["success"] else []
            return conversation
        
        return None
    
    async def add_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        documents: List[dict] = None
    ) -> dict:
        """Add a message to a conversation."""
        import uuid
        import json
        
        msg_id = str(uuid.uuid4())
        msg_data = {
            "id": msg_id,
            "conversation_id": conversation_id,
            "role": role,
            "content": content,
            "documents": json.dumps(documents) if documents else None
        }
        
        result = await self._request(
            "POST",
            "/rest/v1/messages",
            data=msg_data,
            use_service_key=True
        )
        
        # Update conversation timestamp
        await self._request(
            "PATCH",
            f"/rest/v1/conversations?id=eq.{conversation_id}",
            data={"updated_at": datetime.utcnow().isoformat()},
            use_service_key=True
        )
        
        if result["success"]:
            return {**msg_data, "documents": documents}
        
        return msg_data
    
    async def delete_conversation(self, conversation_id: str, user_id: str) -> bool:
        """Delete a conversation and its messages."""
        # Delete messages first (cascade should handle this, but being explicit)
        await self._request(
            "DELETE",
            f"/rest/v1/messages?conversation_id=eq.{conversation_id}"
        )
        
        # Delete conversation
        result = await self._request(
            "DELETE",
            f"/rest/v1/conversations?id=eq.{conversation_id}&user_id=eq.{user_id}"
        )
        
        return result["success"]


# Singleton instance
supabase_client = SupabaseClient()
