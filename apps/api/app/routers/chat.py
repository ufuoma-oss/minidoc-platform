"""
MiniDoc - Chat Router
API endpoints for chat functionality with memory and document support.
"""
from fastapi import APIRouter, UploadFile, File, Form
from app.models.schemas import (
    ChatRequest,
    ChatResponse,
    IntentRequest,
    IntentResponse,
    AgentInfo,
    SystemStatus,
    AgentType,
)
from app.core.agent_manager import agent_manager
from app.core.intent import intent_detector
from app.core.memory import memory_system
from typing import Optional
import json

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.get("", response_model=dict)
async def api_info():
    """Get API information."""
    return {
        "name": "MiniDoc Chat API",
        "version": "1.0.0",
        "features": [
            "Multi-agent chat",
            "Tool calling",
            "Document analysis",
            "Web search",
            "File generation"
        ],
        "endpoints": {
            "POST /api/chat": "Send a chat message",
            "POST /api/chat/upload": "Upload a document",
            "GET /api/chat/documents": "List user documents",
            "GET /api/chat/status": "Get system status",
            "GET /api/chat/agents": "List available agents",
            "POST /api/chat/intent": "Detect message intent",
        }
    }


@router.post("", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send a chat message and get a response with tool calling."""
    import uuid
    session_id = request.session_id or str(uuid.uuid4())
    user_id = request.user_id or "demo-user"

    # Get context from memory
    context_str = await memory_system.get_context_for_query(
        user_id=user_id,
        query=request.message,
        documents=request.documents
    )

    # Build enhanced context
    context = {
        "session_id": session_id,
        "user_id": user_id,
        "documents": request.documents or [],
        "history": request.history or [],
        "memory_context": context_str
    }

    response = await agent_manager.process_message(
        message=request.message,
        session_id=session_id,
        user_id=user_id,
        documents=request.documents,
        history=request.history,
    )

    return response


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Form(default="demo-user"),
    category: str = Form(default="general")
):
    """Upload a document for the user."""
    import time
    
    # Read file content
    content = await file.read()
    
    # Determine content type
    content_type = file.content_type or "application/octet-stream"
    
    # Extract text based on type
    extracted_text = ""
    if content_type.startswith("text/"):
        extracted_text = content.decode("utf-8", errors="ignore")
    elif content_type == "application/pdf":
        extracted_text = "[PDF document - requires extraction]"
    elif content_type.startswith("image/"):
        extracted_text = "[Image - requires vision analysis]"
    else:
        extracted_text = f"[{content_type} document]"
    
    # Create document record
    document = {
        "id": f"doc_{int(time.time())}",
        "filename": file.filename,
        "originalName": file.filename,
        "mimeType": content_type,
        "size": len(content),
        "category": category,
        "extractedText": extracted_text,
        "status": "ready"
    }
    
    # Store in memory system
    await memory_system.store_document_memory(
        user_id=user_id,
        document_id=document["id"],
        content=extracted_text,
        metadata={"filename": file.filename, "category": category}
    )
    
    return {
        "success": True,
        "document": document,
        "message": f"Document '{file.filename}' uploaded successfully"
    }


@router.get("/documents")
async def list_documents(user_id: str = "demo-user"):
    """List all documents for a user."""
    # In production, fetch from database
    return {
        "documents": [],
        "count": 0,
        "message": "No documents found. Upload some documents to get started."
    }


@router.get("/status", response_model=SystemStatus)
async def get_status():
    """Get system status."""
    return SystemStatus(
        status="operational" if agent_manager.is_initialized() else "initializing",
        version="1.0.0",
        agents_count=len(agent_manager.get_registered_agents()),
        initialized=agent_manager.is_initialized(),
        uptime_seconds=agent_manager.get_uptime(),
    )


@router.get("/agents", response_model=list[AgentInfo])
async def list_agents():
    """List all available agents."""
    agents = []
    for agent_type in agent_manager.get_registered_agents():
        info = agent_manager.get_agent_info(agent_type)
        if info:
            agents.append(AgentInfo(**info))
    return agents


@router.post("/intent", response_model=IntentResponse)
async def detect_intent(request: IntentRequest):
    """Detect intent for a message."""
    return intent_detector.detect(request.message)
