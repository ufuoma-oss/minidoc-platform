"""
MiniDoc - Integrations Router
API endpoints for OAuth and app integrations.
"""
from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import os

from app.services.oauth_service import oauth_service
from app.services.google_service import google_service
from app.services.microsoft_service import microsoft_service

router = APIRouter(prefix="/api/integrations", tags=["integrations"])


# ==================== Request Models ====================

class SendEmailRequest(BaseModel):
    to: str
    subject: str
    body: str
    cc: Optional[str] = None
    bcc: Optional[str] = None
    html: bool = False


class DraftEmailRequest(BaseModel):
    to: str
    subject: str
    body: str


class CreateEventRequest(BaseModel):
    title: str
    start: str  # ISO format
    end: str  # ISO format
    description: Optional[str] = ""
    location: Optional[str] = ""
    attendees: Optional[List[str]] = None
    timezone: str = "UTC"


class UploadFileRequest(BaseModel):
    filename: str
    content_base64: str
    mime_type: str
    parent_path: Optional[str] = ""


# ==================== Integration Status ====================

@router.get("")
async def integrations_info():
    """Get integrations API information."""
    return {
        "name": "MiniDoc Integrations API",
        "version": "1.0.0",
        "providers": ["google", "microsoft"],
        "features": [
            "OAuth authentication",
            "Gmail / Outlook integration",
            "Google Drive / OneDrive integration",
            "Google Calendar / Outlook Calendar integration"
        ],
        "endpoints": {
            # Google
            "GET /api/integrations/google/connect": "Start Google OAuth flow",
            "GET /api/integrations/google/callback": "Google OAuth callback",
            "DELETE /api/integrations/google/disconnect": "Disconnect Google",
            "GET /api/integrations/google/status": "Check Google connection status",
            # Gmail
            "GET /api/integrations/gmail/emails": "List Gmail emails",
            "POST /api/integrations/gmail/send": "Send Gmail email",
            "POST /api/integrations/gmail/draft": "Create Gmail draft",
            # Google Drive
            "GET /api/integrations/drive/files": "List Google Drive files",
            "GET /api/integrations/drive/files/{file_id}": "Get file details",
            "POST /api/integrations/drive/upload": "Upload to Google Drive",
            # Google Calendar
            "GET /api/integrations/calendar/events": "List calendar events",
            "POST /api/integrations/calendar/events": "Create calendar event",
            # Microsoft
            "GET /api/integrations/microsoft/connect": "Start Microsoft OAuth flow",
            "GET /api/integrations/microsoft/callback": "Microsoft OAuth callback",
            "DELETE /api/integrations/microsoft/disconnect": "Disconnect Microsoft",
            # Outlook
            "GET /api/integrations/outlook/emails": "List Outlook emails",
            "POST /api/integrations/outlook/send": "Send Outlook email",
            # OneDrive
            "GET /api/integrations/onedrive/files": "List OneDrive files"
        }
    }


# ==================== Google OAuth ====================

@router.get("/google/connect")
async def google_connect(user_id: str = Query(default="demo-user")):
    """Start Google OAuth flow."""
    result = oauth_service.generate_auth_url("google", user_id)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return {"auth_url": result["auth_url"]}


@router.get("/google/callback")
async def google_callback(code: str = Query(...), state: str = Query(...)):
    """Handle Google OAuth callback."""
    # Parse state to get user_id
    parts = state.split(":")
    user_id = parts[0] if len(parts) > 0 else "demo-user"
    
    # Exchange code for tokens
    result = await oauth_service.exchange_code("google", code)
    
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "OAuth failed"))
    
    # Store connection
    await oauth_service.store_connection(
        user_id=user_id,
        provider="google",
        access_token=result["access_token"],
        refresh_token=result.get("refresh_token", ""),
        expires_at=result["expires_at"],
        scope=result.get("scope", "")
    )
    
    # Redirect to frontend
    frontend_url = os.getenv("FRONTEND_URL", "https://minidoc.vercel.app")
    return RedirectResponse(url=f"{frontend_url}/dashboard?connected=google")


@router.delete("/google/disconnect")
async def google_disconnect(user_id: str = Query(default="demo-user")):
    """Disconnect Google integration."""
    # Get connection to revoke
    connection = await oauth_service.get_connection(user_id, "google")
    
    if connection:
        # Revoke access
        await oauth_service.revoke_access("google", connection.get("access_token", ""))
        
        # Delete from database
        await oauth_service.delete_connection(user_id, "google")
    
    return {"success": True, "message": "Google disconnected"}


@router.get("/google/status")
async def google_status(user_id: str = Query(default="demo-user")):
    """Check Google connection status."""
    connection = await oauth_service.get_connection(user_id, "google")
    
    if connection:
        return {
            "connected": True,
            "provider": "google",
            "connected_at": connection.get("connected_at"),
            "scopes": connection.get("scopes", [])
        }
    
    return {"connected": False, "provider": "google"}


