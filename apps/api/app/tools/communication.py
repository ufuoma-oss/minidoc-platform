"""
MiniDoc - Communication Tools
Email and messaging capabilities.
"""

async def draft_email(to: str, subject: str, body: str) -> dict:
    """
    Draft an email ready for user review.
    Does NOT send - just prepares it.
    """
    return {
        "success": True,
        "type": "email_draft",
        "email": {
            "to": to,
            "subject": subject,
            "body": body,
            "status": "draft",
            "requires_confirmation": True
        },
        "message": f"Email draft prepared for {to}. Ready for review and send confirmation."
    }


async def send_email(to: str, subject: str, body: str) -> dict:
    """
    Send an email (requires user confirmation first).
    """
    # In production, integrate with Gmail API or Outlook API
    # This would use the stored OAuth tokens from app_connections table
    
    return {
        "success": True,
        "type": "email_sent",
        "email": {
            "to": to,
            "subject": subject,
            "body": body,
            "status": "queued",
            "provider": "gmail"  # or outlook, based on user's connection
        },
        "message": f"Email to {to} queued for sending. Please confirm to proceed.",
        "requires_confirmation": True,
        "confirmation_id": f"email_{hash(to + subject) % 10000}"
    }
