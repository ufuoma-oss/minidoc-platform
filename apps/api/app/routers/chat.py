"""
MiniDoc - Chat Router
API endpoints for chat functionality with memory and document support.
"""
from fastapi import APIRouter, UploadFile, File, Form, Query, HTTPException
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
from app.core.supabase_client import supabase_client
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
            "File generation",
            "Supabase integration"
        ],
        "endpoints": {
            "POST /api/chat": "Send a chat message",
            "POST /api/chat/upload": "Upload a document",
            "GET /api/chat/documents": "List user documents",
            "DELETE /api/chat/documents/{doc_id}": "Delete a document",
            "GET /api/chat/conversations": "List conversations",
            "POST /api/chat/conversations": "Create conversation",
            "GET /api/chat/conversations/{conv_id}": "Get conversation",
            "DELETE /api/chat/conversations/{conv_id}": "Delete conversation",
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

    # Update user message count
    if supabase_client.supabase_url:
        await supabase_client.update_user_usage(user_id, messages=1)

    return response


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Form(default="demo-user"),
    category: str = Form(default="general")
):
    """Upload a document to Supabase storage."""
    # Read file content
    content = await file.read()
    
    # Determine content type
    content_type = file.content_type or "application/octet-stream"
    
    # Check if Supabase is configured
    if supabase_client.supabase_url:
        # Upload to Supabase
        result = await supabase_client.upload_document(
            user_id=user_id,
            file_name=file.filename,
            file_content=content,
            content_type=content_type,
            category=category
        )
        
        if result["success"]:
            return {
                "success": True,
                "document": result["document"],
                "message": f"Document '{file.filename}' uploaded successfully"
            }
        
        # Fallback to local storage if Supabase fails
        print(f"[Upload] Supabase upload failed: {result.get('error')}")
    
    # Local fallback
    import time
    extracted_text = ""
    if content_type.startswith("text/"):
        extracted_text = content.decode("utf-8", errors="ignore")
    elif content_type == "application/pdf":
        extracted_text = "[PDF document - requires extraction]"
    elif content_type.startswith("image/"):
        extracted_text = "[Image - requires vision analysis]"
    else:
        extracted_text = f"[{content_type} document]"
    
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
async def list_documents(
    user_id: str = Query(default="demo-user"),
    limit: int = Query(default=50)
):
    """List all documents for a user."""
    # Try Supabase first
    if supabase_client.supabase_url:
        documents = await supabase_client.get_documents(user_id, limit)
        return {
            "documents": documents,
            "count": len(documents),
            "source": "supabase"
        }
    
    # Fallback
    return {
        "documents": [],
        "count": 0,
        "source": "local",
        "message": "No documents found. Upload some documents to get started."
    }


@router.delete("/documents/{document_id}")
async def delete_document(document_id: str, user_id: str = Query(default="demo-user")):
    """Delete a document."""
    if supabase_client.supabase_url:
        success = await supabase_client.delete_document(document_id, user_id)
        if success:
            return {"success": True, "message": "Document deleted"}
        raise HTTPException(status_code=404, detail="Document not found")
    
    return {"success": True, "message": "Document deleted (local)"}


@router.get("/conversations")
async def list_conversations(
    user_id: str = Query(default="demo-user"),
    limit: int = Query(default=20)
):
    """List all conversations for a user."""
    if supabase_client.supabase_url:
        conversations = await supabase_client.get_conversations(user_id, limit)
        return {
            "conversations": conversations,
            "count": len(conversations)
        }
    
    return {
        "conversations": [],
        "count": 0
    }


@router.post("/conversations")
async def create_conversation(
    user_id: str = Query(default="demo-user"),
    title: str = Query(default="New Chat")
):
    """Create a new conversation."""
    if supabase_client.supabase_url:
        conversation = await supabase_client.create_conversation(user_id, title)
        return {"success": True, "conversation": conversation}
    
    import uuid
    return {
        "success": True,
        "conversation": {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "title": title,
            "messages": []
        }
    }


@router.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    user_id: str = Query(default="demo-user")
):
    """Get a conversation with messages."""
    if supabase_client.supabase_url:
        conversation = await supabase_client.get_conversation(conversation_id, user_id)
        if conversation:
            return {"success": True, "conversation": conversation}
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return {
        "success": False,
        "message": "Supabase not configured"
    }


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    user_id: str = Query(default="demo-user")
):
    """Delete a conversation."""
    if supabase_client.supabase_url:
        success = await supabase_client.delete_conversation(conversation_id, user_id)
        if success:
            return {"success": True, "message": "Conversation deleted"}
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return {"success": True, "message": "Conversation deleted (local)"}


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
