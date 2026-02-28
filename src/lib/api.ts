// API Client for MiniDoc Python Backend on Render
// This client communicates with the FastAPI backend at minidoc-api.onrender.com

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://minidoc-api.onrender.com';
};

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
