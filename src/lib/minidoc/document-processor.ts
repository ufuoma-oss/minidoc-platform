// Document Processing Service for MiniDoc
// Lightweight alternative to full MCP servers - uses existing Python libraries

import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

const PYTHON_PATH = '/usr/bin/python3.13';
const TEMP_DIR = '/home/z/my-project/temp_docs';

export interface ProcessedDocument {
  text: string;
  metadata: {
    title?: string;
    author?: string;
    pages?: number;
    format: string;
  };
  sections: Array<{
    heading: string;
    content: string;
    page?: number;
  }>;
  tables?: Array<{
    headers: string[];
    rows: string[][];
    page?: number;
  }>;
  images?: Array<{
    page: number;
    description?: string;
  }>;
}

// Ensure temp directory exists
async function ensureTempDir() {
  if (!existsSync(TEMP_DIR)) {
    await mkdir(TEMP_DIR, { recursive: true });
  }
}

// Extract text from PDF using PyMuPDF (fitz)
export async function extractPdfText(filePath: string): Promise<ProcessedDocument> {
  await ensureTempDir();
  
  const scriptPath = path.join(TEMP_DIR, `pdf_extract_${Date.now()}.py`);
  
  const pythonScript = `
import sys
import json

try:
    import fitz  # PyMuPDF
    
    doc = fitz.open("${filePath}")
    
    result = {
        "text": "",
        "metadata": {
            "title": doc.metadata.get("title", ""),
            "author": doc.metadata.get("author", ""),
            "pages": len(doc),
            "format": "pdf"
        },
        "sections": [],
        "tables": [],
        "images": []
    }
    
    for page_num, page in enumerate(doc):
        # Extract text
        text = page.get_text()
        result["text"] += text + "\\n\\n"
        
        # Extract images info
        images = page.get_images()
        for img in images:
            result["images"].append({
                "page": page_num + 1,
                "description": f"Image on page {page_num + 1}"
            })
    
    doc.close()
    print(json.dumps(result))
    
except ImportError:
    # Fallback to pdfplumber
    import pdfplumber
    
    with pdfplumber.open("${filePath}") as pdf:
        result = {
            "text": "",
            "metadata": {
                "title": "",
                "author": "",
                "pages": len(pdf.pages),
                "format": "pdf"
            },
            "sections": [],
            "tables": [],
            "images": []
        }
        
        for page_num, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            result["text"] += text + "\\n\\n"
            
            # Extract tables
            tables = page.extract_tables()
            for table in tables:
                if table:
                    result["tables"].append({
                        "headers": table[0] if table else [],
                        "rows": table[1:] if len(table) > 1 else [],
                        "page": page_num + 1
                    })
        
        print(json.dumps(result))

except Exception as e:
    print(json.dumps({"error": str(e)}))
`;

  await writeFile(scriptPath, pythonScript);
  
  try {
    const { stdout } = await execAsync(`${PYTHON_PATH} "${scriptPath}"`, { maxBuffer: 10 * 1024 * 1024 });
    await unlink(scriptPath);
    
    const result = JSON.parse(stdout);
    if (result.error) {
      throw new Error(result.error);
    }
    
    return result;
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

// Extract text from DOCX using python-docx
export async function extractDocxText(filePath: string): Promise<ProcessedDocument> {
  await ensureTempDir();
  
  const scriptPath = path.join(TEMP_DIR, `docx_extract_${Date.now()}.py`);
  
  const pythonScript = `
import sys
import json
from docx import Document

try:
    doc = Document("${filePath}")
    
    result = {
        "text": "",
        "metadata": {
            "title": doc.core_properties.title or "",
            "author": doc.core_properties.author or "",
            "format": "docx"
        },
        "sections": [],
        "tables": [],
        "images": []
    }
    
    # Extract all text
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
        
        # Check for headings
        if para.style.name.startswith('Heading'):
            result["sections"].append({
                "heading": para.text,
                "content": "",
                "level": int(para.style.name.split()[-1]) if para.style.name.split()[-1].isdigit() else 1
            })
        elif result["sections"]:
            # Append to last section
            result["sections"][-1]["content"] += para.text + "\\n"
    
    result["text"] = "\\n".join(full_text)
    
    # Extract tables
    for table in doc.tables:
        rows = []
        for row in table.rows:
            rows.append([cell.text for cell in row.cells])
        
        if rows:
            result["tables"].append({
                "headers": rows[0],
                "rows": rows[1:],
                "page": None
            })
    
    print(json.dumps(result))

except Exception as e:
    print(json.dumps({"error": str(e)}))
`;

  await writeFile(scriptPath, pythonScript);
  
  try {
    const { stdout } = await execAsync(`${PYTHON_PATH} "${scriptPath}"`, { maxBuffer: 10 * 1024 * 1024 });
    await unlink(scriptPath);
    
    const result = JSON.parse(stdout);
    if (result.error) {
      throw new Error(result.error);
    }
    
    return result;
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

// Extract text from PPTX using python-pptx
export async function extractPptxText(filePath: string): Promise<ProcessedDocument> {
  await ensureTempDir();
  
  const scriptPath = path.join(TEMP_DIR, `pptx_extract_${Date.now()}.py`);
  
  const pythonScript = `
import sys
import json
from pptx import Presentation

try:
    prs = Presentation("${filePath}")
    
    result = {
        "text": "",
        "metadata": {
            "title": "",
            "author": "",
            "pages": len(prs.slides),
            "format": "pptx"
        },
        "sections": [],
        "tables": [],
        "images": []
    }
    
    all_text = []
    
    for slide_num, slide in enumerate(prs.slides, 1):
        slide_text = []
        slide_title = ""
        
        for shape in slide.shapes:
            if hasattr(shape, "text"):
                text = shape.text.strip()
                if text:
                    slide_text.append(text)
                    
                    # Check for title
                    if shape == slide.shapes.title:
                        slide_title = text
            
            # Check for tables
            if shape.has_table:
                table = shape.table
                rows = []
                for row in table.rows:
                    rows.append([cell.text for cell in row.cells])
                
                if rows:
                    result["tables"].append({
                        "headers": rows[0],
                        "rows": rows[1:],
                        "page": slide_num
                    })
        
        slide_content = "\\n".join(slide_text)
        all_text.append(f"Slide {slide_num}:\\n{slide_content}")
        
        if slide_title:
            result["sections"].append({
                "heading": slide_title,
                "content": slide_content,
                "page": slide_num
            })
    
    result["text"] = "\\n\\n".join(all_text)
    print(json.dumps(result))

except Exception as e:
    print(json.dumps({"error": str(e)}))
`;

  await writeFile(scriptPath, pythonScript);
  
  try {
    const { stdout } = await execAsync(`${PYTHON_PATH} "${scriptPath}"`, { maxBuffer: 10 * 1024 * 1024 });
    await unlink(scriptPath);
    
    const result = JSON.parse(stdout);
    if (result.error) {
      throw new Error(result.error);
    }
    
    return result;
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

// Extract text from XLSX using openpyxl
export async function extractXlsxText(filePath: string): Promise<ProcessedDocument> {
  await ensureTempDir();
  
  const scriptPath = path.join(TEMP_DIR, `xlsx_extract_${Date.now()}.py`);
  
  const pythonScript = `
import sys
import json
from openpyxl import load_workbook

try:
    wb = load_workbook("${filePath}", data_only=True)
    
    result = {
        "text": "",
        "metadata": {
            "title": "",
            "author": "",
            "pages": len(wb.sheetnames),
            "format": "xlsx"
        },
        "sections": [],
        "tables": [],
        "images": []
    }
    
    all_text = []
    
    for sheet_name in wb.sheetnames:
        sheet = wb[sheet_name]
        sheet_text = []
        
        # Add sheet name as section
        result["sections"].append({
            "heading": f"Sheet: {sheet_name}",
            "content": ""
        })
        
        rows = []
        for row in sheet.iter_rows(values_only=True):
            row_data = [str(cell) if cell is not None else "" for cell in row]
            if any(row_data):  # Skip empty rows
                rows.append(row_data)
                sheet_text.append(" | ".join(row_data))
        
        if rows:
            result["tables"].append({
                "headers": rows[0] if rows else [],
                "rows": rows[1:] if len(rows) > 1 else []
            })
        
        if result["sections"]:
            result["sections"][-1]["content"] = "\\n".join(sheet_text)
        
        all_text.append(f"Sheet: {sheet_name}\\n" + "\\n".join(sheet_text))
    
    result["text"] = "\\n\\n".join(all_text)
    print(json.dumps(result))

except Exception as e:
    print(json.dumps({"error": str(e)}))
`;

  await writeFile(scriptPath, pythonScript);
  
  try {
    const { stdout } = await execAsync(`${PYTHON_PATH} "${scriptPath}"`, { maxBuffer: 10 * 1024 * 1024 });
    await unlink(scriptPath);
    
    const result = JSON.parse(stdout);
    if (result.error) {
      throw new Error(result.error);
    }
    
    return result;
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

// Main document processor - auto-detects format
export async function processDocument(filePath: string): Promise<ProcessedDocument> {
  const ext = path.extname(filePath).toLowerCase();
  
  switch (ext) {
    case '.pdf':
      return extractPdfText(filePath);
    case '.docx':
    case '.doc':
      return extractDocxText(filePath);
    case '.pptx':
    case '.ppt':
      return extractPptxText(filePath);
    case '.xlsx':
    case '.xls':
      return extractXlsxText(filePath);
    default:
      throw new Error(`Unsupported file format: ${ext}`);
  }
}

// Create text chunks for RAG
export function createChunks(doc: ProcessedDocument, chunkSize: number = 500): Array<{
  text: string;
  metadata: {
    source: string;
    page?: number;
    section?: string;
  };
}> {
  const chunks: Array<{
    text: string;
    metadata: {
      source: string;
      page?: number;
      section?: string;
    };
  }> = [];
  
  // Split by sections if available
  if (doc.sections && doc.sections.length > 0) {
    for (const section of doc.sections) {
      if (section.content.length > chunkSize) {
        // Split large sections into smaller chunks
        const words = section.content.split(' ');
        let currentChunk = '';
        
        for (const word of words) {
          if ((currentChunk + ' ' + word).length > chunkSize) {
            chunks.push({
              text: currentChunk.trim(),
              metadata: {
                source: doc.metadata.title || 'Document',
                page: section.page,
                section: section.heading
              }
            });
            currentChunk = word;
          } else {
            currentChunk += ' ' + word;
          }
        }
        
        if (currentChunk.trim()) {
          chunks.push({
            text: currentChunk.trim(),
            metadata: {
              source: doc.metadata.title || 'Document',
              page: section.page,
              section: section.heading
            }
          });
        }
      } else {
        chunks.push({
          text: section.content,
          metadata: {
            source: doc.metadata.title || 'Document',
            page: section.page,
            section: section.heading
          }
        });
      }
    }
  } else {
    // Split entire text into chunks
    const words = doc.text.split(' ');
    let currentChunk = '';
    
    for (const word of words) {
      if ((currentChunk + ' ' + word).length > chunkSize) {
        chunks.push({
          text: currentChunk.trim(),
          metadata: {
            source: doc.metadata.title || 'Document'
          }
        });
        currentChunk = word;
      } else {
        currentChunk += ' ' + word;
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push({
        text: currentChunk.trim(),
        metadata: {
          source: doc.metadata.title || 'Document'
        }
      });
    }
  }
  
  return chunks;
}
