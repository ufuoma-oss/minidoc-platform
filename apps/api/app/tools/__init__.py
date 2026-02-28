"""
MiniDoc - Tools Module
Defines tools that the AI can call to perform actual actions.
"""
from app.tools.browser import browser_search, browse_web
from app.tools.documents import create_pdf, create_slide, create_spreadsheet
from app.tools.communication import send_email, draft_email
from app.tools.calendar import add_event, get_events
from app.tools.files import read_file, list_files

# Tool definitions for Kimi K2 function calling
TOOLS = [
    # Browser Tools
    {
        "type": "function",
        "function": {
            "name": "browser_search",
            "description": "Search the web for current information. Use when you need up-to-date info.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query"
                    },
                    "num_results": {
                        "type": "integer",
                        "description": "Number of results to return (default 5)",
                        "default": 5
                    }
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "browse_web",
            "description": "Browse a specific webpage and extract its content.",
            "parameters": {
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "The URL to browse"
                    }
                },
                "required": ["url"]
            }
        }
    },
    # Document Tools
    {
        "type": "function",
        "function": {
            "name": "create_pdf",
            "description": "Create a PDF document from content.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "PDF title"
                    },
                    "content": {
                        "type": "string",
                        "description": "PDF content (markdown supported)"
                    },
                    "filename": {
                        "type": "string",
                        "description": "Output filename"
                    }
                },
                "required": ["title", "content", "filename"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_slide",
            "description": "Create a presentation slide deck.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "Presentation title"
                    },
                    "slides": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title": {"type": "string"},
                                "content": {"type": "string"}
                            }
                        },
                        "description": "Array of slides with title and content"
                    },
                    "filename": {
                        "type": "string",
                        "description": "Output filename"
                    }
                },
                "required": ["title", "slides", "filename"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_spreadsheet",
            "description": "Create a spreadsheet from data.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "Spreadsheet title"
                    },
                    "data": {
                        "type": "array",
                        "items": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "description": "2D array of data (rows x columns)"
                    },
                    "filename": {
                        "type": "string",
                        "description": "Output filename"
                    }
                },
                "required": ["title", "data", "filename"]
            }
        }
    },
    # Communication Tools
    {
        "type": "function",
        "function": {
            "name": "draft_email",
            "description": "Draft an email ready for review.",
            "parameters": {
                "type": "object",
                "properties": {
                    "to": {
                        "type": "string",
                        "description": "Recipient email"
                    },
                    "subject": {
                        "type": "string",
                        "description": "Email subject"
                    },
                    "body": {
                        "type": "string",
                        "description": "Email body content"
                    }
                },
                "required": ["to", "subject", "body"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "send_email",
            "description": "Send an email (requires user confirmation).",
            "parameters": {
                "type": "object",
                "properties": {
                    "to": {
                        "type": "string",
                        "description": "Recipient email"
                    },
                    "subject": {
                        "type": "string",
                        "description": "Email subject"
                    },
                    "body": {
                        "type": "string",
                        "description": "Email body content"
                    }
                },
                "required": ["to", "subject", "body"]
            }
        }
    },
    # Calendar Tools
    {
        "type": "function",
        "function": {
            "name": "add_event",
            "description": "Add an event to the user's calendar.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "Event title"
                    },
                    "date": {
                        "type": "string",
                        "description": "Event date (ISO format)"
                    },
                    "time": {
                        "type": "string",
                        "description": "Event time (HH:MM)"
                    },
                    "description": {
                        "type": "string",
                        "description": "Event description"
                    }
                },
                "required": ["title", "date", "time"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_events",
            "description": "Get upcoming calendar events.",
            "parameters": {
                "type": "object",
                "properties": {
                    "days": {
                        "type": "integer",
                        "description": "Number of days to look ahead (default 7)",
                        "default": 7
                    }
                }
            }
        }
    },
    # File Tools
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read content from an uploaded file.",
            "parameters": {
                "type": "object",
                "properties": {
                    "file_id": {
                        "type": "string",
                        "description": "The file ID to read"
                    }
                },
                "required": ["file_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_files",
            "description": "List all files uploaded by the user.",
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "description": "Filter by category (optional)"
                    }
                }
            }
        }
    }
]

def get_tool_function(tool_name: str):
    """Get the function to execute for a tool name."""
    tool_map = {
        "browser_search": browser_search,
        "browse_web": browse_web,
        "create_pdf": create_pdf,
        "create_slide": create_slide,
        "create_spreadsheet": create_spreadsheet,
        "draft_email": draft_email,
        "send_email": send_email,
        "add_event": add_event,
        "get_events": get_events,
        "read_file": read_file,
        "list_files": list_files,
    }
    return tool_map.get(tool_name)
