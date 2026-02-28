"""
MiniDoc - Embedding Service
Vector embeddings for document search and RAG.
"""
import os
import json
from typing import Dict, Any, Optional, List
from datetime import datetime
import httpx
import numpy as np


class EmbeddingService:
    """Service for generating and managing vector embeddings."""
    
    # Use NVIDIA NIM for embeddings
    EMBEDDING_API = "https://integrate.api.nvidia.com/v1/embeddings"
    
    def __init__(self):
        self.nvidia_api_key = os.getenv("NVIDIA_API_KEY", "")
        self.supabase_url = os.getenv("SUPABASE_URL", "")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY", os.getenv("SUPABASE_ANON_KEY", ""))
        
        # Embedding dimension (NVIDIA models typically use 1024 or 1536)
        self.embedding_dim = 1024
    
    def _get_headers(self, api_type: str = "nvidia") -> dict:
        """Get headers for API requests."""
        if api_type == "nvidia":
            return {
                "Authorization": f"Bearer {self.nvidia_api_key}",
                "Content-Type": "application/json"
            }
        else:  # supabase
            return {
                "apikey": self.supabase_key,
                "Authorization": f"Bearer {self.supabase_key}",
                "Content-Type": "application/json"
            }
    
    async def generate_embedding(self, text: str) -> List[float]:
        """
        Generate an embedding for a text.
        
        Args:
            text: Text to embed
            
        Returns:
            List of floats representing the embedding
        """
        if not self.nvidia_api_key:
            # Return a dummy embedding for testing
            return [0.0] * self.embedding_dim
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(
                    self.EMBEDDING_API,
                    headers=self._get_headers("nvidia"),
                    json={
                        "model": "nvidia/nv-embedqa-e5-v5",
                        "input": text,
                        "input_type": "query",
                        "encoding_format": "float"
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["data"][0]["embedding"]
                else:
                    print(f"[Embedding] Error: {response.status_code} - {response.text}")
                    return [0.0] * self.embedding_dim
            
            except Exception as e:
                print(f"[Embedding] Exception: {e}")
                return [0.0] * self.embedding_dim
    
    async def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts.
        
        Args:
            texts: List of texts to embed
            
        Returns:
            List of embeddings
        """
        if not texts:
            return []
        
        # Process in batches of 10 to avoid rate limits
        batch_size = 10
        all_embeddings = []
        
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            embeddings = []
            
            for text in batch:
                embedding = await self.generate_embedding(text)
                embeddings.append(embedding)
            
            all_embeddings.extend(embeddings)
        
        return all_embeddings
    
    async def index_document(
        self,
        document_id: str,
        text: str,
        user_id: str,
        chunk_size: int = 500,
        overlap: int = 50
    ) -> bool:
        """
        Index a document by creating embeddings for its chunks.
        
        Args:
            document_id: Document ID
            text: Full document text
            user_id: User ID
            chunk_size: Size of text chunks
            overlap: Overlap between chunks
            
        Returns:
            Success status
        """
        if not text:
            return False
        
        # Split text into chunks
        chunks = self._chunk_text(text, chunk_size, overlap)
        
        # Generate embeddings for each chunk
        embeddings = await self.generate_embeddings_batch(chunks)
        
        # Store in database
        for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            await self._store_embedding(
                document_id=document_id,
                user_id=user_id,
                chunk_index=idx,
                chunk_text=chunk,
                embedding=embedding
            )
        
        return True
    
    def _chunk_text(
        self,
        text: str,
        chunk_size: int = 500,
        overlap: int = 50
    ) -> List[str]:
        """
        Split text into overlapping chunks.
        
        Args:
            text: Text to chunk
            chunk_size: Target size of each chunk
            overlap: Overlap between chunks
            
        Returns:
            List of text chunks
        """
        words = text.split()
        
        if len(words) <= chunk_size:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(words):
            end = start + chunk_size
            chunk_words = words[start:end]
            chunks.append(" ".join(chunk_words))
            
            start += chunk_size - overlap
            
            if start >= len(words):
                break
        
        return chunks
    
    async def _store_embedding(
        self,
        document_id: str,
        user_id: str,
        chunk_index: int,
        chunk_text: str,
        embedding: List[float]
    ) -> bool:
        """Store an embedding in the database."""
        import uuid
        
        embedding_data = {
            "id": str(uuid.uuid4()),
            "document_id": document_id,
            "user_id": user_id,
            "chunk_index": chunk_index,
            "chunk_text": chunk_text,
            "embedding": embedding,
            "created_at": datetime.utcnow().isoformat()
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.supabase_url}/rest/v1/document_embeddings",
                headers=self._get_headers("supabase"),
                json=embedding_data
            )
            
            return response.status_code in [200, 201]
    
    async def find_similar(
        self,
        query_embedding: List[float],
        user_id: str,
        limit: int = 5,
        threshold: float = 0.7
    ) -> List[Dict[str, Any]]:
        """
        Find similar documents using vector similarity.
        
        Args:
            query_embedding: Query embedding
            user_id: User ID
            limit: Maximum results
            threshold: Similarity threshold
            
        Returns:
            List of similar documents
        """
        # Use Supabase RPC for vector search
        # This assumes pgvector extension is enabled
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Call the match_documents function (needs to be created in Supabase)
            response = await client.post(
                f"{self.supabase_url}/rest/v1/rpc/match_documents",
                headers=self._get_headers("supabase"),
                json={
                    "query_embedding": query_embedding,
                    "match_user_id": user_id,
                    "match_limit": limit,
                    "match_threshold": threshold
                }
            )
            
            if response.status_code == 200:
                return response.json()
            
            # Fallback: manual similarity search
            return await self._manual_similarity_search(query_embedding, user_id, limit, threshold)
    
    async def _manual_similarity_search(
        self,
        query_embedding: List[float],
        user_id: str,
        limit: int,
        threshold: float
    ) -> List[Dict[str, Any]]:
        """Manual similarity search when RPC is not available."""
        # Get all embeddings for user
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/document_embeddings?user_id=eq.{user_id}&select=*",
                headers=self._get_headers("supabase")
            )
            
            if response.status_code != 200:
                return []
            
            embeddings = response.json()
        
        # Calculate similarities
        query_vec = np.array(query_embedding)
        similarities = []
        
        for emb in embeddings:
            stored_vec = np.array(emb.get("embedding", []))
            
            if len(stored_vec) != len(query_vec):
                continue
            
            # Cosine similarity
            similarity = np.dot(query_vec, stored_vec) / (
                np.linalg.norm(query_vec) * np.linalg.norm(stored_vec)
            )
            
            if similarity >= threshold:
                similarities.append({
                    "document_id": emb.get("document_id"),
                    "chunk_text": emb.get("chunk_text"),
                    "chunk_index": emb.get("chunk_index"),
                    "similarity": float(similarity)
                })
        
        # Sort by similarity and return top results
        similarities.sort(key=lambda x: x["similarity"], reverse=True)
        return similarities[:limit]
    
    async def get_document_chunks(
        self,
        document_id: str
    ) -> List[Dict[str, Any]]:
        """Get all chunks for a document."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/document_embeddings?document_id=eq.{document_id}&select=*&order=chunk_index",
                headers=self._get_headers("supabase")
            )
            
            if response.status_code == 200:
                return response.json()
        
        return []
    
    async def delete_document_embeddings(self, document_id: str) -> bool:
        """Delete all embeddings for a document."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.delete(
                f"{self.supabase_url}/rest/v1/document_embeddings?document_id=eq.{document_id}",
                headers=self._get_headers("supabase")
            )
            
            return response.status_code == 200


# Singleton instance
embedding_service = EmbeddingService()
