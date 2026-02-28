"""
MiniDoc - Automation Service
Task automation engine with triggers and actions.
"""
import os
import json
from typing import Dict, Any, Optional, List, Callable
from datetime import datetime, timedelta
from enum import Enum
import httpx


class TriggerType(str, Enum):
    SCHEDULE = "schedule"
    EMAIL_RECEIVED = "email_received"
    DOCUMENT_UPLOADED = "document_uploaded"
    WEBHOOK = "webhook"
    MANUAL = "manual"


class ActionType(str, Enum):
    SEND_EMAIL = "send_email"
    CREATE_DOCUMENT = "create_document"
    SEND_MESSAGE = "send_message"
    AI_PROCESS = "ai_process"
    WEBHOOK = "webhook"
    NOTIFY_TELEGRAM = "notify_telegram"


class AutomationService:
    """Service for task automation."""
    
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL", "")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY", os.getenv("SUPABASE_ANON_KEY", ""))
        
        # Action executors
        self.executors: Dict[str, Callable] = {}
    
    def _get_headers(self) -> dict:
        """Get headers for Supabase API requests."""
        return {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json",
        }
    
    # ==================== CRUD Operations ====================
    
    async def create_automation(
        self,
        user_id: str,
        name: str,
        description: str,
        trigger_type: str,
        trigger_config: Dict[str, Any],
        actions: List[Dict[str, Any]],
        enabled: bool = True
    ) -> Dict[str, Any]:
        """
        Create a new automation.
        
        Args:
            user_id: User ID
            name: Automation name
            description: Description
            trigger_type: Type of trigger (schedule, email_received, etc.)
            trigger_config: Trigger configuration
            actions: List of actions to execute
            enabled: Whether automation is active
            
        Returns:
            Created automation
        """
        automation_data = {
            "user_id": user_id,
            "name": name,
            "description": description,
            "trigger_type": trigger_type,
            "trigger_config": trigger_config,
            "actions": actions,
            "enabled": enabled,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.supabase_url}/rest/v1/automations",
                headers=self._get_headers(),
                json=automation_data
            )
            
            if response.status_code in [200, 201]:
                result = response.json()
                return {
                    "success": True,
                    "automation": result[0] if isinstance(result, list) else result
                }
            
            return {"success": False, "error": response.text}
    
    async def get_automations(
        self,
        user_id: str,
        enabled_only: bool = False
    ) -> List[Dict[str, Any]]:
        """Get all automations for a user."""
        query = f"/rest/v1/automations?user_id=eq.{user_id}&select=*&order=created_at.desc"
        
        if enabled_only:
            query += "&enabled=eq.true"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.supabase_url}{query}",
                headers=self._get_headers()
            )
            
            if response.status_code == 200:
                return response.json()
        
        return []
    
    async def get_automation(self, automation_id: str, user_id: str = None) -> Optional[Dict[str, Any]]:
        """Get a specific automation."""
        query = f"/rest/v1/automations?id=eq.{automation_id}&select=*"
        if user_id:
            query += f"&user_id=eq.{user_id}"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.supabase_url}{query}",
                headers=self._get_headers()
            )
            
            if response.status_code == 200:
                data = response.json()
                return data[0] if data else None
        
        return None
    
    async def update_automation(
        self,
        automation_id: str,
        user_id: str,
        updates: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update an automation."""
        updates["updated_at"] = datetime.utcnow().isoformat()
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.patch(
                f"{self.supabase_url}/rest/v1/automations?id=eq.{automation_id}&user_id=eq.{user_id}",
                headers=self._get_headers(),
                json=updates
            )
            
            if response.status_code == 200:
                return {"success": True, "message": "Automation updated"}
            
            return {"success": False, "error": response.text}
    
    async def delete_automation(self, automation_id: str, user_id: str) -> bool:
        """Delete an automation."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.delete(
                f"{self.supabase_url}/rest/v1/automations?id=eq.{automation_id}&user_id=eq.{user_id}",
                headers=self._get_headers()
            )
            
            return response.status_code == 200
    
    async def toggle_automation(self, automation_id: str, user_id: str, enabled: bool) -> Dict[str, Any]:
        """Enable or disable an automation."""
        return await self.update_automation(automation_id, user_id, {"enabled": enabled})
    
    # ==================== Execution ====================
    
    async def execute_automation(
        self,
        automation_id: str,
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Execute an automation.
        
        Args:
            automation_id: Automation ID
            context: Additional context for execution
            
        Returns:
            Execution result
        """
        automation = await self.get_automation(automation_id)
        
        if not automation:
            return {"success": False, "error": "Automation not found"}
        
        if not automation.get("enabled", True):
            return {"success": False, "error": "Automation is disabled"}
        
        user_id = automation.get("user_id")
        actions = automation.get("actions", [])
        name = automation.get("name", "Unknown")
        
        # Create run record
        run_id = await self._create_run(automation_id, "running")
        
        results = []
        errors = []
        
        for idx, action in enumerate(actions):
            try:
                result = await self._execute_action(user_id, action, context)
                results.append({
                    "action_index": idx,
                    "action_type": action.get("type"),
                    "result": result
                })
            except Exception as e:
                errors.append({
                    "action_index": idx,
                    "error": str(e)
                })
        
        # Update run record
        status = "completed" if not errors else "partial" if results else "failed"
        await self._update_run(run_id, status, results, errors)
        
        # Update automation last run time
        await self.update_automation(automation_id, user_id, {
            "last_run_at": datetime.utcnow().isoformat()
        })
        
        return {
            "success": len(errors) == 0,
            "run_id": run_id,
            "automation_name": name,
            "actions_executed": len(results),
            "errors": errors
        }
    
    async def _execute_action(
        self,
        user_id: str,
        action: Dict[str, Any],
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Execute a single action."""
        action_type = action.get("type")
        config = action.get("config", {})
        
        # Merge context into config
        if context:
            config = {**config, **context}
        
        if action_type == ActionType.SEND_EMAIL:
            return await self._execute_send_email(user_id, config)
        
        elif action_type == ActionType.CREATE_DOCUMENT:
            return await self._execute_create_document(user_id, config)
        
        elif action_type == ActionType.SEND_MESSAGE:
            return await self._execute_send_message(user_id, config)
        
        elif action_type == ActionType.AI_PROCESS:
            return await self._execute_ai_process(user_id, config)
        
        elif action_type == ActionType.NOTIFY_TELEGRAM:
            return await self._execute_notify_telegram(user_id, config)
        
        elif action_type == ActionType.WEBHOOK:
            return await self._execute_webhook(config)
        
        else:
            return {"success": False, "error": f"Unknown action type: {action_type}"}
    
    async def _execute_send_email(self, user_id: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Execute send_email action."""
        from app.services.oauth_service import oauth_service
        from app.services.google_service import google_service
        from app.services.microsoft_service import microsoft_service
        
        to = config.get("to")
        subject = config.get("subject")
        body = config.get("body")
        
        if not all([to, subject, body]):
            return {"success": False, "error": "Missing email parameters"}
        
        # Try Google first
        token = await oauth_service.get_valid_token(user_id, "google")
        if token:
            return await google_service.send_email(token, to, subject, body)
        
        # Try Microsoft
        token = await oauth_service.get_valid_token(user_id, "microsoft")
        if token:
            return await microsoft_service.send_email(token, [to], subject, body)
        
        return {"success": False, "error": "No email integration connected"}
    
    async def _execute_create_document(self, user_id: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Execute create_document action."""
        from app.services.document_service import document_service
        from app.core.supabase_client import supabase_client
        
        doc_type = config.get("doc_type", "pdf")
        title = config.get("title", "Generated Document")
        content = config.get("content", "")
        
        if doc_type == "pdf":
            result = await document_service.generate_pdf(title, content)
            mime_type = "application/pdf"
            ext = "pdf"
        elif doc_type == "xlsx":
            data = config.get("data", [])
            result = await document_service.generate_spreadsheet(title, data)
            mime_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ext = "xlsx"
        elif doc_type == "docx":
            result = await document_service.generate_docx(title, content)
            mime_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ext = "docx"
        elif doc_type == "pptx":
            slides = config.get("slides", [])
            result = await document_service.generate_pptx(title, slides)
            mime_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            ext = "pptx"
        else:
            return {"success": False, "error": f"Unknown document type: {doc_type}"}
        
        if result.get("success"):
            # Save to storage
            filename = f"{title.replace(' ', '_')}.{ext}"
            doc_result = await supabase_client.upload_document(
                user_id=user_id,
                file_name=filename,
                file_content=result.get(f"{doc_type}_bytes") or result.get("pdf_bytes"),
                content_type=mime_type,
                category="automation"
            )
            
            return {
                "success": True,
                "document_id": doc_result.get("document", {}).get("id"),
                "filename": filename
            }
        
        return result
    
    async def _execute_send_message(self, user_id: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Execute send_message action (to Telegram)."""
        from app.services.telegram_service import telegram_service
        
        message = config.get("message", "")
        
        if not message:
            return {"success": False, "error": "No message provided"}
        
        return await telegram_service.notify_user(user_id, message)
    
    async def _execute_ai_process(self, user_id: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Execute AI processing action."""
        from app.core.agent_manager import agent_manager
        
        prompt = config.get("prompt", "")
        context_data = config.get("context", {})
        
        if not prompt:
            return {"success": False, "error": "No prompt provided"}
        
        # Process with AI
        response = await agent_manager.process_message(
            message=prompt,
            session_id=f"automation_{user_id}",
            user_id=user_id
        )
        
        return {
            "success": True,
            "response": response.response,
            "agent": response.agent
        }
    
    async def _execute_notify_telegram(self, user_id: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Execute Telegram notification action."""
        from app.services.telegram_service import telegram_service
        
        message = config.get("message", "")
        
        if not message:
            return {"success": False, "error": "No message provided"}
        
        success = await telegram_service.notify_user(user_id, message)
        
        return {"success": success}
    
    async def _execute_webhook(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Execute webhook action."""
        url = config.get("url")
        method = config.get("method", "POST")
        headers = config.get("headers", {})
        body = config.get("body", {})
        
        if not url:
            return {"success": False, "error": "No webhook URL provided"}
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            if method.upper() == "GET":
                response = await client.get(url, headers=headers)
            else:
                response = await client.post(url, headers=headers, json=body)
            
            return {
                "success": response.status_code < 400,
                "status_code": response.status_code
            }
    
    # ==================== Run Tracking ====================
    
    async def _create_run(self, automation_id: str, status: str) -> str:
        """Create an automation run record."""
        import uuid
        run_id = str(uuid.uuid4())
        
        run_data = {
            "id": run_id,
            "automation_id": automation_id,
            "status": status,
            "started_at": datetime.utcnow().isoformat()
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            await client.post(
                f"{self.supabase_url}/rest/v1/automation_runs",
                headers=self._get_headers(),
                json=run_data
            )
        
        return run_id
    
    async def _update_run(
        self,
        run_id: str,
        status: str,
        result: List[Dict] = None,
        errors: List[Dict] = None
    ):
        """Update an automation run record."""
        update_data = {
            "status": status,
            "completed_at": datetime.utcnow().isoformat(),
            "result": result or [],
            "errors": errors or []
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            await client.patch(
                f"{self.supabase_url}/rest/v1/automation_runs?id=eq.{run_id}",
                headers=self._get_headers(),
                json=update_data
            )
    
    async def get_runs(
        self,
        automation_id: str,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """Get runs for an automation."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/automation_runs?automation_id=eq.{automation_id}&select=*&order=started_at.desc&limit={limit}",
                headers=self._get_headers()
            )
            
            if response.status_code == 200:
                return response.json()
        
        return []
    
    # ==================== Trigger Checking ====================
    
    async def check_scheduled_automations(self) -> List[Dict[str, Any]]:
        """
        Check for automations that should run based on schedule.
        
        This should be called periodically by a scheduler.
        """
        now = datetime.utcnow()
        
        # Get all enabled scheduled automations
        query = "/rest/v1/automations?enabled=eq.true&trigger_type=eq.schedule&select=*"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.supabase_url}{query}",
                headers=self._get_headers()
            )
            
            if response.status_code != 200:
                return []
            
            automations = response.json()
            
        to_execute = []
        
        for automation in automations:
            trigger_config = automation.get("trigger_config", {})
            last_run = automation.get("last_run_at")
            
            # Check if should run
            should_run = self._check_schedule(trigger_config, last_run, now)
            
            if should_run:
                to_execute.append(automation)
        
        return to_execute
    
    def _check_schedule(
        self,
        config: Dict[str, Any],
        last_run: str,
        now: datetime
    ) -> bool:
        """Check if a scheduled automation should run."""
        schedule_type = config.get("type", "interval")
        
        if schedule_type == "interval":
            # Run every N minutes/hours
            interval = config.get("interval", 60)  # minutes
            unit = config.get("unit", "minutes")
            
            if unit == "hours":
                interval *= 60
            elif unit == "days":
                interval *= 24 * 60
            
            if last_run:
                last_run_dt = datetime.fromisoformat(last_run.replace("Z", "+00:00"))
                minutes_since = (now - last_run_dt.replace(tzinfo=None)).total_seconds() / 60
                return minutes_since >= interval
            
            return True
        
        elif schedule_type == "cron":
            # Cron expression (simplified)
            # In production, use a cron library
            hour = config.get("hour", 0)
            minute = config.get("minute", 0)
            
            if last_run:
                last_run_dt = datetime.fromisoformat(last_run.replace("Z", "+00:00"))
                # Check if we've passed the scheduled time since last run
                scheduled_today = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
                return scheduled_today > last_run_dt.replace(tzinfo=None)
            
            return now.hour == hour and now.minute == minute
        
        elif schedule_type == "daily":
            hour = config.get("hour", 9)
            
            if last_run:
                last_run_dt = datetime.fromisoformat(last_run.replace("Z", "+00:00"))
                # Check if it's a new day
                return now.date() > last_run_dt.date() and now.hour >= hour
            
            return now.hour == hour
        
        return False


# Singleton instance
automation_service = AutomationService()
