import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

const PYTHON_PATH = '/home/z/.venv/bin/python';
const OUTPUT_DIR = path.join(process.cwd(), 'generated');

interface DocumentRequest {
  type: 'pdf' | 'xlsx' | 'pptx' | 'docx';
  title: string;
  content?: string;
  sections?: Array<{
    heading: string;
    content: string;
  }>;
  data?: Array<Record<string, any>>;
  template?: string;
}

// Ensure output directory exists
async function ensureOutputDir() {
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }
}

// Generate PDF using Python reportlab
async function generatePDF(title: string, sections: Array<{heading: string; content: string}>) {
  await ensureOutputDir();
  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${safeTitle}_${Date.now()}.pdf`;
  const outputPath = path.join(OUTPUT_DIR, filename);
  
  // Build sections Python code
  const sectionsCode = sections.map(s => {
    const safeHeading = s.heading.replace(/"/g, '\\"').replace(/\n/g, ' ');
    const safeContent = s.content.replace(/"/g, '\\"').replace(/\n/g, '<br/>');
    return `
story.append(Paragraph("<b>${safeHeading}</b>", heading_style))
story.append(Paragraph("${safeContent}", body_style))
story.append(Spacer(1, 15))
`;
  }).join('\n');

  const safeTitleEscaped = title.replace(/"/g, '\\"');
  
  const pythonScript = `
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
doc = SimpleDocTemplate("${outputPath}", pagesize=letter,
    title="${safeTitleEscaped}",
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

# Heading style
heading_style = ParagraphStyle(
    'CustomHeading',
    fontName='Times New Roman',
    fontSize=16,
    spaceBefore=20,
    spaceAfter=10
)

# Body style
body_style = ParagraphStyle(
    'CustomBody',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_JUSTIFY
)

# Add title
story.append(Paragraph("${safeTitleEscaped}", title_style))
story.append(Spacer(1, 20))

# Add sections
${sectionsCode}

doc.build(story)
print("PDF created successfully")
`;

  const scriptPath = path.join(OUTPUT_DIR, `pdf_gen_${Date.now()}.py`);
  await writeFile(scriptPath, pythonScript);
  
  try {
    await execAsync(`${PYTHON_PATH} "${scriptPath}"`);
    const pdfBuffer = await readFile(outputPath);
    await unlink(scriptPath);
    await unlink(outputPath);
    return { buffer: pdfBuffer, filename };
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

// Generate XLSX using Python openpyxl
async function generateXLSX(title: string, data: Array<Record<string, any>>) {
  await ensureOutputDir();
  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${safeTitle}_${Date.now()}.xlsx`;
  const outputPath = path.join(OUTPUT_DIR, filename);
  
  const dataJson = JSON.stringify(data || [{ 'Column1': 'No data provided' }]);
  const sheetName = title.substring(0, 31).replace(/"/g, '\\"');
  
  const pythonScript = `
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
import json

# Create workbook
wb = Workbook()
sheet = wb.active
sheet.title = "${sheetName}"

# Data
data = ${dataJson}

if data and len(data) > 0:
    # Headers
    headers = list(data[0].keys())
    for col, header in enumerate(headers, 1):
        cell = sheet.cell(row=1, column=col, value=header)
        cell.font = Font(name='Times New Roman', bold=True, color='FFFFFF')
        cell.fill = PatternFill(start_color='1F4E79', end_color='1F4E79', fill_type='solid')
        cell.alignment = Alignment(horizontal='center')
    
    # Data rows
    for row_idx, row_data in enumerate(data, 2):
        for col, header in enumerate(headers, 1):
            cell = sheet.cell(row=row_idx, column=col, value=row_data.get(header, ''))
            cell.font = Font(name='Times New Roman')
            cell.alignment = Alignment(horizontal='left')
    
    # Adjust column widths
    for col in range(1, len(headers) + 1):
        sheet.column_dimensions[chr(64 + col)].width = 20

wb.save("${outputPath}")
print("XLSX created successfully")
`;

  const scriptPath = path.join(OUTPUT_DIR, `xlsx_gen_${Date.now()}.py`);
  await writeFile(scriptPath, pythonScript);
  
  try {
    await execAsync(`${PYTHON_PATH} "${scriptPath}"`);
    const xlsxBuffer = await readFile(outputPath);
    await unlink(scriptPath);
    await unlink(outputPath);
    return { buffer: xlsxBuffer, filename };
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

// Generate DOCX using python-docx
async function generateDOCX(title: string, sections: Array<{heading: string; content: string}>) {
  await ensureOutputDir();
  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${safeTitle}_${Date.now()}.docx`;
  const outputPath = path.join(OUTPUT_DIR, filename);
  
  const sectionsCode = sections.map(s => {
    const safeHeading = s.heading.replace(/"/g, '\\"').replace(/\n/g, ' ');
    const safeContent = s.content.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return `
doc.add_heading("${safeHeading}", level=1)
doc.add_paragraph("${safeContent}")
`;
  }).join('\n');

  const safeTitleEscaped = title.replace(/"/g, '\\"');
  
  const pythonScript = `
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH

# Create document
doc = Document()

# Title
title = doc.add_heading("${safeTitleEscaped}", 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

# Add sections
${sectionsCode}

doc.save("${outputPath}")
print("DOCX created successfully")
`;

  const scriptPath = path.join(OUTPUT_DIR, `docx_gen_${Date.now()}.py`);
  await writeFile(scriptPath, pythonScript);
  
  try {
    await execAsync(`${PYTHON_PATH} "${scriptPath}"`);
    const docxBuffer = await readFile(outputPath);
    await unlink(scriptPath);
    await unlink(outputPath);
    return { buffer: docxBuffer, filename };
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

// Generate PPTX using python-pptx
async function generatePPTX(title: string, sections: Array<{heading: string; content: string}>) {
  await ensureOutputDir();
  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${safeTitle}_${Date.now()}.pptx`;
  const outputPath = path.join(OUTPUT_DIR, filename);
  
  const slidesCode = sections.map((s, i) => {
    const safeHeading = s.heading.replace(/"/g, '\\"').replace(/\n/g, ' ');
    const safeContent = s.content.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/'/g, "\\'");
    return `
# Slide ${i + 1}
slide_layout = prs.slide_layouts[1]
slide = prs.slides.add_slide(slide_layout)
title_shape = slide.shapes.title
body_shape = slide.placeholders[1]

title_shape.text = "${safeHeading}"
tf = body_shape.text_frame
tf.text = "${safeContent}"
`;
  }).join('\n');

  const safeTitleEscaped = title.replace(/"/g, '\\"');
  
  const pythonScript = `
from pptx import Presentation
from pptx.util import Inches

# Create presentation
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Title slide
title_slide_layout = prs.slide_layouts[0]
title_slide = prs.slides.add_slide(title_slide_layout)
title = title_slide.shapes.title
subtitle = title_slide.placeholders[1]

title.text = "${safeTitleEscaped}"
subtitle.text = "Generated by MiniDoc AI"

# Content slides
${slidesCode}

prs.save("${outputPath}")
print("PPTX created successfully")
`;

  const scriptPath = path.join(OUTPUT_DIR, `pptx_gen_${Date.now()}.py`);
  await writeFile(scriptPath, pythonScript);
  
  try {
    await execAsync(`${PYTHON_PATH} "${scriptPath}"`);
    const pptxBuffer = await readFile(outputPath);
    await unlink(scriptPath);
    await unlink(outputPath);
    return { buffer: pptxBuffer, filename };
  } catch (error) {
    await unlink(scriptPath).catch(() => {});
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: DocumentRequest = await request.json();
    const { type, title, content, sections, data } = body;

    if (!type || !title) {
      return NextResponse.json({ error: 'Type and title are required' }, { status: 400 });
    }

    let result;
    
    switch (type) {
      case 'pdf':
        result = await generatePDF(title, sections || [{ heading: 'Content', content: content || '' }]);
        break;
      case 'xlsx':
        result = await generateXLSX(title, data || [{ 'Column1': 'No data provided' }]);
        break;
      case 'docx':
        result = await generateDOCX(title, sections || [{ heading: 'Content', content: content || '' }]);
        break;
      case 'pptx':
        result = await generatePPTX(title, sections || [{ heading: 'Content', content: content || '' }]);
        break;
      default:
        return NextResponse.json({ error: 'Unsupported document type' }, { status: 400 });
    }

    const base64 = result.buffer.toString('base64');
    
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    };
    
    return NextResponse.json({
      success: true,
      filename: result.filename,
      file: base64,
      mimeType: mimeTypes[type]
    });
  } catch (error) {
    console.error('Document generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate document: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    types: ['pdf', 'xlsx', 'docx', 'pptx'],
    description: 'Generate documents from content',
    example: {
      type: 'pdf',
      title: 'My Document',
      sections: [
        { heading: 'Introduction', content: 'This is the introduction.' },
        { heading: 'Conclusion', content: 'This is the conclusion.' }
      ]
    }
  });
}
