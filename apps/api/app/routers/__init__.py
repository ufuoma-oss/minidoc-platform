"""
MiniDoc - Routers Package
"""
from .chat import router as chat_router
from .vlm import router as vlm_router
from .pdf import router as pdf_router
from .documents import router as documents_router
from .integrations import router as integrations_router
from .telegram import router as telegram_router
from .automations import router as automations_router

__all__ = [
    "chat_router",
    "vlm_router", 
    "pdf_router",
    "documents_router",
    "integrations_router",
    "telegram_router",
    "automations_router"
]
