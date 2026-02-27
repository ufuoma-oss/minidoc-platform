"""
MiniDoc - Agents Package
"""
from .base import BaseAgent
from .librarian import LibrarianAgent
from .web import WebAgent
from .writer import WriterAgent
from .email import EmailAgent
from .slide import SlideAgent
from .file import FileAgent
from ..models.schemas import AgentType


# Agent registry
_AGENTS = {
    AgentType.LIBRARIAN: LibrarianAgent,
    AgentType.WEB: WebAgent,
    AgentType.WRITER: WriterAgent,
    AgentType.EMAIL: EmailAgent,
    AgentType.SLIDE: SlideAgent,
    AgentType.FILE: FileAgent,
}


def get_agent(agent_type: str) -> BaseAgent:
    """Get an agent instance by type."""
    agent_enum = AgentType(agent_type)
    agent_class = _AGENTS.get(agent_enum)
    if agent_class:
        return agent_class()
    raise ValueError(f"Unknown agent type: {agent_type}")


def list_agents() -> list[str]:
    """List available agent types."""
    return [a.value for a in AgentType]


__all__ = [
    "BaseAgent",
    "LibrarianAgent",
    "WebAgent",
    "WriterAgent",
    "EmailAgent",
    "SlideAgent",
    "FileAgent",
    "get_agent",
    "list_agents",
]
