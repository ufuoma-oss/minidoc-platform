// API Client for MiniDoc Python Backend on Render
// This client communicates with the FastAPI backend at minidoc-api.onrender.com

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://minidoc-api.onrender.com';
};

// ==================== Types ====================

export interface ApiResponse {
  response: string;
  agent: string;
  citations: Array<{
    source: string;
    url?: string;
    snippet?: string;
  }>;
  suggested_actions: string[];
  session_id: string;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    content?: string;
  }>;
  user_id?: string;
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface Document {
  id: string;
  user_id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  storage_path?: string;
  category: string;
  status: string;
  url?: string;
  created_at?: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  messages?: Message[];
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  documents?: Document[];
  created_at?: string;
}

export interface Email {
  id: string;
  from: string;
  to: string | string[];
  subject: string;
  body?: string;
  snippet: string;
  date: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
  attendees?: string[];
}

export interface Automation {
  id: string;
  user_id: string;
  name: string;
  description: string;
  trigger_type: string;
  trigger_config: Record<string, unknown>;
  actions: Array<{
    type: string;
    config: Record<string, unknown>;
  }>;
  enabled: boolean;
  last_run_at?: string;
  created_at: string;
}

export interface IntegrationStatus {
  connected: boolean;
  provider: string;
  connected_at?: string;
  scopes?: string[];
}

// ==================== CHAT API ====================

export async function sendMessage(request: ChatRequest): Promise<ApiResponse> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function getAgents(): Promise<Array<{
  type: string;
  name: string;
  description: string;
  capabilities: string[];
  status: string;
}>> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/chat/agents`);
  const data = await response.json();

  return data || [];
}

export async function getApiStatus(): Promise<{
  status: string;
  version: string;
  agents_count: number;
  initialized: boolean;
  uptime_seconds: number;
}> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/chat/status`);
  return response.json();
}

export async function detectIntent(message: string): Promise<{
  category: string;
  target_agent: string;
  confidence: number;
}> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/chat/intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  return response.json();
}

// ==================== DOCUMENT API ====================

export async function uploadDocument(
  file: File,
  userId: string = 'demo-user',
  category: string = 'general'
): Promise<{ success: boolean; document: Document; message: string }> {
  const apiUrl = getApiUrl();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', userId);
  formData.append('category', category);

  const response = await fetch(`${apiUrl}/api/chat/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Upload error: ${response.status}`);
  }

  return response.json();
}

export async function getDocuments(
  userId: string = 'demo-user',
  limit: number = 50
): Promise<{ documents: Document[]; count: number }> {
  const apiUrl = getApiUrl();

  const response = await fetch(
    `${apiUrl}/api/chat/documents?user_id=${userId}&limit=${limit}`
  );

  return response.json();
}

export async function deleteDocument(
  documentId: string,
  userId: string = 'demo-user'
): Promise<{ success: boolean; message: string }> {
  const apiUrl = getApiUrl();

  const response = await fetch(
    `${apiUrl}/api/chat/documents/${documentId}?user_id=${userId}`,
    { method: 'DELETE' }
  );

  if (!response.ok) {
    throw new Error(`Delete error: ${response.status}`);
  }

  return response.json();
}

// ==================== CONVERSATION API ====================

export async function getConversations(
  userId: string = 'demo-user',
  limit: number = 20
): Promise<{ conversations: Conversation[]; count: number }> {
  const apiUrl = getApiUrl();

  const response = await fetch(
    `${apiUrl}/api/chat/conversations?user_id=${userId}&limit=${limit}`
  );

  return response.json();
}

export async function createConversation(
  userId: string = 'demo-user',
  title: string = 'New Chat'
): Promise<{ success: boolean; conversation: Conversation }> {
  const apiUrl = getApiUrl();

  const response = await fetch(
    `${apiUrl}/api/chat/conversations?user_id=${userId}&title=${encodeURIComponent(title)}`,
    { method: 'POST' }
  );

  return response.json();
}

export async function getConversation(
  conversationId: string,
  userId: string = 'demo-user'
): Promise<{ success: boolean; conversation: Conversation }> {
  const apiUrl = getApiUrl();

  const response = await fetch(
    `${apiUrl}/api/chat/conversations/${conversationId}?user_id=${userId}`
  );

  if (!response.ok) {
    throw new Error(`Conversation not found`);
  }

  return response.json();
}

export async function deleteConversation(
  conversationId: string,
  userId: string = 'demo-user'
): Promise<{ success: boolean; message: string }> {
  const apiUrl = getApiUrl();

  const response = await fetch(
    `${apiUrl}/api/chat/conversations/${conversationId}?user_id=${userId}`,
    { method: 'DELETE' }
  );

  if (!response.ok) {
    throw new Error(`Delete error: ${response.status}`);
  }

  return response.json();
}

// ==================== VLM API ====================

