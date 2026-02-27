"""
MiniDoc - Intent Detection
Classifies user messages to route to appropriate agents.
"""
import re
from enum import Enum
from typing import Optional
from pydantic import BaseModel


class IntentCategory(str, Enum):
    CONVERSATION = "conversation"
    DOCUMENT = "document"
    CREATION = "creation"
    WEB_SEARCH = "web_search"
    EMAIL = "email"
    FILE = "file"


class AgentType(str, Enum):
    LIBRARIAN = "librarian"
    WEB = "web"
    WRITER = "writer"
    EMAIL = "email"
    SLIDE = "slide"
    FILE = "file"


class IntentResponse(BaseModel):
    category: IntentCategory
    target_agent: AgentType
    confidence: float
    entities: list[dict] = []


class IntentDetector:
    """Detects user intent from messages."""

    # Keywords for each agent
    PATTERNS = {
        AgentType.WEB: [
            r"\bsearch\b", r"\bgoogle\b", r"\blook up\b", r"\bfind online\b",
            r"\bwhat('s| is) (the|current|latest)\b", r"\bnews\b", r"\bweather\b",
            r"\bwho (is|was|are)\b", r"\bwhere (is|are)\b",
        ],
        AgentType.WRITER: [
            r"\bwrite\b", r"\bdraft\b", r"\bcompose\b", r"\bcreate (a |an )?(document|article|blog|story|essay)\b",
            r"\bhelp me write\b", r"\bgenerate (content|text)\b",
        ],
        AgentType.EMAIL: [
            r"\bemail\b", r"\bmail\b", r"\bsend (a )?message\b", r"\binbox\b",
            r"\bcompose (an )?email\b", r"\breply to\b", r"\bfollow up\b",
        ],
        AgentType.SLIDE: [
            r"\bslide(s)?\b", r"\bpresentation\b", r"\bpowerpoint\b", r"\bdeck\b",
            r"\bcreate (a )?(presentation|slide)\b",
        ],
        AgentType.FILE: [
            r"\bupload\b", r"\bfile\b", r"\bdocument\b", r"\bpdf\b", r"\bdocx?\b",
            r"\banalyze (this|the) (file|document)\b", r"\bsummarize (this|the)\b",
        ],
    }

    def detect(self, message: str) -> IntentResponse:
        """Detect intent from message."""
        message_lower = message.lower()

        # Check each pattern
        scores = {}
        for agent, patterns in self.PATTERNS.items():
            score = 0
            for pattern in patterns:
                if re.search(pattern, message_lower):
                    score += 1
            scores[agent] = score

        # Find best match
        best_agent = max(scores, key=scores.get)
        max_score = scores[best_agent]

        # Default to librarian if no match
        if max_score == 0:
            best_agent = AgentType.LIBRARIAN
            confidence = 0.5
            category = IntentCategory.CONVERSATION
        else:
            confidence = min(0.9, 0.5 + (max_score * 0.15))
            # Map agent to category
            category_map = {
                AgentType.WEB: IntentCategory.WEB_SEARCH,
                AgentType.WRITER: IntentCategory.CREATION,
                AgentType.EMAIL: IntentCategory.EMAIL,
                AgentType.SLIDE: IntentCategory.CREATION,
                AgentType.FILE: IntentCategory.FILE,
                AgentType.LIBRARIAN: IntentCategory.CONVERSATION,
            }
            category = category_map[best_agent]

        return IntentResponse(
            category=category,
            target_agent=best_agent,
            confidence=confidence,
            entities=self._extract_entities(message),
        )

    def _extract_entities(self, message: str) -> list[dict]:
        """Extract entities from message."""
        entities = []

        # Email pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        for match in re.finditer(email_pattern, message):
            entities.append({"type": "email", "value": match.group()})

        # URL pattern
        url_pattern = r'https?://[^\s]+'
        for match in re.finditer(url_pattern, message):
            entities.append({"type": "url", "value": match.group()})

        return entities


# Singleton
intent_detector = IntentDetector()
