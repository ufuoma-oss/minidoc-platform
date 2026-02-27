"""
MiniDoc - Email Agent
Email composition and management.
"""
from app.agents.base import BaseAgent
from app.models.schemas import AgentType


class EmailAgent(BaseAgent):
    """Email agent for composing and managing emails."""

    def __init__(self):
        super().__init__(
            name="Email Assistant",
            agent_type=AgentType.EMAIL,
            description="Compose, draft, and manage email communications.",
            capabilities=[
                "Compose emails",
                "Draft replies",
                "Summarize email threads",
                "Schedule follow-ups",
            ],
        )

    async def process(self, message: str, context: dict) -> dict:
        """Process an email request."""
        entities = context.get("intent", {}).get("entities", [])
        email_address = next((e["value"] for e in entities if e["type"] == "email"), None)

        prompt = f"""You are MiniDoc's Email Assistant.

User request: {message}
{"Recipient: " + email_address if email_address else ""}

Help compose or manage email communications professionally."""

        response = self._get_ai_response(prompt)

        if response:
            return {
                "response": response,
                "citations": [],
                "suggested_actions": [
                    "Send email",
                    "Edit draft",
                    "Schedule for later",
                ],
            }

        return {
            "response": "I'm ready to help with emails, but the AI service is currently unavailable.",
            "citations": [],
            "suggested_actions": ["Try again later"],
        }
