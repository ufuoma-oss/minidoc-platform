"""
MiniDoc - File Agent
File management, analysis, and document processing.
"""
from app.agents.base import BaseAgent
from app.models.schemas import AgentType


class FileAgent(BaseAgent):
    """File agent for document management and processing."""

    def __init__(self):
        super().__init__(
            name="File Manager",
            agent_type=AgentType.FILE,
            description="Manage, analyze, and process uploaded files and documents.",
            capabilities=[
                "Read and analyze files",
                "Extract text from documents",
                "Summarize document content",
                "Create new documents",
                "Convert file formats",
            ],
        )

    async def process(self, message: str, context: dict) -> dict:
        """Process a file-related request."""
        documents = context.get("documents", [])
        
        # Build context with document info
        doc_context = ""
        if documents:
            doc_context = f"\n\nUser's Uploaded Documents:\n"
            for doc in documents:
                doc_context += f"""
- ID: {doc.get('id', 'unknown')}
  Name: {doc.get('filename', 'Unknown')}
  Type: {doc.get('mimeType', 'Unknown')}
  Content Preview: {str(doc.get('extractedText', ''))[:300]}...
"""
        else:
            doc_context = "\n\nNo documents have been uploaded yet."

        prompt = f"""User request: {message}

{doc_context}

Help the user with their file-related request. Use tools when appropriate:
- read_file: To read content from a specific file
- list_files: To list all user's files
- create_pdf: To create PDF documents
- create_spreadsheet: To create spreadsheets

Provide a helpful response and use tools to perform actual actions."""

        result = self._get_ai_response_with_tools(prompt, context)

        response = result.get("response")
        tool_calls = result.get("tool_calls", [])

        if response or tool_calls:
            return {
                "response": response or "I'll help you with your files.",
                "citations": [],
                "suggested_actions": [
                    "Upload more files",
                    "Analyze document",
                    "Create new document",
                ],
                "tool_calls": tool_calls,
            }

        return {
            "response": "I'm ready to help with files, but the AI service is currently unavailable.",
            "citations": [],
            "suggested_actions": ["Try again later"],
        }
