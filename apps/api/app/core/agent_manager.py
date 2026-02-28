"""
MiniDoc - Agent Manager
Orchestrates agent selection, execution, and tool calling.
"""
import time
import asyncio
from typing import Optional
from app.agents import get_agent, BaseAgent
from app.core.intent import intent_detector
from app.models.schemas import ChatResponse, AgentType


class AgentManager:
    """Manages agent lifecycle, request routing, and tool execution."""

    def __init__(self):
        self.agents: dict[str, BaseAgent] = {}
        self.start_time = time.time()
        self._initialized = False

    async def initialize(self):
        """Initialize all agents."""
        print("[AgentManager] Initializing agent system...")
        for agent_type in ["librarian", "web", "writer", "email", "slide", "file"]:
            self.agents[agent_type] = get_agent(agent_type)
            print(f"[AgentManager] Loaded {agent_type} agent")
        self._initialized = True
        print("[AgentManager] Agent system initialized")

    def is_initialized(self) -> bool:
        return self._initialized

    def get_uptime(self) -> float:
        return time.time() - self.start_time

    def get_registered_agents(self) -> list[str]:
        return list(self.agents.keys())

    def detect_intent(self, message: str):
        """Detect intent for a message."""
        return intent_detector.detect(message)

    async def process_message(
        self,
        message: str,
        session_id: str,
        user_id: Optional[str] = None,
        documents: Optional[list[dict]] = None,
        history: Optional[list[dict]] = None,
    ) -> ChatResponse:
        """Process a message with tool calling support."""
        # Detect intent
        intent = self.detect_intent(message)
        agent_type = intent.target_agent.value

        print(f"[AgentManager] Routing to {agent_type} agent (confidence: {intent.confidence:.2f})")

        # Get the agent
        agent = self.agents.get(agent_type)
        if not agent:
            agent = self.agents["librarian"]  # Fallback

        # Build context
        context = {
            "session_id": session_id,
            "user_id": user_id,
            "documents": documents or [],
            "history": history or [],
            "intent": intent.model_dump(),
        }

        # Process with agent - this now includes tool calling
        result = await agent.process(message, context)

        # Check if we have tool calls to execute
        tool_results = []
        if result.get("tool_calls"):
            print(f"[AgentManager] Processing {len(result['tool_calls'])} tool calls")
            
            for tool_call in result["tool_calls"]:
                tool_result = await agent.execute_tool_call(tool_call)
                tool_results.append(tool_result)
                
                # If tool created a file, note it
                if tool_result.get("result", {}).get("download_url"):
                    print(f"[AgentManager] Tool created file: {tool_result['result'].get('filename')}")

        # Build response
        response_text = result.get("response", "I processed your request.")
        
        # Enhance response with tool results
        if tool_results:
            response_text = self._enhance_response_with_tools(response_text, tool_results)

        return ChatResponse(
            response=response_text,
            agent=AgentType(agent_type),
            citations=result.get("citations", []),
            suggested_actions=result.get("suggested_actions", []),
            session_id=session_id,
        )

    def _enhance_response_with_tools(self, response: str, tool_results: list) -> str:
        """Enhance the response with tool execution results."""
        enhancements = []
        
        for result in tool_results:
            if result["status"] == "success":
                tool_name = result["tool_name"]
                tool_result = result["result"]
                
                # Add specific enhancements based on tool type
                if tool_name.startswith("create_"):
                    # Document creation
                    filename = tool_result.get("filename", "document")
                    download_url = tool_result.get("download_url", "")
                    enhancements.append(f"\n\n📎 **File Created:** `{filename}`\n📥 [Download here]({download_url})")
                
                elif tool_name == "browser_search":
                    # Web search results
                    results = tool_result.get("results", [])
                    if results:
                        enhancements.append("\n\n🔍 **Search Results:**")
                        for r in results[:3]:
                            enhancements.append(f"- [{r.get('title', 'Result')}]({r.get('url', '#')})")
                
                elif tool_name == "add_event":
                    # Calendar event
                    event = tool_result.get("event", {})
                    enhancements.append(f"\n\n📅 **Event Added:** {event.get('title')} on {event.get('date')} at {event.get('time')}")
                
                elif tool_name == "draft_email":
                    # Email draft
                    email = tool_result.get("email", {})
                    enhancements.append(f"\n\n✉️ **Email Drafted:** To: {email.get('to')}\n**Subject:** {email.get('subject')}")
        
        if enhancements:
            return response + "".join(enhancements)
        
        return response

    def get_agent_info(self, agent_type: str) -> Optional[dict]:
        """Get information about a specific agent."""
        agent = self.agents.get(agent_type)
        if not agent:
            return None
        return {
            "name": agent.name,
            "type": agent.agent_type,
            "description": agent.description,
            "capabilities": agent.capabilities,
            "status": "ready",
        }


# Singleton instance
agent_manager = AgentManager()
