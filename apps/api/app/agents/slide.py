"""
MiniDoc - Slide Agent
Presentation creation and management with actual file generation.
"""
from app.agents.base import BaseAgent
from app.models.schemas import AgentType
import json


class SlideAgent(BaseAgent):
    """Slide agent for creating presentations."""

    def __init__(self):
        super().__init__(
            name="Slide Creator",
            agent_type=AgentType.SLIDE,
            description="Create presentations and slide decks with actual file generation.",
            capabilities=[
                "Create presentations",
                "Design slides",
                "Outline content",
                "Export to PowerPoint",
                "Generate slide content from documents",
            ],
        )

    async def process(self, message: str, context: dict) -> dict:
        """Process a presentation request with tool calling."""
        documents = context.get("documents", [])
        
        doc_context = ""
        if documents:
            doc_context = f"\n\nUser's Documents to reference:\n"
            for doc in documents[:3]:
                doc_context += f"- {doc.get('filename', 'Unknown')}\n"

        prompt = f"""User request: {message}

{doc_context}

Create a professional presentation. Use the create_slide tool to actually generate the presentation.

The create_slide tool requires:
- title: Presentation title
- slides: Array of {{title, content}} objects
- filename: Output filename (without extension)

Example tool call:
create_slide(title="My Presentation", slides=[{{"title": "Intro", "content": "Welcome"}}, ...], filename="my_presentation")

IMPORTANT: Always call the create_slide tool to generate the actual file."""

        # Get AI response with tools
        result = self._get_ai_response_with_tools(prompt, context)

        response = result.get("response")
        tool_calls = result.get("tool_calls", [])

        if response or tool_calls:
            return {
                "response": response or "I'll create that presentation for you.",
                "citations": [],
                "suggested_actions": [
                    "Add more slides",
                    "Change design theme",
                    "Export presentation",
                ],
                "tool_calls": tool_calls,
            }

        return {
            "response": "I'm ready to help create presentations, but the AI service is currently unavailable.",
            "citations": [],
            "suggested_actions": ["Try again later"],
        }
