"""
MiniDoc - API Schemas
Pydantic models for request/response validation.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class AgentType(str, Enum):
    LIBRARIAN = "librarian"
    WEB = "web"
    WRITER = "writer"
    EMAIL = "email"
    SLIDE = "slide"
    FILE = "file"


class IntentCategory(str, Enum):
    CONVERSATION = "conversation"
    DOCUMENT = "document"
    CREATION = "creation"
    WEB_SEARCH = "web_search"
    EMAIL = "email"
    FILE = "file"


class Citation(BaseModel):
    """Citation for response."""
    source: str
    title: Optional[str] = None
    url: Optional[str] = None
    snippet: Optional[str] = None


class ChatRequest(BaseModel):
    """Chat message request."""
    message: str = Field(..., min_length=1, max_length=10000)
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    documents: Optional[list[dict]] = None
    history: Optional[list[dict]] = None


class ChatResponse(BaseModel):
    """Chat response."""
    response: str
    agent: AgentType
    citations: list[Citation] = []
    suggested_actions: list[str] = []
    session_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class IntentRequest(BaseModel):
    """Intent detection request."""
    message: str = Field(..., min_length=1, max_length=10000)


class IntentResponse(BaseModel):
    """Intent detection response."""
    category: IntentCategory
    target_agent: AgentType
    confidence: float
    entities: list[dict] = []


class AgentInfo(BaseModel):
    """Agent information."""
    name: str
    type: AgentType
    description: str
    capabilities: list[str]
    status: str = "ready"


class SystemStatus(BaseModel):
    """System status response."""
    status: str
    version: str
    agents_count: int
    initialized: bool
    uptime_seconds: float
