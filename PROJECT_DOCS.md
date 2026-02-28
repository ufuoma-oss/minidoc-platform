# MiniDoc Platform - Complete Project Documentation

> **CRITICAL**: This document is the SOURCE OF TRUTH for this project. Any AI assistant working on this codebase MUST read this document first before making any changes. All changes MUST be recorded in the changelog section below.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Deployments](#deployments)
5. [Credentials & Secrets](#credentials--secrets)
6. [Repository Structure](#repository-structure)
7. [Important Files](#important-files)
8. [Features Status](#features-status)
9. [API Endpoints](#api-endpoints)
10. [Database Schema](#database-schema)
11. [Remaining Work](#remaining-work)
12. [Changelog](#changelog)

---

## Project Overview

**MiniDoc** is an AI-powered document management and automation SaaS platform. It allows users to:
- Upload and manage documents (PDFs, images, spreadsheets, etc.)
- Chat with AI about their documents
- Automate tasks across connected apps (Gmail, Google Drive, WhatsApp, etc.)
- Generate documents, reports, and summaries

### Landing Page Promises
Based on the landing page (`/src/app/page.tsx`), the platform promises:
1. **Document Intelligence** - Upload, analyze, and chat with documents
2. **App Integrations** - Connect Gmail, Drive, Outlook, WhatsApp, etc.
3. **Task Automation** - Automate repetitive tasks
4. **Document Generation** - Create PDFs, spreadsheets, presentations
5. **Smart Search** - Find information across all connected sources
6. **Multi-Agent AI** - Specialized agents for different tasks

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                            │
│                    Next.js 16 Application                       │
│                    Location: /src/*                             │
│                    URL: https://minidoc.vercel.app              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ API Calls
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RENDER (Backend)                             │
│                    Python FastAPI Application                   │
│                    Location: /apps/api/*                        │
│                    URL: https://minidoc-api.onrender.com        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (Database & Storage)                │
│                    PostgreSQL Database                          │
│                    File Storage                                 │
│                    URL: https://tbspouhjknlxpvpglexm.supabase.co│
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NVIDIA NIM (AI)                              │
│                    Kimi K2 Model                                │
│                    API Key: nvapi-***                           │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architecture Decisions

1. **Single Python Backend**: All backend logic is in Python FastAPI on Render. NO Next.js API routes for business logic.
2. **Frontend calls Backend directly**: Next.js frontend makes fetch calls to Python backend
3. **Supabase for everything**: Database, file storage, and authentication
4. **NVIDIA NIM for AI**: Using Kimi K2 model via NVIDIA's API

---

## Technology Stack

### Frontend (Vercel)
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16 | React framework with App Router |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | Latest | UI components |
| Framer Motion | Latest | Animations |
| Zustand | Latest | Client state management |

### Backend (Render)
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Backend language |
| FastAPI | Latest | API framework |
| Uvicorn | Latest | ASGI server |
| httpx | Latest | HTTP client for AI calls |
| Pydantic | Latest | Data validation |

### Database & Storage (Supabase)
| Service | Purpose |
|---------|---------|
| PostgreSQL | Main database |
| Storage | File uploads |
| Auth | User authentication (planned) |

### AI Provider
| Provider | Model | Purpose |
|----------|-------|---------|
| NVIDIA NIM | Kimi K2 | Conversational AI, document analysis |

---

## Deployments

### Frontend - Vercel
- **Platform**: Vercel
- **URL**: https://minidoc.vercel.app (or similar)
- **Repository**: https://github.com/ufuoma-oss/minidoc-platform
- **Branch**: main
- **Root Directory**: `/` (root of repo)
- **Build Command**: `bun run build`
- **Auto-deploys**: Yes, on push to main

### Backend - Render
- **Platform**: Render
- **Service ID**: `srv-d6flpama2pns7382f2e0`
- **URL**: https://minidoc-api.onrender.com
- **Repository**: https://github.com/ufuoma-oss/minidoc-platform
- **Branch**: main
- **Root Directory**: `apps/api`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Auto-deploys**: Yes, on push to main

---

## Credentials & Secrets

> **WARNING**: These credentials are sensitive. In production, use environment variables.

### Render Environment Variables
```
NVIDIA_API_KEY=<configured-in-render-dashboard>
SUPABASE_URL=https://tbspouhjknlxpvpglexm.supabase.co
SUPABASE_ANON_KEY=<configured-in-render-dashboard>
```

### Render API Access
```
API Token: <configured-locally>
Service ID: srv-d6flpama2pns7382f2e0
```

### GitHub Access
```
Token: <configured-locally>
Repo: https://github.com/ufuoma-oss/minidoc-platform
```

### Supabase Credentials
```
URL: https://tbspouhjknlxpvpglexm.supabase.co
Anon Key: <configured-in-render-dashboard>
```

---

## Repository Structure

```
minidoc-platform/
├── PROJECT_DOCS.md          # THIS FILE - Source of truth
├── README.md                # Public readme
├── package.json             # Frontend dependencies
├── bun.lockb                # Bun lock file
├── next.config.ts           # Next.js config
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
│
├── apps/                    # Backend applications
│   └── api/                 # Python FastAPI backend
│       ├── app/
│       │   ├── main.py      # FastAPI app entry
│       │   ├── core/
│       │   │   ├── config.py        # Settings
│       │   │   └── supabase_client.py  # Supabase integration
│       │   ├── agents/
│       │   │   ├── base.py          # Base agent class
│       │   │   ├── librarian.py     # Document agent
│       │   │   ├── automator.py     # Automation agent
│       │   │   ├── analyst.py       # Analysis agent
│       │   │   ├── researcher.py    # Research agent
│       │   │   ├── writer.py        # Content agent
│       │   │   └── assistant.py     # General assistant
│       │   ├── routers/
│       │   │   ├── chat.py          # Chat endpoints
│       │   │   ├── documents.py     # Document endpoints
│       │   │   └── vlm.py           # Vision/image analysis
│       │   └── models/
│       │       └── schemas.py       # Pydantic models
│       ├── requirements.txt
│       └── Dockerfile
│
├── src/                     # Next.js frontend
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── dashboard/       # Dashboard page
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── minidoc/
│   │       ├── dashboard/   # Dashboard components
│   │       │   ├── Dashboard.tsx
│   │       │   ├── ChatView.tsx
│   │       │   ├── Sidebar.tsx
│   │       │   ├── FileUpload.tsx
│   │       │   ├── SettingsModal.tsx
│   │       │   ├── AppIntegrationModal.tsx
│   │       │   ├── OnboardingModal.tsx
│   │       │   └── PaywallModal.tsx
│   │       ├── landing/     # Landing page components
│   │       ├── icons/       # Custom icons
│   │       └── legal/       # Privacy/Terms pages
│   ├── lib/
│   │   ├── api.ts           # API client for Python backend
│   │   └── minidoc/
│   │       ├── types.ts     # TypeScript types
│   │       └── storage.ts   # LocalStorage helpers
│   └── hooks/               # Custom React hooks
│
├── prisma/                  # Prisma schema (if using)
│   └── schema.prisma
│
└── public/                  # Static assets
```

---

## Important Files

### Frontend Core Files
| File | Purpose |
|------|---------|
| `/src/app/page.tsx` | Landing page - defines all product promises |
| `/src/app/layout.tsx` | Root layout with providers |
| `/src/components/minidoc/dashboard/Dashboard.tsx` | Main dashboard container |
| `/src/components/minidoc/dashboard/ChatView.tsx` | Chat interface |
| `/src/components/minidoc/dashboard/Sidebar.tsx` | Navigation sidebar |
| `/src/lib/api.ts` | API client calling Python backend |
| `/src/lib/minidoc/types.ts` | All TypeScript interfaces |

### Backend Core Files
| File | Purpose |
|------|---------|
| `/apps/api/app/main.py` | FastAPI app entry point |
| `/apps/api/app/core/config.py` | Environment settings |
| `/apps/api/app/core/supabase_client.py` | Supabase connection |
| `/apps/api/app/agents/base.py` | Base agent with AI integration |
| `/apps/api/app/routers/chat.py` | Chat and document upload endpoints |
| `/apps/api/app/routers/vlm.py` | Vision/image analysis endpoints |

---

## Features Status

### ✅ Completed Features

| Feature | Status | Details |
|---------|--------|---------|
| Landing Page | ✅ Done | Full landing page with all sections |
| Dashboard UI | ✅ Done | Complete dashboard layout |
| Chat Interface | ✅ Done | Working chat with AI responses |
| File Upload | ✅ Done | Native file picker, uploads to Supabase |
| Document Storage | ✅ Done | Files stored in Supabase Storage |
| AI Integration | ✅ Done | NVIDIA NIM (Kimi K2) connected |
| Supabase Integration | ✅ Done | Database and storage working |
| Python Backend | ✅ Done | FastAPI on Render, auto-deploys |
| Multi-Agent System | ✅ Done | 6 specialized agents |
| VLM (Vision) | ✅ Done | Image analysis endpoint |
| Document Attachment | ✅ Done | Attach docs to chat messages |
| **PDF Operations** | ✅ Done | Extract text, tables, merge, split |
| **Document Generation** | ✅ Done | Generate PDF, XLSX, DOCX, PPTX |
| **Google Integration** | ✅ Done | Gmail, Drive, Calendar OAuth |
| **Microsoft Integration** | ✅ Done | Outlook, OneDrive OAuth |
| **Telegram Bot** | ✅ Done | Controller channel notifications |
| **Task Automation** | ✅ Done | Workflow engine with triggers/actions |
| **Citations & RAG** | ✅ Done | Vector embeddings, semantic search |

### 🚧 In Progress

| Feature | Status | Details |
|---------|--------|---------|
| App Integrations UI | 🚧 Partial | OAuth working, need UI polish |
| User Authentication | 🚧 TODO | Supabase Auth to be implemented |

### ❌ Not Started

| Feature | Status | Landing Page Promise |
|---------|--------|---------------------|
| User Authentication | ❌ TODO | "Secure login" |
| Subscription/Billing | ❌ TODO | "Plans starting at $19/mo" |
| WhatsApp Integration | ❌ TODO | Replaced with Telegram |
| Smart Search UI | ❌ TODO | Search across all sources |
| Usage Tracking | ❌ TODO | Track AI usage per user |

---

## API Endpoints

### Python Backend (Render)

#### Health Check
```
GET /
GET /health
```

#### Chat
```
POST /api/chat
Body: { message: string, documents?: [], session_id?: string }
Response: { response: string, agent: string, tools_used: [], citations: [] }

GET /api/chat/agents
GET /api/chat/status
POST /api/chat/intent
```

#### Documents
```
GET /api/chat/documents?user_id=xxx
POST /api/chat/upload
DELETE /api/chat/documents/{doc_id}
```

#### PDF Operations
```
POST /api/pdf/extract-text
Body: { document_id: string, user_id: string }
Response: { text: string, pages: [], page_count: int }

POST /api/pdf/extract-tables
Body: { document_id: string, user_id: string }
Response: { tables: [], table_count: int }

POST /api/pdf/merge
Body: { document_ids: [], user_id: string }
Response: { merged_document: {}, page_count: int }

POST /api/pdf/split
Body: { document_id: string, ranges: [], user_id: string }
Response: { split_documents: [] }

POST /api/pdf/info
GET /api/pdf/render-page/{doc_id}
```

#### Document Generation
```
POST /api/documents/generate/pdf
POST /api/documents/generate/spreadsheet
POST /api/documents/generate/docx
POST /api/documents/generate/pptx
```

#### Google Integrations
```
GET /api/integrations/google/connect
GET /api/integrations/google/callback
DELETE /api/integrations/google/disconnect
GET /api/integrations/google/status

GET /api/integrations/gmail/emails
POST /api/integrations/gmail/send
POST /api/integrations/gmail/draft

GET /api/integrations/drive/files
GET /api/integrations/drive/files/{file_id}

GET /api/integrations/calendar/events
POST /api/integrations/calendar/events
```

#### Microsoft Integrations
```
GET /api/integrations/microsoft/connect
GET /api/integrations/microsoft/callback
DELETE /api/integrations/microsoft/disconnect

GET /api/integrations/outlook/emails
POST /api/integrations/outlook/send

GET /api/integrations/onedrive/files
```

#### Telegram Bot
```
GET /api/telegram/bot/info
POST /api/telegram/send
POST /api/telegram/register
POST /api/telegram/webhook
GET /api/telegram/webhook/set
```

#### Automations
```
GET /api/automations/list
POST /api/automations
GET /api/automations/{id}
PUT /api/automations/{id}
DELETE /api/automations/{id}
POST /api/automations/{id}/run
POST /api/automations/{id}/toggle
GET /api/automations/{id}/runs
GET /api/automations/templates
```

#### VLM (Vision)
```
POST /api/vlm/analyze
POST /api/vlm/ocr
POST /api/vlm/chart
```

---

## Database Schema

### Supabase Tables

#### documents
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  original_name TEXT,
  mime_type TEXT,
  size BIGINT,
  url TEXT,
  extracted_text TEXT,
  category TEXT DEFAULT 'general',
  status TEXT DEFAULT 'ready',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### chats (planned)
```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### messages (planned)
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Remaining Work

### Phase 1: Core SaaS Features (Priority: HIGH)

1. **User Authentication**
   - Implement Supabase Auth
   - Login/signup pages
   - Protected routes
   - Session management

2. **Subscription/Billing**
   - Stripe integration
   - Pricing tiers
   - Usage limits
   - Payment flow

3. **Chat Persistence**
   - Save chats to Supabase
   - Load chat history
   - Delete chats

### Phase 2: Document Operations (Priority: HIGH)

1. **PDF Operations**
   - Merge PDFs
   - Split PDFs
   - Extract text
   - Extract tables

2. **Document Generation**
   - Generate PDFs
   - Generate XLSX
   - Generate DOCX
   - Generate PPTX

### Phase 3: App Integrations (Priority: MEDIUM)

1. **Google Workspace**
   - Gmail API integration
   - Google Drive API
   - Google Sheets API
   - Google Calendar API

2. **Microsoft 365**
   - Outlook integration
   - OneDrive integration
   - Teams integration

3. **Communication**
   - WhatsApp Business API
   - Slack API

### Phase 4: AI Enhancements (Priority: MEDIUM)

1. **RAG Implementation**
   - Vector embeddings for documents
   - Semantic search
   - Document context in chat

2. **Agent Improvements**
   - Better tool usage
   - Multi-step reasoning
   - Task chaining

---

## Changelog

> **IMPORTANT**: Every change pushed to this project MUST be recorded here with date, description, and affected files.

### 2026-03-01 - Major Feature Implementation: Integrations, PDF Ops, Document Gen, Automation, Citations

- **Added**: PDF Operations Service (`/apps/api/app/services/pdf_service.py`)
  - Extract text from PDFs
  - Extract tables from PDFs
  - Merge multiple PDFs
  - Split PDFs by page ranges
  - Render PDF pages as images

- **Added**: Document Generation Service (`/apps/api/app/services/document_service.py`)
  - Generate PDF documents with ReportLab
  - Generate Excel spreadsheets with openpyxl
  - Generate Word documents with python-docx
  - Generate PowerPoint presentations with python-pptx

- **Added**: OAuth Service (`/apps/api/app/services/oauth_service.py`)
  - Google OAuth flow
  - Microsoft OAuth flow
  - Token management and refresh

- **Added**: Google Service (`/apps/api/app/services/google_service.py`)
  - Gmail API (list, send, draft)
  - Google Drive API (list, download, upload)
  - Google Calendar API (list, create events)

- **Added**: Microsoft Service (`/apps/api/app/services/microsoft_service.py`)
  - Outlook Mail API (list, send)
  - OneDrive API (list, download, upload)
  - Microsoft Calendar API

- **Added**: Telegram Service (`/apps/api/app/services/telegram_service.py`)
  - Bot messaging
  - Controller channel notifications
  - User notification system

- **Added**: Automation Service (`/apps/api/app/services/automation_service.py`)
  - Create/update/delete automations
  - Trigger types: schedule, email, document, webhook, manual
  - Action types: send_email, create_document, ai_process, notify_telegram, webhook
  - Run tracking and history

- **Added**: Embedding Service (`/apps/api/app/services/embedding_service.py`)
  - Vector embeddings via NVIDIA NIM
  - Document chunking and indexing
  - Semantic similarity search

- **Added**: Citation Service (`/apps/api/app/services/citation_service.py`)
  - Document context retrieval
  - Citation extraction and formatting
  - Response enhancement with citations

- **Added**: New API Routers
  - `/apps/api/app/routers/pdf.py` - PDF operations
  - `/apps/api/app/routers/documents.py` - Document generation
  - `/apps/api/app/routers/integrations.py` - Google/Microsoft OAuth
  - `/apps/api/app/routers/telegram.py` - Telegram bot
  - `/apps/api/app/routers/automations.py` - Task automation

- **Added**: Frontend Components
  - `/src/components/minidoc/dashboard/PdfOperationsModal.tsx`
  - `/src/components/minidoc/dashboard/DocumentGeneratorModal.tsx`
  - `/src/components/minidoc/dashboard/AutomationModal.tsx`

- **Updated**: API Client (`/src/lib/api.ts`)
  - Added all new endpoint functions
  - New types for integrations, automations, etc.

- **Updated**: Types (`/src/lib/minidoc/types.ts`)
  - Added integration, automation, citation types

- **Updated**: Requirements (`/apps/api/requirements.txt`)
  - PyMuPDF, pdfplumber, pypdf for PDF operations
  - reportlab, openpyxl, python-docx, python-pptx for document generation
  - google-auth, google-api-python-client for Google integrations
  - msal for Microsoft integrations
  - python-telegram-bot for Telegram
  - apscheduler for automation scheduling
  - sentence-transformers, pgvector for embeddings

**Files Changed:**
- `/apps/api/requirements.txt`
- `/apps/api/app/main.py`
- `/apps/api/app/services/*.py` (8 new files)
- `/apps/api/app/routers/*.py` (5 new files)
- `/src/lib/api.ts`
- `/src/lib/minidoc/types.ts`
- `/src/components/minidoc/dashboard/*.tsx` (3 new files)

### 2026-02-28 - Project Documentation Created
- **Created**: PROJECT_DOCS.md - comprehensive project documentation
- **Purpose**: Source of truth for all future development and AI assistants
- **Files**: `/PROJECT_DOCS.md`
- **Commit**: fd01966

### 2026-02-28 - File Upload UX Improvements
- **Changed**: Removed modal-style file upload, now uses native OS file picker
- **Changed**: Uploaded files now appear as messages in chat (visible, not silent)
- **Changed**: Placeholder text always says "Ask anything..." (removed attachment count)
- **Changed**: Upload icon changed from Paperclip back to Plus
- **Removed**: FileUpload modal component usage from Dashboard
- **Files**: 
  - `/src/components/minidoc/dashboard/ChatView.tsx`
  - `/src/components/minidoc/dashboard/Dashboard.tsx`

### 2026-02-28 - Python Backend Supabase Integration
- **Added**: Supabase client to Python backend (`/apps/api/app/core/supabase_client.py`)
- **Added**: VLM (Vision) endpoints for image analysis (`/apps/api/app/routers/vlm.py`)
- **Fixed**: Async/await issue in base.py agent - changed to async def and AsyncClient
- **Files**:
  - `/apps/api/app/core/supabase_client.py`
  - `/apps/api/app/routers/vlm.py`
  - `/apps/api/app/routers/chat.py`
  - `/apps/api/app/agents/base.py`

### 2026-02-28 - Frontend Backend Migration
- **Changed**: Dashboard now calls Python backend directly (not Next.js API)
- **Removed**: Dependency on Next.js API routes for chat functionality
- **Commit**: a8d8138
- **Files**:
  - `/src/components/minidoc/dashboard/Dashboard.tsx`
  - `/src/lib/api.ts`

### 2026-02-28 - Initial Render Deployment
- **Deployed**: Python FastAPI backend to Render
- **Configured**: Environment variables (NVIDIA_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY)
- **URL**: https://minidoc-api.onrender.com
- **Service ID**: srv-d6flpama2pns7382f2e0

### 2026-02-28 - Initial Vercel Deployment
- **Deployed**: Next.js frontend to Vercel
- **Repository**: Connected to GitHub for auto-deploys
- **Branch**: main

---

## Development Guidelines

### For AI Assistants

When working on this project, you MUST:

1. **Read this document first** - Understand the architecture and current state
2. **Follow the stack** - Python backend, Next.js frontend, Supabase database
3. **Update the changelog** - Record every change you make
4. **No Next.js API routes** - All backend logic goes to Python
5. **Check existing components** - Use shadcn/ui components from `/src/components/ui/`
6. **Test on preview** - Use the Preview Panel, not localhost URLs

### Code Style

- TypeScript strict mode enabled
- Use existing components from shadcn/ui
- Follow existing patterns in the codebase
- No emojis in code unless explicitly requested
- Mobile-first responsive design

### Git Workflow

1. Make changes
2. Test thoroughly
3. Update this changelog
4. Commit with descriptive message
5. Push to main (auto-deploys)

---

## Emergency Contacts & Resources

- **Render Dashboard**: https://dashboard.render.com
- **Supabase Dashboard**: https://supabase.com/dashboard
- **GitHub Repo**: https://github.com/ufuoma-oss/minidoc-platform
- **NVIDIA NIM Docs**: https://build.nvidia.com

---

*Last Updated: 2026-03-01*
*Document Version: 2.0*
