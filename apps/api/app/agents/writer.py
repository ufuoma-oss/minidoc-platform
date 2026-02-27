"""
MiniDoc - Writer Agent
Content creation and writing assistance.
"""
from app.agents.base import BaseAgent
from app.models.schemas import AgentType


class WriterAgent(BaseAgent):
    """Writer agent for content creation."""

    def __init__(self):
        super().__init__(
            name="Writer",
            agent_type=AgentType.WRITER,
            description="Create content, draft documents, and help with writing.",
            capabilities=[
                "Write articles",
                "Draft emails",
                "Create blog posts",
                "Edit and improve text",
            ],
        )

    async def process(self, message: str, context: dict) -> dict:
        """Process a writing request."""
        prompt = f"""You are MiniDoc's Writer agent, an expert content creator.

User request: {message}

Create high-quality content based on the user's request. Be creative yet professional."""

        response = self._get_ai_response(prompt)

        if response:
            return {
                "response": response,
                "citations": [],
                "suggested_actions": [
                    "Revise content",
                    "Change tone or style",
                    "Expand on specific sections",
                ],
            }

        return {
            "response": "I'm ready to help with writing, but the AI service is currently unavailable.",
            "citations": [],
            "suggested_actions": ["Try again later"],
        }
