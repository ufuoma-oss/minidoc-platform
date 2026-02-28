"""
MiniDoc - Telegram Router
API endpoints for Telegram bot integration.
"""
from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import json

from app.services.telegram_service import telegram_service

router = APIRouter(prefix="/api/telegram", tags=["telegram"])


# ==================== Request Models ====================

class SendMessageRequest(BaseModel):
    chat_id: str
    text: str
    parse_mode: str = "Markdown"


class RegisterUserRequest(BaseModel):
    user_id: str
    telegram_id: str
    username: Optional[str] = ""


class NotifyUserRequest(BaseModel):
    user_id: str
    message: str


# ==================== Endpoints ====================

@router.get("")
async def telegram_api_info():
    """Get Telegram API information."""
    return {
        "name": "MiniDoc Telegram API",
        "version": "1.0.0",
        "features": [
            "Bot messaging",
            "Controller channel notifications",
            "User notifications",
            "Webhook support"
        ],
        "endpoints": {
            "GET /api/telegram/bot/info": "Get bot information",
            "POST /api/telegram/send": "Send message to chat",
            "POST /api/telegram/notify": "Notify user",
            "POST /api/telegram/register": "Register user for notifications",
            "POST /api/telegram/webhook": "Webhook for bot updates",
            "GET /api/telegram/webhook/set": "Set webhook URL"
        }
    }


@router.get("/bot/info")
async def get_bot_info():
    """Get Telegram bot information."""
    result = await telegram_service.get_me()
    
    if result.get("success"):
        return {
            "success": True,
            "bot": result["data"]["result"]
        }
    
    return {
        "success": False,
        "error": result.get("error", "Failed to get bot info"),
        "configured": bool(telegram_service.bot_token)
    }


@router.post("/send")
async def send_message(request: SendMessageRequest):
    """Send a message to a Telegram chat."""
    result = await telegram_service.send_message(
        chat_id=request.chat_id,
        text=request.text,
        parse_mode=request.parse_mode
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


@router.post("/send-document")
async def send_document(
    chat_id: str,
    document_url: str,
    caption: str = ""
):
    """Send a document to a Telegram chat."""
    result = await telegram_service.send_document(
        chat_id=chat_id,
        document_url=document_url,
        caption=caption
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


@router.post("/notify")
async def notify_user(request: NotifyUserRequest):
    """Send a notification to a registered user."""
    result = await telegram_service.notify_user(
        user_id=request.user_id,
        message=request.message
    )
    
    if not result:
        raise HTTPException(
            status_code=404, 
            detail="User not registered for Telegram notifications"
        )
    
    return {"success": True}


@router.post("/register")
async def register_user(request: RegisterUserRequest):
    """Register a user for Telegram notifications."""
    result = await telegram_service.register_telegram_user(
        user_id=request.user_id,
        telegram_id=request.telegram_id,
        username=request.username
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return {"success": True, "message": "User registered for Telegram notifications"}


@router.post("/webhook")
async def telegram_webhook(request: Request):
    """
    Handle incoming webhook updates from Telegram.
    
    This is the main endpoint for receiving bot updates.
    """
    try:
        update = await request.json()
        
        # Process the update
        result = await telegram_service.process_update(update)
        
        if result:
            # Handle different update types
            if result["type"] == "command":
                # Handle known commands
                command = result.get("command", "")
                user_id = result.get("user_id", "")
                chat_id = result.get("chat_id", "")
                
                if command == "start":
                    await telegram_service.send_message(
                        chat_id,
                        "Welcome to MiniDoc! Use /help to see available commands."
                    )
                elif command == "help":
                    help_text = """*MiniDoc Bot Commands*

/help - Show this help
/status - Check your connection status
/notify - Toggle notifications
/link - Link your Telegram to MiniDoc account

*You'll receive notifications for:*
- Document processing
- Automation completions
- Important emails"""
                    await telegram_service.send_message(chat_id, help_text)
                elif command == "status":
                    await telegram_service.send_message(
                        chat_id,
                        "Your MiniDoc connection is active."
                    )
                else:
                    await telegram_service.send_message(
                        chat_id,
                        f"Unknown command: /{command}. Use /help for available commands."
                    )
            
            elif result["type"] == "message":
                # Echo back or handle regular messages
                pass
            
            elif result["type"] == "callback":
                # Handle inline button callbacks
                pass
        
        return {"ok": True}
    
    except Exception as e:
        print(f"[Telegram] Webhook error: {e}")
        return {"ok": True}  # Always return 200 to Telegram


@router.get("/webhook/set")
async def set_webhook():
    """Set the webhook URL for the bot."""
    import os
    
    # Get the current server URL
    api_url = os.getenv("RENDER_EXTERNAL_URL", "https://minidoc-api.onrender.com")
    webhook_url = f"{api_url}/api/telegram/webhook"
    
    result = await telegram_service.set_webhook(webhook_url)
    
    if result.get("success"):
        return {
            "success": True,
            "webhook_url": webhook_url,
            "message": "Webhook set successfully"
        }
    
    return {
        "success": False,
        "error": result.get("error")
    }


@router.delete("/webhook")
async def delete_webhook():
    """Delete the webhook."""
    result = await telegram_service.delete_webhook()
    
    return {
        "success": result.get("success", False)
    }
