"""
MiniDoc - Automations Router
API endpoints for task automation.
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from app.services.automation_service import automation_service

router = APIRouter(prefix="/api/automations", tags=["automations"])


# ==================== Request Models ====================

class CreateAutomationRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    trigger_type: str  # schedule, email_received, document_uploaded, webhook, manual
    trigger_config: Dict[str, Any]
    actions: List[Dict[str, Any]]
    enabled: bool = True


class UpdateAutomationRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    trigger_config: Optional[Dict[str, Any]] = None
    actions: Optional[List[Dict[str, Any]]] = None
    enabled: Optional[bool] = None


# ==================== Endpoints ====================

@router.get("")
async def automations_api_info():
    """Get automations API information."""
    return {
        "name": "MiniDoc Automations API",
        "version": "1.0.0",
        "trigger_types": [
            {"type": "schedule", "description": "Time-based triggers"},
            {"type": "email_received", "description": "Trigger on new email"},
            {"type": "document_uploaded", "description": "Trigger on document upload"},
            {"type": "webhook", "description": "Trigger via webhook"},
            {"type": "manual", "description": "Manual trigger only"}
        ],
        "action_types": [
            {"type": "send_email", "description": "Send an email"},
            {"type": "create_document", "description": "Generate a document"},
            {"type": "send_message", "description": "Send a message"},
            {"type": "ai_process", "description": "Process with AI"},
            {"type": "notify_telegram", "description": "Send Telegram notification"},
            {"type": "webhook", "description": "Call a webhook"}
        ],
        "endpoints": {
            "GET /api/automations": "List all automations",
            "POST /api/automations": "Create automation",
            "GET /api/automations/{id}": "Get automation details",
            "PUT /api/automations/{id}": "Update automation",
            "DELETE /api/automations/{id}": "Delete automation",
            "POST /api/automations/{id}/run": "Manually run automation",
            "GET /api/automations/{id}/runs": "Get automation run history"
        }
    }


@router.get("/list")
async def list_automations(
    user_id: str = Query(default="demo-user"),
    enabled_only: bool = Query(default=False)
):
    """List all automations for a user."""
    automations = await automation_service.get_automations(user_id, enabled_only)
    
    return {
        "success": True,
        "automations": automations,
        "count": len(automations)
    }


@router.post("")
async def create_automation(
    request: CreateAutomationRequest,
    user_id: str = Query(default="demo-user")
):
    """Create a new automation."""
    # Validate trigger type
    valid_triggers = ["schedule", "email_received", "document_uploaded", "webhook", "manual"]
    if request.trigger_type not in valid_triggers:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid trigger type. Must be one of: {valid_triggers}"
        )
    
    # Validate actions
    valid_actions = ["send_email", "create_document", "send_message", "ai_process", "notify_telegram", "webhook"]
    for action in request.actions:
        if action.get("type") not in valid_actions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid action type. Must be one of: {valid_actions}"
            )
    
    result = await automation_service.create_automation(
        user_id=user_id,
        name=request.name,
        description=request.description,
        trigger_type=request.trigger_type,
        trigger_config=request.trigger_config,
        actions=request.actions,
        enabled=request.enabled
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


@router.get("/{automation_id}")
async def get_automation(
    automation_id: str,
    user_id: str = Query(default="demo-user")
):
    """Get automation details."""
    automation = await automation_service.get_automation(automation_id, user_id)
    
    if not automation:
        raise HTTPException(status_code=404, detail="Automation not found")
    
    return {
        "success": True,
        "automation": automation
    }


@router.put("/{automation_id}")
async def update_automation(
    automation_id: str,
    request: UpdateAutomationRequest,
    user_id: str = Query(default="demo-user")
):
    """Update an automation."""
    updates = request.dict(exclude_unset=True)
    
    if not updates:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    result = await automation_service.update_automation(automation_id, user_id, updates)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


@router.delete("/{automation_id}")
async def delete_automation(
    automation_id: str,
    user_id: str = Query(default="demo-user")
):
    """Delete an automation."""
    success = await automation_service.delete_automation(automation_id, user_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Automation not found")
    
    return {"success": True, "message": "Automation deleted"}


@router.post("/{automation_id}/toggle")
async def toggle_automation(
    automation_id: str,
    enabled: bool = Query(...),
    user_id: str = Query(default="demo-user")
):
    """Enable or disable an automation."""
    result = await automation_service.toggle_automation(automation_id, user_id, enabled)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return {
        "success": True,
        "message": f"Automation {'enabled' if enabled else 'disabled'}"
    }


@router.post("/{automation_id}/run")
async def run_automation(
    automation_id: str,
    user_id: str = Query(default="demo-user"),
    context: Dict[str, Any] = None
):
    """Manually run an automation."""
    # Verify ownership
    automation = await automation_service.get_automation(automation_id, user_id)
    
    if not automation:
        raise HTTPException(status_code=404, detail="Automation not found")
    
    result = await automation_service.execute_automation(automation_id, context)
    
    return result


@router.get("/{automation_id}/runs")
async def get_automation_runs(
    automation_id: str,
    user_id: str = Query(default="demo-user"),
    limit: int = Query(default=20)
):
    """Get automation run history."""
    # Verify ownership
    automation = await automation_service.get_automation(automation_id, user_id)
    
    if not automation:
        raise HTTPException(status_code=404, detail="Automation not found")
    
    runs = await automation_service.get_runs(automation_id, limit)
    
    return {
        "success": True,
        "runs": runs,
        "count": len(runs)
    }


# ==================== Automation Templates ====================

@router.get("/templates")
async def get_automation_templates():
    """Get predefined automation templates."""
    return {
        "success": True,
        "templates": [
            {
                "id": "email_summary",
                "name": "Daily Email Summary",
                "description": "Send a daily summary of important emails",
                "trigger_type": "schedule",
                "trigger_config": {"type": "daily", "hour": 9},
                "actions": [
                    {
                        "type": "ai_process",
                        "config": {"prompt": "Summarize my emails from the last 24 hours"}
                    },
                    {
                        "type": "notify_telegram",
                        "config": {"message": "{{ai_response}}"}
                    }
                ]
            },
            {
                "id": "document_ocr",
                "name": "Auto-extract Document Text",
                "description": "Extract text from uploaded PDFs automatically",
                "trigger_type": "document_uploaded",
                "trigger_config": {"file_types": ["application/pdf"]},
                "actions": [
                    {
                        "type": "ai_process",
                        "config": {"prompt": "Extract and summarize key information from this document"}
                    }
                ]
            },
            {
                "id": "weekly_report",
                "name": "Weekly Activity Report",
                "description": "Generate a weekly report of activity",
                "trigger_type": "schedule",
                "trigger_config": {"type": "cron", "day_of_week": "monday", "hour": 9},
                "actions": [
                    {
                        "type": "create_document",
                        "config": {
                            "doc_type": "pdf",
                            "title": "Weekly Report",
                            "content": "Weekly activity summary..."
                        }
                    },
                    {
                        "type": "notify_telegram",
                        "config": {"message": "Your weekly report is ready!"}
                    }
                ]
            }
        ]
    }
