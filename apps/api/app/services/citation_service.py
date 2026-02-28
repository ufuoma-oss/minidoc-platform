"""
MiniDoc - Citation Service
Document citations and context retrieval.
"""
import os
import re
from typing import Dict, Any, Optional, List
from datetime import datetime
import httpx


class CitationService:
    """Service for managing document citations."""
    
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL", "")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY", os.getenv("SUPABASE_ANON_KEY", ""))
    
    def _get_headers(self) -> dict:
        """Get headers for Supabase API requests."""
        return {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json",
        }
    
    async def get_document_context(
        self,
        query: str,
        user_id: str,
        max_chunks: int = 5
    ) -> str:
        """
        Get relevant document context for a query.
        
        Args:
            query: User query
            user_id: User ID
            max_chunks: Maximum number of chunks to include
            
        Returns:
            Context string from relevant documents
        """
        from app.services.embedding_service import embedding_service
        
        # Generate embedding for query
        query_embedding = await embedding_service.generate_embedding(query)
        
        # Find similar chunks
        similar_chunks = await embedding_service.find_similar(
            query_embedding=query_embedding,
            user_id=user_id,
            limit=max_chunks,
            threshold=0.5
        )
        
        if not similar_chunks:
            return ""
        
        # Build context string
        context_parts = []
        seen_documents = set()
        
        for chunk in similar_chunks:
            doc_id = chunk.get("document_id")
            
            # Get document info
            doc = await self._get_document(doc_id)
            
            if doc:
                doc_name = doc.get("filename", "Unknown Document")
                chunk_text = chunk.get("chunk_text", "")
                similarity = chunk.get("similarity", 0)
                
                if doc_id not in seen_documents:
                    context_parts.append(f"\n### Document: {doc_name}")
                    seen_documents.add(doc_id)
                
                context_parts.append(f"\n[Relevance: {similarity:.2f}]\n{chunk_text}\n")
        
        return "\n".join(context_parts)
    
    async def _get_document(self, document_id: str) -> Optional[Dict[str, Any]]:
        """Get document metadata."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/documents?id=eq.{document_id}&select=*",
                headers=self._get_headers()
            )
            
            if response.status_code == 200:
                data = response.json()
                return data[0] if data else None
        
        return None
    
    async def extract_citations(
        self,
        response_text: str,
        user_id: str
    ) -> List[Dict[str, Any]]:
        """
        Extract citations from AI response.
        
        Looks for references to documents and creates citation objects.
        
        Args:
            response_text: AI response text
            user_id: User ID
            
        Returns:
            List of citation objects
        """
        citations = []
        
        # Pattern for document references
        patterns = [
            r"(?:according to|from|in|based on|as stated in)\s+['\"]([^'\"]+)['\"]",
            r"(?:document|file)\s+['\"]([^'\"]+)['\"]",
            r"\[([^\]]+\.(?:pdf|doc|docx|txt))\]",
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, response_text, re.IGNORECASE)
            
            for match in matches:
                doc_name = match.strip()
                
                # Find document in database
                doc = await self._find_document_by_name(doc_name, user_id)
                
                if doc:
                    citations.append({
                        "document_id": doc.get("id"),
                        "document_name": doc.get("filename"),
                        "text_snippet": doc_name,
                        "url": doc.get("url")
                    })
        
        # Remove duplicates
        seen = set()
        unique_citations = []
        for citation in citations:
            if citation["document_id"] not in seen:
                seen.add(citation["document_id"])
                unique_citations.append(citation)
        
        return unique_citations
    
    async def _find_document_by_name(
        self,
        name: str,
        user_id: str
    ) -> Optional[Dict[str, Any]]:
        """Find a document by name."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Try exact match first
            response = await client.get(
                f"{self.supabase_url}/rest/v1/documents?user_id=eq.{user_id}&filename=eq.{name}&select=*",
                headers=self._get_headers()
            )
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    return data[0]
            
            # Try partial match
            response = await client.get(
                f"{self.supabase_url}/rest/v1/documents?user_id=eq.{user_id}&filename=ilike.%25{name}%25&select=*",
                headers=self._get_headers()
            )
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    return data[0]
        
        return None
    
    def format_citation(
        self,
        document: Dict[str, Any],
        page_number: int = None,
        format_style: str = "standard"
    ) -> str:
        """
        Format a citation in a specific style.
        
        Args:
            document: Document metadata
            page_number: Optional page number
            format_style: Citation style (standard, apa, mla)
            
        Returns:
            Formatted citation string
        """
        doc_name = document.get("filename", "Unknown")
        doc_date = document.get("created_at", "")
        
        if format_style == "apa":
            # APA style
            date_str = ""
            if doc_date:
                date_str = datetime.fromisoformat(doc_date.replace("Z", "")).strftime("(%B %d, %Y)")
            
            citation = f"{doc_name} {date_str}".strip()
            if page_number:
                citation += f", p. {page_number}"
            return citation
        
        elif format_style == "mla":
            # MLA style
            date_str = ""
            if doc_date:
                date_str = datetime.fromisoformat(doc_date.replace("Z", "")).strftime("%d %b. %Y")
            
            citation = f'"{doc_name}." {date_str}.'
            return citation
        
        else:
            # Standard format
            citation = f"📄 {doc_name}"
            if page_number:
                citation += f" (page {page_number})"
            return citation
    
    async def store_citation(
        self,
        message_id: str,
        document_id: str,
        text_snippet: str,
        page_number: int = None
    ) -> Dict[str, Any]:
        """Store a citation for a message."""
        import uuid
        
        citation_data = {
            "id": str(uuid.uuid4()),
            "message_id": message_id,
            "document_id": document_id,
            "page_number": page_number,
            "text_snippet": text_snippet,
            "created_at": datetime.utcnow().isoformat()
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.supabase_url}/rest/v1/citations",
                headers=self._get_headers(),
                json=citation_data
            )
            
            if response.status_code in [200, 201]:
                return {"success": True, "citation": citation_data}
            
            return {"success": False, "error": response.text}
    
    async def get_message_citations(
        self,
        message_id: str
    ) -> List[Dict[str, Any]]:
        """Get all citations for a message."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/citations?message_id=eq.{message_id}&select=*",
                headers=self._get_headers()
            )
            
            if response.status_code == 200:
                return response.json()
        
        return []
    
    async def enhance_response_with_citations(
        self,
        response: str,
        relevant_docs: List[Dict[str, Any]]
    ) -> str:
        """
        Enhance an AI response with citation markers.
        
        Args:
            response: Original AI response
            relevant_docs: List of relevant documents with similarity scores
            
        Returns:
            Enhanced response with citations
        """
        if not relevant_docs:
            return response
        
        # Add sources section
        sources_section = "\n\n---\n**Sources:**\n"
        
        for idx, doc in enumerate(relevant_docs, 1):
            doc_name = doc.get("document_name", "Unknown")
            similarity = doc.get("similarity", 0)
            
            sources_section += f"\n{idx}. {doc_name} (relevance: {similarity:.0%})"
        
        return response + sources_section


# Singleton instance
citation_service = CitationService()