# ==================== Gmail ====================

@router.get("/gmail/emails")
async def list_gmail_emails(
    user_id: str = Query(default="demo-user"),
    query: str = Query(default=""),
    max_results: int = Query(default=10)
):
    """List emails from Gmail."""
    token = await oauth_service.get_valid_token(user_id, "google")
    
    if not token:
        raise HTTPException(status_code=401, detail="Google not connected")
    
    result = await google_service.get_emails(token, query, max_results)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


@router.get("/gmail/emails/{message_id}")
async def get_gmail_email(
    message_id: str,
    user_id: str = Query(default="demo-user")
):
    """Get full Gmail email content."""
    token = await oauth_service.get_valid_token(user_id, "google")
    
    if not token:
        raise HTTPException(status_code=401, detail="Google not connected")
    
    result = await google_service.get_email(token, message_id)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


@router.post("/gmail/send")
async def send_gmail_email(
    request: SendEmailRequest,
    user_id: str = Query(default="demo-user")
):
    """Send email via Gmail."""
    token = await oauth_service.get_valid_token(user_id, "google")
    
    if not token:
        raise HTTPException(status_code=401, detail="Google not connected")
    
    result = await google_service.send_email(
        token=token,
        to=request.to,
        subject=request.subject,
        body=request.body,
        cc=request.cc,
        bcc=request.bcc,
        html=request.html
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


@router.post("/gmail/draft")
async def draft_gmail_email(
    request: DraftEmailRequest,
    user_id: str = Query(default="demo-user")
):
    """Create email draft in Gmail."""
    token = await oauth_service.get_valid_token(user_id, "google")
    
    if not token:
        raise HTTPException(status_code=401, detail="Google not connected")
    
    result = await google_service.draft_email(
        token=token,
        to=request.to,
        subject=request.subject,
        body=request.body
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


# ==================== Google Drive ====================

@router.get("/drive/files")
async def list_drive_files(
    user_id: str = Query(default="demo-user"),
    query: str = Query(default=""),
    page_size: int = Query(default=20)
):
    """List files from Google Drive."""
    token = await oauth_service.get_valid_token(user_id, "google")
    
    if not token:
        raise HTTPException(status_code=401, detail="Google not connected")
    
    result = await google_service.list_files(token, query, page_size)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


@router.get("/drive/files/{file_id}")
async def get_drive_file(
    file_id: str,
    user_id: str = Query(default="demo-user")
):
    """Get Google Drive file metadata."""
    token = await oauth_service.get_valid_token(user_id, "google")
    
    if not token:
        raise HTTPException(status_code=401, detail="Google not connected")
    
    result = await google_service.get_file(token, file_id)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


@router.get("/drive/files/{file_id}/download")
async def download_drive_file(
    file_id: str,
    user_id: str = Query(default="demo-user")
):
    """Download a file from Google Drive."""
    token = await oauth_service.get_valid_token(user_id, "google")
    
    if not token:
        raise HTTPException(status_code=401, detail="Google not connected")
    
    result = await google_service.download_file(token, file_id)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return {
        "success": True,
        "filename": result["filename"],
        "mime_type": result["mime_type"],
        "size": result["size"]
    }


# ==================== Google Calendar ====================

@router.get("/calendar/events")
async def list_calendar_events(
    user_id: str = Query(default="demo-user"),
    days: int = Query(default=30)
):
    """List Google Calendar events."""
    token = await oauth_service.get_valid_token(user_id, "google")
    
    if not token:
        raise HTTPException(status_code=401, detail="Google not connected")
    
    from datetime import datetime, timedelta
    
    time_min = datetime.utcnow()
    time_max = time_min + timedelta(days=days)
    
    result = await google_service.get_events(token, time_min, time_max)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


@router.post("/calendar/events")
async def create_calendar_event(
    request: CreateEventRequest,
    user_id: str = Query(default="demo-user")
):
    """Create Google Calendar event."""
    token = await oauth_service.get_valid_token(user_id, "google")
    
    if not token:
        raise HTTPException(status_code=401, detail="Google not connected")
    
    start = datetime.fromisoformat(request.start.replace("Z", "+00:00"))
    end = datetime.fromisoformat(request.end.replace("Z", "+00:00"))
    
    result = await google_service.create_event(
        token=token,
        summary=request.title,
        start=start,
        end=end,
        description=request.description,
        location=request.location,
        attendees=request.attendees,
        timezone=request.timezone
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


# ==================== Microsoft OAuth ====================

@router.get("/microsoft/connect")
async def microsoft_connect(user_id: str = Query(default="demo-user")):
    """Start Microsoft OAuth flow."""
    result = oauth_service.generate_auth_url("microsoft", user_id)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return {"auth_url": result["auth_url"]}


@router.get("/microsoft/callback")
async def microsoft_callback(code: str = Query(...), state: str = Query(...)):
    """Handle Microsoft OAuth callback."""
    parts = state.split(":")
    user_id = parts[0] if len(parts) > 0 else "demo-user"
    
    result = await oauth_service.exchange_code("microsoft", code)
    
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "OAuth failed"))
    
    await oauth_service.store_connection(
        user_id=user_id,
        provider="microsoft",
        access_token=result["access_token"],
        refresh_token=result.get("refresh_token", ""),
        expires_at=result["expires_at"],
        scope=result.get("scope", "")
    )
    
    frontend_url = os.getenv("FRONTEND_URL", "https://minidoc.vercel.app")
    return RedirectResponse(url=f"{frontend_url}/dashboard?connected=microsoft")


@router.delete("/microsoft/disconnect")
async def microsoft_disconnect(user_id: str = Query(default="demo-user")):
    """Disconnect Microsoft integration."""
    await oauth_service.delete_connection(user_id, "microsoft")
    return {"success": True, "message": "Microsoft disconnected"}


@router.get("/microsoft/status")
async def microsoft_status(user_id: str = Query(default="demo-user")):
    """Check Microsoft connection status."""
    connection = await oauth_service.get_connection(user_id, "microsoft")
    
    if connection:
        return {
            "connected": True,
            "provider": "microsoft",
            "connected_at": connection.get("connected_at"),
            "scopes": connection.get("scopes", [])
        }
    
    return {"connected": False, "provider": "microsoft"}


# ==================== Outlook ====================

@router.get("/outlook/emails")
async def list_outlook_emails(
    user_id: str = Query(default="demo-user"),
    folder: str = Query(default="inbox"),
    search: str = Query(default=""),
    top: int = Query(default=10)
):
    """List emails from Outlook."""
    token = await oauth_service.get_valid_token(user_id, "microsoft")
    
    if not token:
        raise HTTPException(status_code=401, detail="Microsoft not connected")
    
    result = await microsoft_service.get_emails(token, folder, search, top)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


@router.post("/outlook/send")
async def send_outlook_email(
    request: SendEmailRequest,
    user_id: str = Query(default="demo-user")
):
    """Send email via Outlook."""
    token = await oauth_service.get_valid_token(user_id, "microsoft")
    
    if not token:
        raise HTTPException(status_code=401, detail="Microsoft not connected")
    
    to_list = [email.strip() for email in request.to.split(",")]
    cc_list = [email.strip() for email in request.cc.split(",")] if request.cc else None
    
    result = await microsoft_service.send_email(
        token=token,
        to=to_list,
        subject=request.subject,
        body=request.body,
        cc=cc_list,
        html=request.html
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


# ==================== OneDrive ====================

@router.get("/onedrive/files")
async def list_onedrive_files(
    user_id: str = Query(default="demo-user"),
    path: str = Query(default=""),
    top: int = Query(default=20)
):
    """List files from OneDrive."""
    token = await oauth_service.get_valid_token(user_id, "microsoft")
    
    if not token:
        raise HTTPException(status_code=401, detail="Microsoft not connected")
    
    result = await microsoft_service.list_files(token, path, top)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


@router.get("/onedrive/files/{file_id}")
async def get_onedrive_file(
    file_id: str,
    user_id: str = Query(default="demo-user")
):
    """Get OneDrive file metadata."""
    token = await oauth_service.get_valid_token(user_id, "microsoft")
    
    if not token:
        raise HTTPException(status_code=401, detail="Microsoft not connected")
    
    result = await microsoft_service.get_file(token, file_id)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


# ==================== Outlook Calendar ====================

@router.get("/outlook/calendar/events")
async def list_outlook_events(
    user_id: str = Query(default="demo-user"),
    days: int = Query(default=30)
):
    """List Outlook Calendar events."""
    token = await oauth_service.get_valid_token(user_id, "microsoft")
    
    if not token:
        raise HTTPException(status_code=401, detail="Microsoft not connected")
    
    from datetime import datetime, timedelta
    
    start = datetime.utcnow()
    end = start + timedelta(days=days)
    
    result = await microsoft_service.get_events(token, start, end)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


@router.post("/outlook/calendar/events")
async def create_outlook_event(
    request: CreateEventRequest,
    user_id: str = Query(default="demo-user")
):
    """Create Outlook Calendar event."""
    token = await oauth_service.get_valid_token(user_id, "microsoft")
    
    if not token:
        raise HTTPException(status_code=401, detail="Microsoft not connected")
    
    start = datetime.fromisoformat(request.start.replace("Z", "+00:00"))
    end = datetime.fromisoformat(request.end.replace("Z", "+00:00"))
    
    result = await microsoft_service.create_event(
        token=token,
        subject=request.title,
        start=start,
        end=end,
        body=request.description,
        location=request.location,
        attendees=request.attendees,
        timezone=request.timezone
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result
