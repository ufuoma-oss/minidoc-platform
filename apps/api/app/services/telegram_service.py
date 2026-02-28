"""
MiniDoc - Telegram Service
Telegram bot for controller channel integration.
"""
import os
import json
import asyncio
from typing import Dict, Any, Optional, List, Callable
from datetime import datetime
import httpx


class TelegramService:
    """Service for Telegram bot integration."""
    
    API_BASE = "https://api.telegram.org/bot"
    
    def __init__(self):
        self.bot_token = os.getenv("TELEGRAM_BOT_TOKEN", "")
        self.chat_id = os.getenv("TELEGRAM_CHAT_ID", "")  # Main controller channel
        self.supabase_url = os.getenv("SUPABASE_URL", "")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY", os.getenv("SUPABASE_ANON_KEY", ""))
        
        # Command handlers
        self.command_handlers: Dict[str, Callable] = {}
    
    def _get_headers(self) -> dict:
        """Get headers for Supabase API requests."""
        return {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json",
        }
    
    async def _request(self, method: str, endpoint: str, data: dict = None) -> dict:
        """Make a request to Telegram API."""
        url = f"{self.API_BASE}{self.bot_token}/{endpoint}"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            if method == "GET":
                response = await client.get(url, params=data)
            elif method == "POST":
                response = await client.post(url, json=data)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            if response.status_code == 200:
                return {"success": True, "data": response.json()}
            else:
                return {"success": False, "error": response.text}
    
    # ==================== Bot API Methods ====================
    
    async def send_message(
        self,
        chat_id: str,
        text: str,
        parse_mode: str = "Markdown",
        reply_markup: dict = None
    ) -> Dict[str, Any]:
        """
        Send a message to a Telegram chat.
        
        Args:
            chat_id: Target chat ID
            text: Message text
            parse_mode: Parse mode (Markdown, HTML, or empty)
            reply_markup: Optional inline keyboard or reply markup
            
        Returns:
            Dict with message info
        """
        data = {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": parse_mode
        }
        
        if reply_markup:
            data["reply_markup"] = reply_markup
        
        result = await self._request("POST", "sendMessage", data)
        
        if result["success"]:
            return {
                "success": True,
                "message_id": result["data"]["result"]["message_id"],
                "chat_id": result["data"]["result"]["chat"]["id"]
            }
        
        return result
    
    async def send_to_controller(self, text: str, parse_mode: str = "Markdown") -> Dict[str, Any]:
        """Send message to the main controller channel."""
        if not self.chat_id:
            return {"success": False, "error": "Controller chat ID not configured"}
        
        return await self.send_message(self.chat_id, text, parse_mode)
    
    async def edit_message(
        self,
        chat_id: str,
        message_id: int,
        text: str,
        parse_mode: str = "Markdown"
    ) -> Dict[str, Any]:
        """Edit an existing message."""
        data = {
            "chat_id": chat_id,
            "message_id": message_id,
            "text": text,
            "parse_mode": parse_mode
        }
        
        return await self._request("POST", "editMessageText", data)
    
    async def delete_message(
        self,
        chat_id: str,
        message_id: int
    ) -> Dict[str, Any]:
        """Delete a message."""
        data = {
            "chat_id": chat_id,
            "message_id": message_id
        }
        
        return await self._request("POST", "deleteMessage", data)
    
    async def send_document(
        self,
        chat_id: str,
        document_url: str = None,
        document_bytes: bytes = None,
        filename: str = "document",
        caption: str = ""
    ) -> Dict[str, Any]:
        """Send a document to a chat."""
        url = f"{self.API_BASE}{self.bot_token}/sendDocument"
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            if document_url:
                data = {
                    "chat_id": chat_id,
                    "document": document_url,
                    "caption": caption
                }
                response = await client.post(url, json=data)
            elif document_bytes:
                files = {"document": (filename, document_bytes)}
                data = {"chat_id": chat_id, "caption": caption}
                response = await client.post(url, data=data, files=files)
            else:
                return {"success": False, "error": "No document provided"}
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "message_id": response.json()["result"]["message_id"]
                }
            
            return {"success": False, "error": response.text}
    
    async def send_photo(
        self,
        chat_id: str,
        photo_url: str = None,
        photo_bytes: bytes = None,
        caption: str = ""
    ) -> Dict[str, Any]:
        """Send a photo to a chat."""
        url = f"{self.API_BASE}{self.bot_token}/sendPhoto"
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            if photo_url:
                data = {
                    "chat_id": chat_id,
                    "photo": photo_url,
                    "caption": caption
                }
                response = await client.post(url, json=data)
            elif photo_bytes:
                files = {"photo": ("photo.jpg", photo_bytes)}
                data = {"chat_id": chat_id, "caption": caption}
                response = await client.post(url, data=data, files=files)
            else:
                return {"success": False, "error": "No photo provided"}
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "message_id": response.json()["result"]["message_id"]
                }
            
            return {"success": False, "error": response.text}
    
    async def answer_callback_query(
        self,
        callback_query_id: str,
        text: str = "",
        show_alert: bool = False
    ) -> Dict[str, Any]:
        """Answer a callback query from inline button."""
        data = {
            "callback_query_id": callback_query_id,
            "text": text,
            "show_alert": show_alert
        }
        
        return await self._request("POST", "answerCallbackQuery", data)
    
    async def get_me(self) -> Dict[str, Any]:
        """Get bot information."""
        return await self._request("GET", "getMe")
    
    async def get_updates(
        self,
        offset: int = None,
        limit: int = 100,
        timeout: int = 0
    ) -> Dict[str, Any]:
        """Get new updates (messages, callbacks, etc.)."""
        data = {"limit": limit, "timeout": timeout}
        if offset:
            data["offset"] = offset
        
        return await self._request("GET", "getUpdates", data)
    
    async def set_webhook(self, webhook_url: str) -> Dict[str, Any]:
        """Set webhook for receiving updates."""
        data = {"url": webhook_url}
        return await self._request("POST", "setWebhook", data)
    
    async def delete_webhook(self) -> Dict[str, Any]:
        """Delete webhook."""
        return await self._request("POST", "deleteWebhook")
    
    # ==================== Inline Keyboards ====================
    
    def create_inline_keyboard(self, buttons: List[List[Dict[str, str]]]) -> dict:
        """
        Create an inline keyboard.
        
        Args:
            buttons: 2D array of button definitions
                     Each button: {"text": "Button Text", "callback_data": "action:value"}
        
        Returns:
            Inline keyboard markup
        """
        return {"inline_keyboard": buttons}
    
    def create_reply_keyboard(self, buttons: List[List[str]], one_time: bool = True) -> dict:
        """Create a reply keyboard."""
        keyboard = [[{"text": btn} for btn in row] for row in buttons]
        return {
            "keyboard": keyboard,
            "one_time_keyboard": one_time,
            "resize_keyboard": True
        }
    
    # ==================== Command Handling ====================
    
    def register_command(self, command: str, handler: Callable):
        """Register a command handler."""
        self.command_handlers[command.lower()] = handler
    
    async def process_update(self, update: dict) -> Optional[dict]:
        """
        Process an incoming update from Telegram.
        
        Args:
            update: Raw update from Telegram
            
        Returns:
            Response dict if a command was processed
        """
        # Handle callback queries
        if "callback_query" in update:
            callback = update["callback_query"]
            query_id = callback["id"]
            message = callback.get("message", {})
            chat_id = message.get("chat", {}).get("id")
            user_id = str(callback["from"]["id"])
            data = callback.get("data", "")
            
            # Answer the callback
            await self.answer_callback_query(query_id, "Processing...")
            
            return {
                "type": "callback",
                "user_id": user_id,
                "chat_id": chat_id,
                "message_id": message.get("message_id"),
                "data": data
            }
        
        # Handle messages
        if "message" in update:
            message = update["message"]
            chat_id = message.get("chat", {}).get("id")
            user_id = str(message.get("from", {}).get("id", ""))
            text = message.get("text", "")
            
            # Check for command
            if text.startswith("/"):
                parts = text.split(maxsplit=1)
                command = parts[0].lower().lstrip("/")
                args = parts[1] if len(parts) > 1 else ""
                
                # Check if command is registered
                if command in self.command_handlers:
                    handler = self.command_handlers[command]
                    result = await handler(user_id, chat_id, args)
                    return result
                
                return {
                    "type": "command",
                    "command": command,
                    "user_id": user_id,
                    "chat_id": chat_id,
                    "args": args
                }
            
            # Regular message
            return {
                "type": "message",
                "user_id": user_id,
                "chat_id": chat_id,
                "text": text
            }
        
        return None
    
    # ==================== User Management ====================
    
    async def register_telegram_user(
        self,
        user_id: str,
        telegram_id: str,
        username: str = ""
    ) -> Dict[str, Any]:
        """Register a Telegram user for notifications."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Check if already registered
            check_response = await client.get(
                f"{self.supabase_url}/rest/v1/telegram_users?user_id=eq.{user_id}",
                headers=self._get_headers()
            )
            
            existing = check_response.json() if check_response.status_code == 200 else []
            
            user_data = {
                "user_id": user_id,
                "telegram_id": telegram_id,
                "telegram_username": username,
                "registered_at": datetime.utcnow().isoformat(),
                "is_active": True
            }
            
            if existing:
                # Update
                response = await client.patch(
                    f"{self.supabase_url}/rest/v1/telegram_users?user_id=eq.{user_id}",
                    headers=self._get_headers(),
                    json=user_data
                )
            else:
                # Create
                response = await client.post(
                    f"{self.supabase_url}/rest/v1/telegram_users",
                    headers=self._get_headers(),
                    json=user_data
                )
            
            if response.status_code in [200, 201]:
                return {"success": True}
            
            return {"success": False, "error": response.text}
    
    async def get_user_telegram(self, user_id: str) -> Optional[str]:
        """Get Telegram chat ID for a user."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/telegram_users?user_id=eq.{user_id}&is_active=eq.true",
                headers=self._get_headers()
            )
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    return data[0].get("telegram_id")
        
        return None
    
    async def notify_user(self, user_id: str, message: str) -> bool:
        """Send a notification to a user via Telegram."""
        telegram_id = await self.get_user_telegram(user_id)
        
        if telegram_id:
            result = await self.send_message(telegram_id, message)
            return result.get("success", False)
        
        return False
    
    # ==================== Automation Notifications ====================
    
    async def notify_automation_complete(
        self,
        user_id: str,
        automation_name: str,
        result: str
    ):
        """Notify user that an automation completed."""
        message = f"✅ *Automation Complete*\n\n*{automation_name}*\n\n{result}"
        await self.notify_user(user_id, message)
    
    async def notify_document_processed(
        self,
        user_id: str,
        document_name: str,
        summary: str = ""
    ):
        """Notify user that a document was processed."""
        message = f"📄 *Document Processed*\n\n*{document_name}*\n\n{summary}"
        await self.notify_user(user_id, message)
    
    async def notify_email_received(
        self,
        user_id: str,
        from_addr: str,
        subject: str,
        snippet: str
    ):
        """Notify user about an important email."""
        message = f"📧 *New Email*\n\n*From:* {from_addr}\n*Subject:* {subject}\n\n{snippet}"
        await self.notify_user(user_id, message)


# Singleton instance
telegram_service = TelegramService()
