import { NextRequest, NextResponse } from 'next/server';

// Backend API URL - Python FastAPI on Render
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://minidoc-api.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, documents, session_id } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Call the Python backend on Render
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        documents: documents || [],
        session_id: session_id || `session_${Date.now()}`
      })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      response: data.response,
      agent: data.agent,
      citations: data.citations || [],
      session_id: data.session_id
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend. Please try again.' },
      { status: 500 }
    );
  }
}
