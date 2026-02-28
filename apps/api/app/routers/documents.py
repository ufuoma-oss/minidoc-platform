"""
MiniDoc - Documents Router
API endpoints for document generation.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

from app.services.document_service import document_service
from app.core.supabase_client import supabase_client

router = APIRouter(prefix="/api/documents", tags=["documents"])


# ==================== Request/Response Models ====================

class GeneratePdfRequest(BaseModel):
    title: str
    content: str
    template: str = "default"
    metadata: Optional[Dict[str, Any]] = None
    user_id: str = "demo-user"
    filename: Optional[str] = None


class GenerateReportRequest(BaseModel):
    title: str
    sections: List[Dict[str, str]]
    metadata: Optional[Dict[str, Any]] = None
    user_id: str = "demo-user"
    filename: Optional[str] = None


class GenerateSpreadsheetRequest(BaseModel):
    title: str
    data: List[Dict[str, Any]]
    headers: Optional[List[str]] = None
    sheet_name: str = "Sheet1"
    user_id: str = "demo-user"
    filename: Optional[str] = None


class GenerateSpreadsheetTableRequest(BaseModel):
    title: str
    table_data: List[List[str]]
    has_header: bool = True
    user_id: str = "demo-user"
    filename: Optional[str] = None


class GenerateDocxRequest(BaseModel):
    title: str
    content: str
    formatting: Optional[Dict[str, Any]] = None
    user_id: str = "demo-user"
    filename: Optional[str] = None


class GeneratePptxRequest(BaseModel):
    title: str
    slides: List[Dict[str, str]]
    theme: str = "default"
    user_id: str = "demo-user"
    filename: Optional[str] = None


class GeneratePptxOutlineRequest(BaseModel):
    title: str
    outline: str
    user_id: str = "demo-user"
    filename: Optional[str] = None


# ==================== Helper Functions ====================

async def save_document(
    user_id: str,
    filename: str,
    content: bytes,
    content_type: str
) -> dict:
    """Save a document to Supabase storage."""
    result = await supabase_client.upload_document(
        user_id=user_id,
        file_name=filename,
        file_content=content,
        content_type=content_type,
        category="generated"
    )
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail="Failed to save document")
    
    return result["document"]


# ==================== Endpoints ====================

@router.get("")
async def documents_api_info():
    """Get Documents API information."""
    return {
        "name": "MiniDoc Documents API",
        "version": "1.0.0",
        "features": [
            "PDF generation",
            "Excel (XLSX) generation",
            "Word (DOCX) generation",
            "PowerPoint (PPTX) generation"
        ],
        "endpoints": {
            "POST /api/documents/generate/pdf": "Generate PDF document",
            "POST /api/documents/generate/report": "Generate PDF report",
            "POST /api/documents/generate/spreadsheet": "Generate Excel spreadsheet",
            "POST /api/documents/generate/spreadsheet-table": "Generate Excel from table data",
            "POST /api/documents/generate/docx": "Generate Word document",
            "POST /api/documents/generate/pptx": "Generate PowerPoint presentation",
            "POST /api/documents/generate/pptx-outline": "Generate PowerPoint from outline"
        }
    }


@router.post("/generate/pdf")
async def generate_pdf(request: GeneratePdfRequest):
    """
    Generate a PDF document.
    
    Creates a PDF with title and content.
    """
    # Generate PDF
    result = await document_service.generate_pdf(
        title=request.title,
        content=request.content,
        template=request.template,
        metadata=request.metadata
    )
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "PDF generation failed"))
    
    # Generate filename
    filename = request.filename or f"{request.title.replace(' ', '_')}.pdf"
    if not filename.endswith('.pdf'):
        filename += '.pdf'
    
    # Save to storage
    doc = await save_document(
        user_id=request.user_id,
        filename=filename,
        content=result["pdf_bytes"],
        content_type="application/pdf"
    )
    
    return {
        "success": True,
        "document": doc,
        "page_count": result.get("page_count", 1)
    }


@router.post("/generate/report")
async def generate_report(request: GenerateReportRequest):
    """
    Generate a PDF report with sections.
    
    Creates a structured report with table of contents.
    """
    result = await document_service.generate_pdf_report(
        title=request.title,
        sections=request.sections,
        metadata=request.metadata
    )
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "Report generation failed"))
    
    filename = request.filename or f"{request.title.replace(' ', '_')}_report.pdf"
    if not filename.endswith('.pdf'):
        filename += '.pdf'
    
    doc = await save_document(
        user_id=request.user_id,
        filename=filename,
        content=result["pdf_bytes"],
        content_type="application/pdf"
    )
    
    return {
        "success": True,
        "document": doc,
        "section_count": len(request.sections)
    }


@router.post("/generate/spreadsheet")
async def generate_spreadsheet(request: GenerateSpreadsheetRequest):
    """
    Generate an Excel spreadsheet from data.
    
    Creates an XLSX file with headers and data rows.
    """
    if not request.data:
        raise HTTPException(status_code=400, detail="Data is required")
    
    result = await document_service.generate_spreadsheet(
        title=request.title,
        data=request.data,
        headers=request.headers,
        sheet_name=request.sheet_name
    )
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "Spreadsheet generation failed"))
    
    filename = request.filename or f"{request.title.replace(' ', '_')}.xlsx"
    if not filename.endswith('.xlsx'):
        filename += '.xlsx'
    
    doc = await save_document(
        user_id=request.user_id,
        filename=filename,
        content=result["xlsx_bytes"],
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    
    return {
        "success": True,
        "document": doc,
        "row_count": result["row_count"],
        "column_count": result["column_count"]
    }


@router.post("/generate/spreadsheet-table")
async def generate_spreadsheet_table(request: GenerateSpreadsheetTableRequest):
    """
    Generate an Excel spreadsheet from a 2D array.
    
    Creates an XLSX file from table data (list of lists).
    """
    if not request.table_data:
        raise HTTPException(status_code=400, detail="Table data is required")
    
    result = await document_service.generate_spreadsheet_from_table(
        title=request.title,
        table_data=request.table_data,
        has_header=request.has_header
    )
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "Spreadsheet generation failed"))
    
    filename = request.filename or f"{request.title.replace(' ', '_')}.xlsx"
    if not filename.endswith('.xlsx'):
        filename += '.xlsx'
    
    doc = await save_document(
        user_id=request.user_id,
        filename=filename,
        content=result["xlsx_bytes"],
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    
    return {
        "success": True,
        "document": doc,
        "row_count": result["row_count"],
        "column_count": result["column_count"]
    }


@router.post("/generate/docx")
async def generate_docx(request: GenerateDocxRequest):
    """
    Generate a Word document.
    
    Creates a DOCX file with title and content.
    """
    result = await document_service.generate_docx(
        title=request.title,
        content=request.content,
        formatting=request.formatting
    )
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "Word document generation failed"))
    
    filename = request.filename or f"{request.title.replace(' ', '_')}.docx"
    if not filename.endswith('.docx'):
        filename += '.docx'
    
    doc = await save_document(
        user_id=request.user_id,
        filename=filename,
        content=result["docx_bytes"],
        content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    
    return {
        "success": True,
        "document": doc,
        "paragraph_count": result.get("paragraph_count", 0)
    }


@router.post("/generate/pptx")
async def generate_pptx(request: GeneratePptxRequest):
    """
    Generate a PowerPoint presentation.
    
    Creates a PPTX file with title slide and content slides.
    """
    if not request.slides:
        raise HTTPException(status_code=400, detail="Slides are required")
    
    result = await document_service.generate_pptx(
        title=request.title,
        slides=request.slides,
        theme=request.theme
    )
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "PowerPoint generation failed"))
    
    filename = request.filename or f"{request.title.replace(' ', '_')}.pptx"
    if not filename.endswith('.pptx'):
        filename += '.pptx'
    
    doc = await save_document(
        user_id=request.user_id,
        filename=filename,
        content=result["pptx_bytes"],
        content_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )
    
    return {
        "success": True,
        "document": doc,
        "slide_count": result["slide_count"]
    }


@router.post("/generate/pptx-outline")
async def generate_pptx_outline(request: GeneratePptxOutlineRequest):
    """
    Generate a PowerPoint presentation from an outline.
    
    Creates a PPTX file by parsing a text outline.
    """
    result = await document_service.generate_pptx_from_outline(
        title=request.title,
        outline=request.outline
    )
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "PowerPoint generation failed"))
    
    filename = request.filename or f"{request.title.replace(' ', '_')}.pptx"
    if not filename.endswith('.pptx'):
        filename += '.pptx'
    
    doc = await save_document(
        user_id=request.user_id,
        filename=filename,
        content=result["pptx_bytes"],
        content_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )
    
    return {
        "success": True,
        "document": doc,
        "slide_count": result["slide_count"]
    }
