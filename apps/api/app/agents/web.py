"""
MiniDoc - Web Agent
Web search and online information retrieval.
"""
from app.agents.base import BaseAgent
from app.models.schemas import AgentType


class WebAgent(BaseAgent):
    """Web agent for search and online queries."""

    def __init__(self):
        super().__init__(
            name="Web Searcher",
            agent_type=AgentType.WEB,
            description="Search the web and retrieve online information.",
            capabilities=[
                "Web search",
                "Current events",
                "Fact checking",
                "News and updates",
            ],
        )

    async def process(self, message: str, context: dict) -> dict:
        """Process a web search request."""
        prompt = f"""You are MiniDoc's Web Search agent. The user wants to find information online.

User query: {message}

Provide accurate, up-to-date information. If you don't have current information,
acknowledge this and suggest the user verify with a current web search."""

        response = self._get_ai_response(prompt)

        if response:
            return {
                "response": response,
                "citations": [],
                "suggested_actions": [
                    "Search for more details",
                    "Ask follow-up question",
                ],
            }

        return {
            "response": "I'm ready to help with web searches, but the AI service is currently unavailable.",
            "citations": [],
            "suggested_actions": ["Try again later"],
        }
