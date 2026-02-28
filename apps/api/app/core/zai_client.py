"""
MiniDoc - Z.AI SDK Integration
Real web search and browsing using z-ai-web-dev-sdk.
"""
import os
import json
import httpx
from typing import Optional


class ZAIClient:
    """
    Client for z.ai SDK functions.
    Provides web search, web reading, and other AI capabilities.
    """
    
    def __init__(self):
        self.api_key = os.getenv("ZAI_API_KEY", "")
        self.base_url = "https://api.z.ai/internal"  # Internal API endpoint
    
    async def web_search(self, query: str, num_results: int = 5) -> dict:
        """
        Perform web search using z.ai SDK.
        Returns real search results from the web.
        """
        try:
            # Use the z.ai SDK HTTP endpoint
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/functions/web_search",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "query": query,
                        "num": num_results
                    }
                )
                
                if response.status_code == 200:
                    results = response.json()
                    return {
                        "success": True,
                        "results": results,
                        "query": query
                    }
                
                print(f"[ZAI] Web search error: {response.status_code}")
                
        except Exception as e:
            print(f"[ZAI] Error: {e}")
        
        # Fallback results
        return {
            "success": False,
            "results": [],
            "query": query,
            "error": "Web search unavailable - connect ZAI_API_KEY"
        }
    
    async def web_read(self, url: str) -> dict:
        """
        Read content from a webpage using z.ai SDK.
        Extracts text content from any URL.
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/functions/web_read",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={"url": url}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "url": url,
                        "content": data.get("content", ""),
                        "title": data.get("title", ""),
                        "summary": data.get("summary", "")
                    }
                
        except Exception as e:
            print(f"[ZAI] Web read error: {e}")
        
        # Fallback: direct fetch
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.get(url, follow_redirects=True)
                if response.status_code == 200:
                    return {
                        "success": True,
                        "url": url,
                        "content": response.text[:5000],
                        "title": url,
                        "summary": ""
                    }
        except Exception as e:
            print(f"[ZAI] Direct fetch error: {e}")
        
        return {
            "success": False,
            "url": url,
            "error": "Failed to read webpage"
        }
    
    async def llm_complete(
        self,
        messages: list[dict],
        model: str = "kimi-k2-instruct",
        tools: list = None
    ) -> dict:
        """
        Use z.ai SDK for LLM completion (alternative to direct NVIDIA NIM).
        """
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                body = {
                    "model": model,
                    "messages": messages
                }
                if tools:
                    body["tools"] = tools
                
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json=body
                )
                
                if response.status_code == 200:
                    return response.json()
                
        except Exception as e:
            print(f"[ZAI] LLM error: {e}")
        
        return {"error": "LLM unavailable"}


# Singleton
zai_client = ZAIClient()
