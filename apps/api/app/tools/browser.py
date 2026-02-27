"""
MiniDoc - Browser Tools
Web search and browsing using z.ai SDK.
"""
from app.core.zai_client import zai_client


async def browser_search(query: str, num_results: int = 5) -> dict:
    """
    Search the web using z.ai SDK.
    Returns real search results from the internet.
    """
    result = await zai_client.web_search(query, num_results)
    
    if result.get("success"):
        results = result.get("results", [])
        
        # Format results for display
        formatted = []
        for r in results[:num_results]:
            formatted.append({
                "title": r.get("name", r.get("title", "Untitled")),
                "url": r.get("url", ""),
                "snippet": r.get("snippet", r.get("content", ""))[:200],
                "source": r.get("host_name", "web")
            })
        
        return {
            "success": True,
            "query": query,
            "results": formatted,
            "count": len(formatted),
            "message": f"Found {len(formatted)} results for '{query}'"
        }
    
    return {
        "success": False,
        "query": query,
        "results": [],
        "error": result.get("error", "Search failed")
    }


async def browse_web(url: str) -> dict:
    """
    Browse and extract content from a webpage.
    Uses z.ai SDK for content extraction.
    """
    result = await zai_client.web_read(url)
    
    if result.get("success"):
        content = result.get("content", "")
        
        return {
            "success": True,
            "url": url,
            "title": result.get("title", ""),
            "content": content[:5000],  # Limit content length
            "word_count": len(content.split()),
            "message": f"Extracted content from {url}"
        }
    
    return {
        "success": False,
        "url": url,
        "error": result.get("error", "Failed to browse webpage")
    }
