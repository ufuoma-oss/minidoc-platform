"""
MiniDoc API - Main Application
FastAPI backend for the MiniDoc AI Assistant.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.agent_manager import agent_manager
from app.routers import chat, vlm, pdf, documents, integrations, telegram, automations


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    print("[MiniDoc] Starting up...")
    await agent_manager.initialize()
    print(f"[MiniDoc] Server ready at http://{settings.host}:{settings.port}")
    yield
    print("[MiniDoc] Shutting down...")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Personal AI Assistant with multi-agent system",
    lifespan=lifespan,
)

# CORS middleware - Allow all origins for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router)
app.include_router(vlm.router)
app.include_router(pdf.router)
app.include_router(documents.router)
app.include_router(integrations.router)
app.include_router(telegram.router)
app.include_router(automations.router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "operational",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}
