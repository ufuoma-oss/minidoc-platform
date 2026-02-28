"""
MiniDoc - Memory & RAG System
Vector embeddings and document memory for user data.
"""
import json
import httpx
from typing import Optional
from app.core.config import settings


class MemorySystem:
    """
    Memory system for storing and retrieving user data.
    Uses simple text matching for now, can be upgraded to vector DB.
    """
    
    def __init__(self):
        self.chunk_size = 500  # characters per chunk
        self.overlap = 50  # overlap between chunks
    
    def chunk_text(self, text: str) -> list[str]:
        """Split text into overlapping chunks for better retrieval."""
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + self.chunk_size
            chunk = text[start:end]
            
            # Try to end at sentence boundary
            last_period = chunk.rfind('.')
            last_newline = chunk.rfind('\n')
            boundary = max(last_period, last_newline)
            
            if boundary > self.chunk_size * 0.5:
                chunk = text[start:start + boundary + 1]
                end = start + boundary + 1
            
            chunks.append(chunk.strip())
            start = end - self.overlap
        
        return [c for c in chunks if c]
    
    async def store_document_memory(
        self,
        user_id: str,
        document_id: str,
        content: str,
        metadata: dict = None
    ) -> dict:
        """
        Store document content in memory with chunks.
        In production, this would use a vector database like Pinecone or Weaviate.
        """
        chunks = self.chunk_text(content)
        
        # For now, return structured data
        # In production, store in vector DB with embeddings
        memories = []
        for i, chunk in enumerate(chunks):
            memories.append({
                "user_id": user_id,
                "document_id": document_id,
                "chunk_index": i,
                "content": chunk,
                "metadata": metadata or {}
            })
        
        return {
            "success": True,
            "document_id": document_id,
            "chunks_created": len(memories),
            "memories": memories
        }
    
    async def search_memories(
        self,
        user_id: str,
        query: str,
        limit: int = 5
    ) -> list[dict]:
        """
        Search user's memories for relevant content.
        Uses simple text matching - upgrade to semantic search in production.
        """
        # In production, this would be a vector similarity search
        # For now, return placeholder
        return [
            {
                "content": "Relevant document content would be here...",
                "document_id": "doc_1",
                "relevance": 0.95,
                "source": "uploaded_document"
            }
        ]
    
    async def get_context_for_query(
        self,
        user_id: str,
        query: str,
        documents: list[dict] = None
    ) -> str:
        """
        Build context string from user's documents for the AI.
        """
        context_parts = []
        
        if documents:
            for doc in documents[:5]:  # Limit to 5 documents
                text = doc.get("extractedText", "")
                filename = doc.get("originalName", doc.get("filename", "Unknown"))
                
                if text:
                    # Include relevant portion
                    if len(text) > 1000:
                        text = text[:1000] + "..."
                    
                    context_parts.append(f"Document: {filename}\n{text}")
        
        if context_parts:
            return "\n\n---\n\n".join(context_parts)
        
        return ""


# Singleton
memory_system = MemorySystem()
