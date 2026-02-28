"""
MiniDoc - Microsoft Service
Outlook and OneDrive integrations via Microsoft Graph API.
"""
import os
import base64
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import httpx
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


class MicrosoftService:
    """Service for Microsoft 365 integrations."""
    
    GRAPH_API = "https://graph.microsoft.com/v1.0"
    
    def __init__(self):
        pass
    
    def _get_headers(self, token: str) -> dict:
        """Get headers for Microsoft Graph API requests."""
        return {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
    
    # ==================== Outlook Mail ====================
    
    async def get_emails(
        self,
        token: str,
        folder: str = "inbox",
        search: str = "",
        top: int = 10,
        skip: int = 0
    ) -> Dict[str, Any]:
        """
        Get emails from Outlook.
        
        Args:
            token: Access token
            folder: Folder name (inbox, sentitems, drafts)
            search: Search query
            top: Number of results
            skip: Skip count for pagination
            
        Returns:
            Dict with list of emails
        """
        params = {
            "$top": top,
            "$skip": skip,
            "$orderby": "receivedDateTime desc",
            "$select": "id,subject,from,toRecipients,receivedDateTime,hasAttachments,isRead,importance"
        }
        
        if search:
            params["$search"] = f'"{search}"'
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.GRAPH_API}/me/mailFolders/{folder}/messages",
                headers=self._get_headers(token),
                params=params
            )
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Outlook API error: {response.text}",
                    "emails": []
                }
            
            messages = response.json().get("value", [])
            
            emails = []
            for msg in messages:
                emails.append({
                    "id": msg.get("id"),
                    "subject": msg.get("subject", ""),
                    "from": msg.get("from", {}).get("emailAddress", {}).get("address", ""),
                    "from_name": msg.get("from", {}).get("emailAddress", {}).get("name", ""),
                    "to": [r.get("emailAddress", {}).get("address", "") for r in msg.get("toRecipients", [])],
                    "received_at": msg.get("receivedDateTime", ""),
                    "has_attachments": msg.get("hasAttachments", False),
                    "is_read": msg.get("isRead", True),
                    "importance": msg.get("importance", "normal")
                })
            
            return {
                "success": True,
                "emails": emails,
                "count": len(emails)
            }
    
    async def get_email(
        self,
        token: str,
        message_id: str
    ) -> Dict[str, Any]:
        """
        Get full email content.
        
        Args:
            token: Access token
            message_id: Outlook message ID
            
        Returns:
            Dict with full email data
        """
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.GRAPH_API}/me/messages/{message_id}",
                headers=self._get_headers(token),
                params={"$select": "id,subject,from,toRecipients,ccRecipients,body,receivedDateTime,hasAttachments"}
            )
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Outlook API error: {response.text}"
                }
            
            msg = response.json()
            
            return {
                "success": True,
                "email": {
                    "id": msg.get("id"),
                    "subject": msg.get("subject", ""),
                    "from": msg.get("from", {}).get("emailAddress", {}).get("address", ""),
                    "from_name": msg.get("from", {}).get("emailAddress", {}).get("name", ""),
                    "to": [r.get("emailAddress", {}).get("address", "") for r in msg.get("toRecipients", [])],
                    "cc": [r.get("emailAddress", {}).get("address", "") for r in msg.get("ccRecipients", [])],
                    "body": msg.get("body", {}).get("content", ""),
                    "body_type": msg.get("body", {}).get("contentType", "text"),
                    "received_at": msg.get("receivedDateTime", ""),
                    "has_attachments": msg.get("hasAttachments", False)
                }
            }
    
    async def send_email(
        self,
        token: str,
        to: List[str],
        subject: str,
        body: str,
        cc: List[str] = None,
        bcc: List[str] = None,
        html: bool = False
    ) -> Dict[str, Any]:
        """
        Send an email via Outlook.
        
        Args:
            token: Access token
            to: List of recipient emails
            subject: Email subject
            body: Email body
            cc: CC recipients
            bcc: BCC recipients
            html: Whether body is HTML
            
        Returns:
            Dict with success status
        """
        message = {
            "subject": subject,
            "body": {
                "contentType": "html" if html else "text",
                "content": body
            },
            "toRecipients": [
                {"emailAddress": {"address": email}} for email in to
            ]
        }
        
        if cc:
            message["ccRecipients"] = [
                {"emailAddress": {"address": email}} for email in cc
            ]
        
        if bcc:
            message["bccRecipients"] = [
                {"emailAddress": {"address": email}} for email in bcc
            ]
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.GRAPH_API}/me/sendMail",
                headers=self._get_headers(token),
                json={"message": message}
            )
            
            if response.status_code != 202:
                return {
                    "success": False,
                    "error": f"Outlook API error: {response.text}"
                }
            
            return {
                "success": True,
                "message": "Email sent successfully"
            }
    
    async def draft_email(
        self,
        token: str,
        to: List[str],
        subject: str,
        body: str,
        html: bool = False
    ) -> Dict[str, Any]:
        """
        Create an email draft in Outlook.
        
        Args:
            token: Access token
            to: List of recipient emails
            subject: Email subject
            body: Email body
            html: Whether body is HTML
            
        Returns:
            Dict with draft ID
        """
        message = {
            "subject": subject,
            "body": {
                "contentType": "html" if html else "text",
                "content": body
            },
            "toRecipients": [
                {"emailAddress": {"address": email}} for email in to
            ]
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.GRAPH_API}/me/messages",
                headers=self._get_headers(token),
                json=message
            )
            
            if response.status_code != 201:
                return {
                    "success": False,
                    "error": f"Outlook API error: {response.text}"
                }
            
            result = response.json()
            
            return {
                "success": True,
                "draft_id": result.get("id")
            }
    
    # ==================== OneDrive ====================
    
    async def list_files(
        self,
        token: str,
        path: str = "",
        top: int = 20
    ) -> Dict[str, Any]:
        """
        List files from OneDrive.
        
        Args:
            token: Access token
            path: Folder path (empty for root)
            top: Number of results
            
        Returns:
            Dict with list of files
        """
        url = f"{self.GRAPH_API}/me/drive/root"
        if path:
            url = f"{self.GRAPH_API}/me/drive/root:/{path}:/children"
        else:
            url = f"{self.GRAPH_API}/me/drive/root/children"
        
        params = {
            "$top": top,
            "$orderby": "lastModifiedDateTime desc",
            "$select": "id,name,size,webUrl,lastModifiedDateTime,createdDateTime,file,folder"
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                headers=self._get_headers(token),
                params=params
            )
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"OneDrive API error: {response.text}",
                    "files": []
                }
            
            items = response.json().get("value", [])
            
            files = []
            for item in items:
                file_info = {
                    "id": item.get("id"),
                    "name": item.get("name"),
                    "size": item.get("size", 0),
                    "web_url": item.get("webUrl", ""),
                    "last_modified": item.get("lastModifiedDateTime", ""),
                    "created": item.get("createdDateTime", ""),
                    "is_folder": "folder" in item
                }
                
                if "file" in item:
                    file_info["mime_type"] = item["file"].get("mimeType", "")
                
                files.append(file_info)
            
            return {
                "success": True,
                "files": files,
                "count": len(files)
            }
    
    async def get_file(
        self,
        token: str,
        file_id: str
    ) -> Dict[str, Any]:
        """
        Get file metadata from OneDrive.
        
        Args:
            token: Access token
            file_id: OneDrive file ID
            
        Returns:
            Dict with file metadata
        """
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.GRAPH_API}/me/drive/items/{file_id}",
                headers=self._get_headers(token)
            )
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"OneDrive API error: {response.text}"
                }
            
            item = response.json()
            
            return {
                "success": True,
                "file": {
                    "id": item.get("id"),
                    "name": item.get("name"),
                    "size": item.get("size", 0),
                    "web_url": item.get("webUrl", ""),
                    "download_url": item.get("@microsoft.graph.downloadUrl", ""),
                    "mime_type": item.get("file", {}).get("mimeType", ""),
                    "last_modified": item.get("lastModifiedDateTime", ""),
                    "created": item.get("createdDateTime", "")
                }
            }
    
    async def download_file(
        self,
        token: str,
        file_id: str
    ) -> Dict[str, Any]:
        """
        Download a file from OneDrive.
        
        Args:
            token: Access token
            file_id: OneDrive file ID
            
        Returns:
            Dict with file content
        """
        async with httpx.AsyncClient(timeout=60.0) as client:
            # Get file metadata
            meta_response = await client.get(
                f"{self.GRAPH_API}/me/drive/items/{file_id}",
                headers=self._get_headers(token)
            )
            
            if meta_response.status_code != 200:
                return {
                    "success": False,
                    "error": f"OneDrive API error: {meta_response.text}"
                }
            
            file_meta = meta_response.json()
            download_url = file_meta.get("@microsoft.graph.downloadUrl")
            
            if not download_url:
                return {
                    "success": False,
                    "error": "No download URL available"
                }
            
            # Download content
            content_response = await client.get(download_url)
            
            if content_response.status_code != 200:
                return {
                    "success": False,
                    "error": f"OneDrive download error: {content_response.text}"
                }
            
            return {
                "success": True,
                "filename": file_meta.get("name"),
                "mime_type": file_meta.get("file", {}).get("mimeType", ""),
                "size": file_meta.get("size"),
                "content": content_response.content
            }
    
    async def upload_file(
        self,
        token: str,
        filename: str,
        content: bytes,
        parent_path: str = ""
    ) -> Dict[str, Any]:
        """
        Upload a file to OneDrive.
        
        Args:
            token: Access token
            filename: Name for the file
            content: File content as bytes
            parent_path: Parent folder path
            
        Returns:
            Dict with file ID and URL
        """
        if parent_path:
            url = f"{self.GRAPH_API}/me/drive/root:/{parent_path}/{filename}:/content"
        else:
            url = f"{self.GRAPH_API}/me/drive/root:/{filename}:/content"
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.put(
                url,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/octet-stream"
                },
                content=content
            )
            
            if response.status_code not in [200, 201]:
                return {
                    "success": False,
                    "error": f"OneDrive upload error: {response.text}"
                }
            
            result = response.json()
            
            return {
                "success": True,
                "file_id": result.get("id"),
                "name": result.get("name"),
                "web_url": result.get("webUrl")
            }
    
    # ==================== Microsoft Calendar ====================
    
    async def get_events(
        self,
        token: str,
        start: datetime = None,
        end: datetime = None,
        top: int = 20
    ) -> Dict[str, Any]:
        """
        Get calendar events from Outlook Calendar.
        
        Args:
            token: Access token
            start: Start time filter
            end: End time filter
            top: Maximum results
            
        Returns:
            Dict with list of events
        """
        if not start:
            start = datetime.utcnow()
        if not end:
            end = start + timedelta(days=30)
        
        params = {
            "startDateTime": start.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "endDateTime": end.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "$top": top,
            "$orderby": "start/dateTime",
            "$select": "id,subject,body,start,end,location,organizer,attendees"
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.GRAPH_API}/me/calendarView",
                headers=self._get_headers(token),
                params=params
            )
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Calendar API error: {response.text}",
                    "events": []
                }
            
            events = []
            for event in response.json().get("value", []):
                events.append({
                    "id": event.get("id"),
                    "subject": event.get("subject", ""),
                    "body": event.get("body", {}).get("content", ""),
                    "start": event.get("start", {}).get("dateTime", ""),
                    "end": event.get("end", {}).get("dateTime", ""),
                    "location": event.get("location", {}).get("displayName", ""),
                    "organizer": event.get("organizer", {}).get("emailAddress", {}).get("address", ""),
                    "attendees": [a.get("emailAddress", {}).get("address", "") for a in event.get("attendees", [])],
                    "web_link": event.get("webLink", "")
                })
            
            return {
                "success": True,
                "events": events,
                "count": len(events)
            }
    
    async def create_event(
        self,
        token: str,
        subject: str,
        start: datetime,
        end: datetime,
        body: str = "",
        location: str = "",
        attendees: List[str] = None,
        timezone: str = "UTC"
    ) -> Dict[str, Any]:
        """
        Create a calendar event.
        
        Args:
            token: Access token
            subject: Event title
            start: Start time
            end: End time
            body: Event description
            location: Event location
            attendees: List of attendee emails
            timezone: Timezone
            
        Returns:
            Dict with event ID and link
        """
        event_data = {
            "subject": subject,
            "body": {
                "contentType": "text",
                "content": body
            },
            "start": {
                "dateTime": start.strftime("%Y-%m-%dT%H:%M:%S"),
                "timeZone": timezone
            },
            "end": {
                "dateTime": end.strftime("%Y-%m-%dT%H:%M:%S"),
                "timeZone": timezone
            },
            "location": {
                "displayName": location
            }
        }
        
        if attendees:
            event_data["attendees"] = [
                {
                    "emailAddress": {"address": email},
                    "type": "required"
                }
                for email in attendees
            ]
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.GRAPH_API}/me/events",
                headers=self._get_headers(token),
                json=event_data
            )
            
            if response.status_code != 201:
                return {
                    "success": False,
                    "error": f"Calendar API error: {response.text}"
                }
            
            result = response.json()
            
            return {
                "success": True,
                "event_id": result.get("id"),
                "web_link": result.get("webLink"),
                "subject": result.get("subject")
            }
    
    async def delete_event(
        self,
        token: str,
        event_id: str
    ) -> bool:
        """Delete a calendar event."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.delete(
                f"{self.GRAPH_API}/me/events/{event_id}",
                headers=self._get_headers(token)
            )
            
            return response.status_code == 204


# Singleton instance
microsoft_service = MicrosoftService()