export async function analyzeImage(
  file: File,
  prompt: string = 'Describe this image in detail.'
): Promise<{ success: boolean; analysis: string; model: string }> {
  const apiUrl = getApiUrl();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('prompt', prompt);

  const response = await fetch(`${apiUrl}/api/vlm/analyze`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`VLM error: ${response.status}`);
  }

  return response.json();
}

export async function extractTextFromImage(
  file: File
): Promise<{ success: boolean; analysis: string }> {
  const apiUrl = getApiUrl();

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${apiUrl}/api/vlm/ocr`, {
    method: 'POST',
    body: formData
  });

  return response.json();
}

export async function analyzeChart(
  file: File
): Promise<{ success: boolean; analysis: string }> {
  const apiUrl = getApiUrl();

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${apiUrl}/api/vlm/chart`, {
    method: 'POST',
    body: formData
  });

  return response.json();
}

// ==================== PDF API ====================

export async function extractPdfText(
  documentId: string,
  userId: string = 'demo-user'
): Promise<{ success: boolean; text: string; pages: Array<{ page_number: number; text: string }>; page_count: number }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/pdf/extract-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id: documentId, user_id: userId })
  });

  if (!response.ok) {
    throw new Error(`PDF extraction error: ${response.status}`);
  }

  return response.json();
}

export async function extractPdfTables(
  documentId: string,
  userId: string = 'demo-user'
): Promise<{ success: boolean; tables: Array<unknown>; table_count: number }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/pdf/extract-tables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id: documentId, user_id: userId })
  });

  if (!response.ok) {
    throw new Error(`Table extraction error: ${response.status}`);
  }

  return response.json();
}

export async function mergePdfs(
  documentIds: string[],
  userId: string = 'demo-user',
  outputFilename: string = 'merged.pdf'
): Promise<{ success: boolean; merged_document: Document; page_count: number }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/pdf/merge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_ids: documentIds, user_id: userId, output_filename: outputFilename })
  });

  if (!response.ok) {
    throw new Error(`PDF merge error: ${response.status}`);
  }

  return response.json();
}

export async function splitPdf(
  documentId: string,
  ranges: string[],
  userId: string = 'demo-user'
): Promise<{ success: boolean; split_documents: Document[] }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/pdf/split`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id: documentId, ranges, user_id: userId })
  });

  if (!response.ok) {
    throw new Error(`PDF split error: ${response.status}`);
  }

  return response.json();
}

export async function getPdfInfo(
  documentId: string,
  userId: string = 'demo-user'
): Promise<{ success: boolean; page_count: number; size_bytes: number; metadata: Record<string, string> }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/pdf/info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id: documentId, user_id: userId })
  });

  if (!response.ok) {
    throw new Error(`PDF info error: ${response.status}`);
  }

  return response.json();
}

// ==================== DOCUMENT GENERATION API ====================

export async function generatePdf(
  title: string,
  content: string,
  userId: string = 'demo-user',
  filename?: string
): Promise<{ success: boolean; document: Document }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/documents/generate/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, user_id: userId, filename })
  });

  if (!response.ok) {
    throw new Error(`PDF generation error: ${response.status}`);
  }

  return response.json();
}

export async function generateSpreadsheet(
  title: string,
  data: Array<Record<string, unknown>>,
  userId: string = 'demo-user',
  filename?: string
): Promise<{ success: boolean; document: Document; row_count: number }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/documents/generate/spreadsheet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, data, user_id: userId, filename })
  });

  if (!response.ok) {
    throw new Error(`Spreadsheet generation error: ${response.status}`);
  }

  return response.json();
}

export async function generateDocx(
  title: string,
  content: string,
  userId: string = 'demo-user',
  filename?: string
): Promise<{ success: boolean; document: Document }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/documents/generate/docx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, user_id: userId, filename })
  });

  if (!response.ok) {
    throw new Error(`Word document generation error: ${response.status}`);
  }

  return response.json();
}

export async function generatePptx(
  title: string,
  slides: Array<{ title: string; content: string }>,
  userId: string = 'demo-user',
  filename?: string
): Promise<{ success: boolean; document: Document; slide_count: number }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/documents/generate/pptx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, slides, user_id: userId, filename })
  });

  if (!response.ok) {
    throw new Error(`PowerPoint generation error: ${response.status}`);
  }

  return response.json();
}

// ==================== INTEGRATIONS API ====================

export async function getGoogleConnectUrl(userId: string = 'demo-user'): Promise<{ auth_url: string }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/integrations/google/connect?user_id=${userId}`);

  if (!response.ok) {
    throw new Error(`Failed to get Google connect URL`);
  }

  return response.json();
}

export async function getGoogleStatus(userId: string = 'demo-user'): Promise<IntegrationStatus> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/integrations/google/status?user_id=${userId}`);

  return response.json();
}

export async function disconnectGoogle(userId: string = 'demo-user'): Promise<{ success: boolean }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/integrations/google/disconnect?user_id=${userId}`, {
    method: 'DELETE'
  });

  return response.json();
}

