// API Client for MiniDoc Python Backend on Render

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
}

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
