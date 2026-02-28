"""
MiniDoc - Librarian Agent
General conversation, document queries, and task coordination.
"""
from app.agents.base import BaseAgent
from app.models.schemas import AgentType


class LibrarianAgent(BaseAgent):
    """Librarian agent - the main coordinator agent."""

    def __init__(self):
        super().__init__(
            name="Librarian",
            agent_type=AgentType.LIBRARIAN,
            description="Your personal AI assistant for documents, research, and task coordination.",
            capabilities=[
                "Answer general questions",
                "Search and analyze documents",
                "Coordinate with other agents",
                "Perform web searches",
                "Create files and documents",
                "Manage calendar and emails",
            ],
        )

    async def process(self, message: str, context: dict) -> dict:
        """Process a message with full tool calling support."""
        # Build prompt with context
        documents = context.get("documents", [])
        doc_context = ""
        if documents:
            doc_context = f"\n\nUser's Documents ({len(documents)} available):\n"
            for doc in documents[:5]:  # Limit to 5 for context
                doc_context += f"- {doc.get('filename', 'Unknown')}: {doc.get('extractedText', '')[:200]}...\n"

        prompt = f"""User message: {message}

{doc_context}

Help the user accomplish their goal. Use tools when appropriate to:
- Search the web for current information
- Create documents, slides, or spreadsheets
- Draft emails or add calendar events
- Read and analyze uploaded files

Provide a helpful response and USE TOOLS to perform real actions."""

        # Get AI response with tools
        result = await self._get_ai_response_with_tools(prompt, context)

        response = result.get("response")
        tool_calls = result.get("tool_calls", [])

        if response or tool_calls:
            return {
                "response": response or "I'll help you with that.",
                "citations": [],
                "suggested_actions": [
                    "Ask follow-up question",
                    "Search for related documents",
                    "Create a file",
                ],
                "tool_calls": tool_calls,
            }

        # Fallback response
        return {
            "response": "I'm ready to help! However, AI services are currently unavailable.",
            "citations": [],
            "suggested_actions": ["Try again later"],
        }
