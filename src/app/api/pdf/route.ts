import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

const PYTHON_PATH = '/home/z/.venv/bin/python';
const TEMP_DIR = '/home/z/my-project/temp_pdf';
const OUTPUT_DIR = '/home/z/my-project/generated';

async function ensureDirs() {
  if (!existsSync(TEMP_DIR)) {
    await mkdir(TEMP_DIR, { recursive: true });
  }
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }
}

// ============== PDF MERGING ==============
async function mergePdfs(pdfPaths: string[], outputPath: string): Promise<Buffer> {
  await ensureDirs();
  
  const pathsJson = JSON.stringify(pdfPaths);
  const scriptPath = path.join(TEMP_DIR, `merge_${Date.now()}.py`);
  
  const pythonScript = `
import sys
import json
from pypdf import PdfReader, PdfWriter

pdf_paths = ${pathsJson}
output_path = "${outputPath}"

writer = PdfWriter()

for pdf_path in pdf_paths:
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            writer.add_page(page)
    except Exception as e:
        print(f"Warning: Could not read {pdf_path}: {e}", file=sys.stderr)

with open(output_path, 'wb') as f:
    writer.write(f)

print("PDF merged successfully")
`;

  await writeFile(scriptPath, pythonScript);
  
  try {
    await execAsync(`${PYTHON_PATH} "${scriptPath}"`);
    const buffer = await readFile(outputPath);
    await unlink(scriptPath);
    await unlink(outputPath);
    return buffer;
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

// ============== PDF SPLITTING ==============
async function splitPdf(pdfPath: string, pageRanges: Array<{start: number; end: number}>): Promise<Array<{pages: string; buffer: Buffer}>> {
  await ensureDirs();
  
  const rangesJson = JSON.stringify(pageRanges);
  const scriptPath = path.join(TEMP_DIR, `split_${Date.now()}.py`);
  const outputDir = path.join(OUTPUT_DIR, `split_${Date.now()}`);
  await mkdir(outputDir, { recursive: true });
  
  const pythonScript = `
import sys
import json
from pypdf import PdfReader, PdfWriter
import base64

pdf_path = "${pdfPath}"
ranges = ${rangesJson}
output_dir = "${outputDir}"

reader = PdfReader(pdf_path)
results = []

for i, r in enumerate(ranges):
    start = r['start'] - 1  # Convert to 0-indexed
    end = r['end']
    
    writer = PdfWriter()
    for page_num in range(start, min(end, len(reader.pages))):
        writer.add_page(reader.pages[page_num])
    
    output_path = f"{output_dir}/split_{i+1}.pdf"
    with open(output_path, 'wb') as f:
        writer.write(f)
    
    # Read as base64
    with open(output_path, 'rb') as f:
        content = base64.b64encode(f.read()).decode()
    
    results.append({
        'pages': f"Pages {r['start']}-{r['end']}",
        'base64': content
    })

print(json.dumps(results))
`;

  await writeFile(scriptPath, pythonScript);
  
  try {
    const { stdout } = await execAsync(`${PYTHON_PATH} "${scriptPath}"`, { maxBuffer: 50 * 1024 * 1024 });
    await unlink(scriptPath);
    
    const results = JSON.parse(stdout);
    return results.map((r: any) => ({
      pages: r.pages,
      buffer: Buffer.from(r.base64, 'base64')
    }));
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

// ============== EXTRACT PAGES ==============
async function extractPages(pdfPath: string, pages: number[]): Promise<Buffer> {
  await ensureDirs();
  
  const pagesJson = JSON.stringify(pages);
  const outputPath = path.join(OUTPUT_DIR, `extracted_${Date.now()}.pdf`);
  const scriptPath = path.join(TEMP_DIR, `extract_${Date.now()}.py`);
  
  const pythonScript = `
import sys
import json
from pypdf import PdfReader, PdfWriter

pdf_path = "${pdfPath}"
pages_to_extract = ${pagesJson}
output_path = "${outputPath}"

reader = PdfReader(pdf_path)
writer = PdfWriter()

for page_num in pages_to_extract:
    idx = page_num - 1  # Convert to 0-indexed
    if 0 <= idx < len(reader.pages):
        writer.add_page(reader.pages[idx])

with open(output_path, 'wb') as f:
    writer.write(f)

print("Pages extracted successfully")
`;

  await writeFile(scriptPath, pythonScript);
  
  try {
    await execAsync(`${PYTHON_PATH} "${scriptPath}"`);
    const buffer = await readFile(outputPath);
    await unlink(scriptPath);
    await unlink(outputPath);
    return buffer;
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

// ============== EXTRACT TEXT WITH CITATIONS ==============
async function extractTextWithCitations(pdfPath: string): Promise<{
  text: string;
  pages: Array<{
    page: number;
    text: string;
    citation: string;
  }>;
  metadata: {
    title: string;
    author: string;
    totalPages: number;
  };
}> {
  await ensureDirs();
  
  const scriptPath = path.join(TEMP_DIR, `extract_text_${Date.now()}.py`);
  
  const pythonScript = `
import sys
import json
import fitz  # PyMuPDF

pdf_path = "${pdfPath}"

doc = fitz.open(pdf_path)

result = {
    "text": "",
    "pages": [],
    "metadata": {
        "title": doc.metadata.get("title", "Unknown"),
        "author": doc.metadata.get("author", "Unknown"),
        "totalPages": len(doc)
    }
}

full_text = []

for page_num, page in enumerate(doc, 1):
    text = page.get_text()
    full_text.append(text)
    
    # Generate citation
    citation = f'[Page {page_num} of "{result["metadata"]["title"]}" by {result["metadata"]["author"]}]'
    
    result["pages"].append({
        "page": page_num,
        "text": text,
        "citation": citation
    })

result["text"] = "\\n\\n".join(full_text)

doc.close()
print(json.dumps(result))
`;

  await writeFile(scriptPath, pythonScript);
  
  try {
    const { stdout } = await execAsync(`${PYTHON_PATH} "${scriptPath}"`, { maxBuffer: 50 * 1024 * 1024 });
    await unlink(scriptPath);
    return JSON.parse(stdout);
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

// ============== CREATE PDF WITH CITATIONS ==============
async function createPdfWithCitations(
  title: string,
  content: string,
  sources: Array<{
    title: string;
    url?: string;
    author?: string;
    date?: string;
  }>
): Promise<Buffer> {
  await ensureDirs();
  
  const outputPath = path.join(OUTPUT_DIR, `cited_${Date.now()}.pdf`);
  const scriptPath = path.join(TEMP_DIR, `cited_${Date.now()}.py`);
  
  // Build citations section
  const citationsCode = sources.map((s, i) => {
    const safeTitle = s.title.replace(/"/g, '\\"');
    const safeUrl = (s.url || '').replace(/"/g, '\\"');
    const safeAuthor = (s.author || 'Unknown').replace(/"/g, '\\"');
    const safeDate = (s.date || 'n.d.').replace(/"/g, '\\"');
    return `
story.append(Paragraph("<b>[${i + 1}]</b> ${safeTitle}", cite_style))
story.append(Paragraph("    Author: ${safeAuthor}, Date: ${safeDate}", cite_detail))
${safeUrl ? `story.append(Paragraph("    URL: ${safeUrl}", cite_detail))` : ''}
story.append(Spacer(1, 8))
`;
  }).join('\n');

  const safeTitle = title.replace(/"/g, '\\"');
  const safeContent = content.replace(/"/g, '\\"').replace(/\n/g, '<br/>');
  
  const pythonScript = `
import sys
sys.path.insert(0, '/home/z/my-project')

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
doc = SimpleDocTemplate("${outputPath}", pagesize=letter,
    title="${safeTitle}",
    author="MiniDoc AI",
    creator="MiniDoc AI")

story = []

# Title style
title_style = ParagraphStyle(
    'CustomTitle',
    fontName='Times New Roman',
    fontSize=24,
    alignment=TA_CENTER,
    spaceAfter=30
)

# Body style
body_style = ParagraphStyle(
    'CustomBody',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_JUSTIFY
)

# Citation styles
cite_style = ParagraphStyle(
    'CiteStyle',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    alignment=TA_LEFT,
    leftIndent=20
)

cite_detail = ParagraphStyle(
    'CiteDetail',
    fontName='Times New Roman',
    fontSize=9,
    leading=12,
    alignment=TA_LEFT,
    leftIndent=40,
    textColor='#666666'
)

# Section header style
section_style = ParagraphStyle(
    'SectionStyle',
    fontName='Times New Roman',
    fontSize=14,
    alignment=TA_LEFT,
    spaceBefore=20,
    spaceAfter=10
)

# Add title
story.append(Paragraph("${safeTitle}", title_style))
story.append(Spacer(1, 20))

# Add content
story.append(Paragraph("${safeContent}", body_style))

# Add page break before citations
story.append(PageBreak())

# Add References section
story.append(Paragraph("References", section_style))
story.append(Spacer(1, 10))

# Add citations
${citationsCode}

doc.build(story)
print("PDF with citations created successfully")
`;

  await writeFile(scriptPath, pythonScript);
  
  try {
    await execAsync(`${PYTHON_PATH} "${scriptPath}"`);
    const buffer = await readFile(outputPath);
    await unlink(scriptPath);
    await unlink(outputPath);
    return buffer;
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

// ============== EXTRACT TABLES FROM PDF ==============
async function extractTables(pdfPath: string): Promise<Array<{
  page: number;
  headers: string[];
  rows: string[][];
}>> {
  await ensureDirs();
  
  const scriptPath = path.join(TEMP_DIR, `tables_${Date.now()}.py`);
  
  const pythonScript = `
import sys
import json
import pdfplumber

pdf_path = "${pdfPath}"

tables_found = []

with pdfplumber.open(pdf_path) as pdf:
    for page_num, page in enumerate(pdf.pages, 1):
        tables = page.extract_tables()
        for table in tables:
            if table and len(table) > 0:
                # Clean the table data
                cleaned_table = []
                for row in table:
                    cleaned_row = [str(cell).strip() if cell else "" for cell in row]
                    cleaned_table.append(cleaned_row)
                
                if cleaned_table:
                    tables_found.append({
                        "page": page_num,
                        "headers": cleaned_table[0] if cleaned_table else [],
                        "rows": cleaned_table[1:] if len(cleaned_table) > 1 else []
                    })

print(json.dumps(tables_found))
`;

  await writeFile(scriptPath, pythonScript);
  
  try {
    const { stdout } = await execAsync(`${PYTHON_PATH} "${scriptPath}"`, { maxBuffer: 50 * 1024 * 1024 });
    await unlink(scriptPath);
    return JSON.parse(stdout);
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

// ============== GET PDF INFO ==============
async function getPdfInfo(pdfPath: string): Promise<{
  title: string;
  author: string;
  subject: string;
  creator: string;
  producer: string;
  pages: number;
  size: { width: number; height: number };
  encrypted: boolean;
}> {
  await ensureDirs();
  
  const scriptPath = path.join(TEMP_DIR, `info_${Date.now()}.py`);
  
  const pythonScript = `
import sys
import json
import fitz  # PyMuPDF

pdf_path = "${pdfPath}"

doc = fitz.open(pdf_path)

result = {
    "title": doc.metadata.get("title", ""),
    "author": doc.metadata.get("author", ""),
    "subject": doc.metadata.get("subject", ""),
    "creator": doc.metadata.get("creator", ""),
    "producer": doc.metadata.get("producer", ""),
    "pages": len(doc),
    "size": {
        "width": doc[0].rect.width if doc.page_count > 0 else 0,
        "height": doc[0].rect.height if doc.page_count > 0 else 0
    },
    "encrypted": doc.is_encrypted
}

doc.close()
print(json.dumps(result))
`;

  await writeFile(scriptPath, pythonScript);
  
  try {
    const { stdout } = await execAsync(`${PYTHON_PATH} "${scriptPath}"`);
    await unlink(scriptPath);
    return JSON.parse(stdout);
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

// ============== MAIN API HANDLER ==============
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'merge': {
        const { pdfPaths } = params;
        if (!pdfPaths || !Array.isArray(pdfPaths) || pdfPaths.length < 2) {
          return NextResponse.json({ error: 'At least 2 PDF paths required for merging' }, { status: 400 });
        }
        
        const outputPath = path.join(OUTPUT_DIR, `merged_${Date.now()}.pdf`);
        const buffer = await mergePdfs(pdfPaths, outputPath);
        
        return NextResponse.json({
          success: true,
          file: buffer.toString('base64'),
          filename: `merged_${Date.now()}.pdf`,
          mimeType: 'application/pdf'
        });
      }
      
      case 'split': {
        const { pdfPath, pageRanges } = params;
        if (!pdfPath || !pageRanges) {
          return NextResponse.json({ error: 'PDF path and page ranges required' }, { status: 400 });
        }
        
        const results = await splitPdf(pdfPath, pageRanges);
        
        return NextResponse.json({
          success: true,
          files: results.map((r, i) => ({
            pages: r.pages,
            file: r.buffer.toString('base64'),
            filename: `split_${i + 1}_${Date.now()}.pdf`
          }))
        });
      }
      
      case 'extractPages': {
        const { pdfPath, pages } = params;
        if (!pdfPath || !pages || !Array.isArray(pages)) {
          return NextResponse.json({ error: 'PDF path and pages array required' }, { status: 400 });
        }
        
        const buffer = await extractPages(pdfPath, pages);
        
        return NextResponse.json({
          success: true,
          file: buffer.toString('base64'),
          filename: `extracted_pages_${Date.now()}.pdf`,
          mimeType: 'application/pdf'
        });
      }
      
      case 'extractText': {
        const { pdfPath } = params;
        if (!pdfPath) {
          return NextResponse.json({ error: 'PDF path required' }, { status: 400 });
        }
        
        const result = await extractTextWithCitations(pdfPath);
        
        return NextResponse.json({
          success: true,
          ...result
        });
      }
      
      case 'extractTables': {
        const { pdfPath } = params;
        if (!pdfPath) {
          return NextResponse.json({ error: 'PDF path required' }, { status: 400 });
        }
        
        const tables = await extractTables(pdfPath);
        
        return NextResponse.json({
          success: true,
          tables
        });
      }
      
      case 'getInfo': {
        const { pdfPath } = params;
        if (!pdfPath) {
          return NextResponse.json({ error: 'PDF path required' }, { status: 400 });
        }
        
        const info = await getPdfInfo(pdfPath);
        
        return NextResponse.json({
          success: true,
          info
        });
      }
      
      case 'createWithCitations': {
        const { title, content, sources } = params;
        if (!title || !content) {
          return NextResponse.json({ error: 'Title and content required' }, { status: 400 });
        }
        
        const buffer = await createPdfWithCitations(title, content, sources || []);
        
        return NextResponse.json({
          success: true,
          file: buffer.toString('base64'),
          filename: `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`,
          mimeType: 'application/pdf'
        });
      }
      
      default:
        return NextResponse.json({ error: 'Unknown action. Use: merge, split, extractPages, extractText, extractTables, getInfo, createWithCitations' }, { status: 400 });
    }
  } catch (error) {
    console.error('PDF API error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const pdfPath = searchParams.get('path');
  
  if (action === 'getInfo' && pdfPath) {
    try {
      const info = await getPdfInfo(pdfPath);
      return NextResponse.json({ success: true, info });
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }
  
  return NextResponse.json({
    actions: [
      { name: 'merge', description: 'Merge multiple PDFs', params: ['pdfPaths (array)'] },
      { name: 'split', description: 'Split PDF into multiple files', params: ['pdfPath', 'pageRanges (array of {start, end})'] },
      { name: 'extractPages', description: 'Extract specific pages', params: ['pdfPath', 'pages (array)'] },
      { name: 'extractText', description: 'Extract text with citations', params: ['pdfPath'] },
      { name: 'extractTables', description: 'Extract tables from PDF', params: ['pdfPath'] },
      { name: 'getInfo', description: 'Get PDF metadata', params: ['pdfPath'] },
      { name: 'createWithCitations', description: 'Create PDF with citations', params: ['title', 'content', 'sources (array)'] }
    ]
  });
}