export async function getMicrosoftConnectUrl(userId: string = 'demo-user'): Promise<{ auth_url: string }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/integrations/microsoft/connect?user_id=${userId}`);

  if (!response.ok) {
    throw new Error(`Failed to get Microsoft connect URL`);
  }

  return response.json();
}

export async function getMicrosoftStatus(userId: string = 'demo-user'): Promise<IntegrationStatus> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/integrations/microsoft/status?user_id=${userId}`);

  return response.json();
}

export async function disconnectMicrosoft(userId: string = 'demo-user'): Promise<{ success: boolean }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/integrations/microsoft/disconnect?user_id=${userId}`, {
    method: 'DELETE'
  });

  return response.json();
}

// Gmail
export async function getGmailEmails(
  userId: string = 'demo-user',
  query: string = '',
  maxResults: number = 10
): Promise<{ success: boolean; emails: Email[] }> {
  const apiUrl = getApiUrl();

  const response = await fetch(
    `${apiUrl}/api/integrations/gmail/emails?user_id=${userId}&query=${encodeURIComponent(query)}&max_results=${maxResults}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get emails`);
  }

  return response.json();
}

export async function sendGmailEmail(
  to: string,
  subject: string,
  body: string,
  userId: string = 'demo-user'
): Promise<{ success: boolean; message_id: string }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/integrations/gmail/send?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, body })
  });

  if (!response.ok) {
    throw new Error(`Failed to send email`);
  }

  return response.json();
}

// Calendar
export async function getCalendarEvents(
  userId: string = 'demo-user',
  days: number = 30
): Promise<{ success: boolean; events: CalendarEvent[] }> {
  const apiUrl = getApiUrl();

  const response = await fetch(
    `${apiUrl}/api/integrations/calendar/events?user_id=${userId}&days=${days}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get calendar events`);
  }

  return response.json();
}

export async function createCalendarEvent(
  title: string,
  start: string,
  end: string,
  userId: string = 'demo-user',
  description?: string,
  location?: string,
  attendees?: string[]
): Promise<{ success: boolean; event_id: string }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/integrations/calendar/events?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, start, end, description, location, attendees })
  });

  if (!response.ok) {
    throw new Error(`Failed to create event`);
  }

  return response.json();
}

// Drive
export async function getDriveFiles(
  userId: string = 'demo-user',
  query: string = ''
): Promise<{ success: boolean; files: Array<{ id: string; name: string; mimeType: string; webViewLink: string }> }> {
  const apiUrl = getApiUrl();

  const response = await fetch(
    `${apiUrl}/api/integrations/drive/files?user_id=${userId}&query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get Drive files`);
  }

  return response.json();
}

// ==================== AUTOMATION API ====================

export async function getAutomations(
  userId: string = 'demo-user'
): Promise<{ success: boolean; automations: Automation[] }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/automations/list?user_id=${userId}`);

  return response.json();
}

export async function createAutomation(
  name: string,
  triggerType: string,
  triggerConfig: Record<string, unknown>,
  actions: Array<{ type: string; config: Record<string, unknown> }>,
  userId: string = 'demo-user',
  description: string = '',
  enabled: boolean = true
): Promise<{ success: boolean; automation: Automation }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/automations?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, trigger_type: triggerType, trigger_config: triggerConfig, actions, enabled })
  });

  if (!response.ok) {
    throw new Error(`Failed to create automation`);
  }

  return response.json();
}

export async function deleteAutomation(
  automationId: string,
  userId: string = 'demo-user'
): Promise<{ success: boolean }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/automations/${automationId}?user_id=${userId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`Failed to delete automation`);
  }

  return response.json();
}

export async function runAutomation(
  automationId: string,
  userId: string = 'demo-user'
): Promise<{ success: boolean; run_id: string }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/automations/${automationId}/run?user_id=${userId}`, {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error(`Failed to run automation`);
  }

  return response.json();
}

// ==================== TELEGRAM API ====================

export async function getTelegramBotInfo(): Promise<{ success: boolean; bot?: { id: number; username: string }; configured: boolean }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/telegram/bot/info`);

  return response.json();
}

export async function registerTelegramUser(
  userId: string,
  telegramId: string,
  username?: string
): Promise<{ success: boolean }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/telegram/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, telegram_id: telegramId, username })
  });

  if (!response.ok) {
    throw new Error(`Failed to register Telegram user`);
  }

  return response.json();
}

// ==================== HEALTH CHECK ====================

export async function healthCheck(): Promise<{ status: string }> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/health`);
  return response.json();
}

export async function rootInfo(): Promise<{
  name: string;
  version: string;
  status: string;
  docs: string;
}> {
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/`);
  return response.json();
}
