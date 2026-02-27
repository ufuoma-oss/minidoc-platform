import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// File upload API - handles documents, images, PDFs
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string || 'demo-user';
    const category = formData.get('category') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'text/plain',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not supported' }, { status: 400 });
    }

    // Store file as base64 (in production use Vercel Blob or S3)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    
    // Create document record
    const document = await db.document.create({
      data: {
        userId,
        filename: `${Date.now()}-${file.name}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: base64,
        status: 'processing',
        category,
      },
    });

    // Process file based on type
    let extractedText = '';
    
    if (file.type === 'text/plain' || file.type === 'text/csv') {
      extractedText = buffer.toString('utf-8');
    } else if (file.type.startsWith('image/')) {
      extractedText = `[IMAGE: ${file.name}] - Ready for vision analysis`;
    } else if (file.type === 'application/pdf') {
      extractedText = `[PDF: ${file.name}] - Ready for extraction`;
    } else {
      extractedText = `[DOCUMENT: ${file.name}] - Ready for processing`;
    }

    // Update document with extracted text
    await db.document.update({
      where: { id: document.id },
      data: {
        extractedText,
        status: 'ready',
      },
    });

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        status: 'ready',
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Get documents for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';

    const documents = await db.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Fetch documents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
