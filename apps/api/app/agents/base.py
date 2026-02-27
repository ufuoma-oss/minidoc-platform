"""
MiniDoc - Base Agent
Base class for all agents with tool calling support.
"""
from abc import ABC, abstractmethod
from typing import Optional, Any
from app.models.schemas import AgentType
import httpx
import json


class BaseAgent(ABC):
    """Base class for all agents with tool calling capabilities."""

    def __init__(
        self,
        name: str,
        agent_type: AgentType,
        description: str,
        capabilities: list[str],
    ):
        self.name = name
        self.agent_type = agent_type
        self.description = description
        self.capabilities = capabilities

    @abstractmethod
    async def process(self, message: str, context: dict) -> dict:
        """Process a message and return a response."""
        pass

    def _get_ai_response_with_tools(
        self, 
        prompt: str, 
        context: dict = None,
        tools: list[dict] = None
    ) -> dict:
        """
        Get response from Kimi K2 with tool calling support.
        Returns both the response and any tool calls to execute.
        """
        from app.core.config import settings
        from app.tools import TOOLS

        if not settings.nvidia_api_key:
            print("[AI] No NVIDIA API key configured")
            return {"response": None, "tool_calls": []}

        try:
            # Build system prompt with context
            system_prompt = self._build_system_prompt(context)
            
            # Use NVIDIA NIM API with Kimi K2 Instruct (Multimodal, Agentic)
            with httpx.Client(timeout=120.0) as client:
                request_body = {
                    "model": "moonshotai/kimi-k2-instruct",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 4096,
                    "temperature": 0.7,
                    "stream": False
                }
                
                # Add tools if supported
                if tools is None:
                    tools = TOOLS
                
                if tools:
                    request_body["tools"] = tools
                    request_body["tool_choice"] = "auto"
                
                response = client.post(
                    "https://integrate.api.nvidia.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.nvidia_api_key}",
                        "Content-Type": "application/json",
                    },
                    json=request_body
                )
                
                if response.status_code == 200:
                    data = response.json()
                    message = data.get("choices", [{}])[0].get("message", {})
                    content = message.get("content")
                    tool_calls = message.get("tool_calls", [])
                    
                    print(f"[AI] Successfully got response from Kimi K2")
                    print(f"[AI] Tool calls: {len(tool_calls)}")
                    
                    return {
                        "response": content,
                        "tool_calls": tool_calls,
                        "raw_response": data
                    }
                
                print(f"[AI] NVIDIA NIM error: {response.status_code} - {response.text}")
                return {"response": None, "tool_calls": []}
            
        except Exception as e:
            print(f"[AI] Error: {e}")
            return {"response": None, "tool_calls": [], "error": str(e)}

    def _build_system_prompt(self, context: dict = None) -> str:
        """Build the system prompt for this agent."""
        base_prompt = f"""You are {self.name}, a specialized AI agent in the MiniDoc system.

Your role: {self.description}
Your capabilities: {', '.join(self.capabilities)}

You have access to tools that let you perform real actions:
- browser_search: Search the web for current information
- browse_web: Browse and extract content from websites
- create_pdf: Create PDF documents
- create_slide: Create presentation slides
- create_spreadsheet: Create spreadsheets
- draft_email: Draft emails for review
- send_email: Send emails (requires confirmation)
- add_event: Add calendar events
- get_events: Get upcoming calendar events
- read_file: Read uploaded file content
- list_files: List user's uploaded files

IMPORTANT: 
1. Use tools when appropriate to perform real actions, not just describe them.
2. When creating documents, slides, or emails, actually call the tools.
3. Always provide helpful, actionable responses.
4. If you need to search the web, use browser_search tool.
5. Be proactive in helping the user accomplish their goals.
"""
        
        if context:
            documents = context.get("documents", [])
            if documents:
                base_prompt += f"\n\nThe user has {len(documents)} documents available. You can reference them."
        
        return base_prompt

    async def execute_tool_call(self, tool_call: dict) -> dict:
        """Execute a tool call from the AI."""
        from app.tools import get_tool_function
        
        tool_name = tool_call.get("function", {}).get("name")
        tool_args_str = tool_call.get("function", {}).get("arguments", "{}")
        
        try:
            tool_args = json.loads(tool_args_str)
        except json.JSONDecodeError:
            tool_args = {}
        
        print(f"[Tool] Executing: {tool_name} with args: {tool_args}")
        
        # Get the function
        tool_func = get_tool_function(tool_name)
        
        if tool_func:
            try:
                # Execute the tool
                import asyncio
                if asyncio.iscoroutinefunction(tool_func):
                    result = await tool_func(**tool_args)
                else:
                    result = tool_func(**tool_args)
                
                return {
                    "tool_call_id": tool_call.get("id"),
                    "tool_name": tool_name,
                    "result": result,
                    "status": "success"
                }
            except Exception as e:
                print(f"[Tool] Error executing {tool_name}: {e}")
                return {
                    "tool_call_id": tool_call.get("id"),
                    "tool_name": tool_name,
                    "result": {"error": str(e)},
                    "status": "error"
                }
        else:
            print(f"[Tool] Unknown tool: {tool_name}")
            return {
                "tool_call_id": tool_call.get("id"),
                "tool_name": tool_name,
                "result": {"error": f"Unknown tool: {tool_name}"},
                "status": "error"
            }

    def _get_ai_response(self, prompt: str) -> Optional[str]:
        """Simple AI response without tools (backward compatible)."""
        result = self._get_ai_response_with_tools(prompt)
        return result.get("response")
