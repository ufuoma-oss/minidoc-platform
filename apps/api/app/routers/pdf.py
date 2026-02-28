"""
MiniDoc - PDF Router
API endpoints for PDF operations.
"""
from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from fastapi.responses import Response
from pydantic import BaseModel, Field
from typing import List, Optional
import httpx
import io

from app.services.pdf_service import pdf_service
from app.core.supabase_client import supabase_client

router = APIRouter(prefix="/api/pdf", tags=["pdf"])


# ==================== Request/Response Models ====================

class ExtractTextRequest(BaseModel):
    document_id: str
    user_id: str = "demo-user"


class ExtractTablesRequest(BaseModel):
    document_id: str
    user_id: str = "demo-user"


class MergePdfsRequest(BaseModel):
    document_ids: List[str]
    user_id: str = "demo-user"
    output_filename: Optional[str] = "merged.pdf"


class SplitPdfRequest(BaseModel):
    document_id: str
    ranges: List[str]  # e.g., ["1-3", "5-7", "10"]
    user_id: str = "demo-user"


class PdfInfoRequest(BaseModel):
    document_id: str
    user_id: str = "demo-user"


# ==================== Helper Functions ====================

async def download_document(document_id: str, user_id: str) -> tuple[bytes, dict]:
    """Download document from Supabase storage."""
    # Get document info
    doc = await supabase_client.get_document(document_id, user_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Download from URL
    doc_url = doc.get("url", "")
    if not doc_url:
        raise HTTPException(status_code=400, detail="Document URL not available")
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.get(doc_url)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to download document")
        
        return response.content, doc


async def save_document(
    user_id: str,
    filename: str,
    content: bytes,
    content_type: str = "application/pdf",
    category: str = "generated"
) -> dict:
    """Save a document to Supabase storage."""
    result = await supabase_client.upload_document(
        user_id=user_id,
        file_name=filename,
        file_content=content,
        content_type=content_type,
        category=category
    )
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail="Failed to save document")
    
    return result["document"]


# ==================== Endpoints ====================

@router.get("")
async def pdf_api_info():
    """Get PDF API information."""
    return {
        "name": "MiniDoc PDF API",
        "version": "1.0.0",
        "features": [
            "Text extraction",
            "Table extraction",
            "PDF merge",
            "PDF split",
            "Image extraction",
            "Page rendering"
        ],
        "endpoints": {
            "POST /api/pdf/extract-text": "Extract text from PDF",
            "POST /api/pdf/extract-tables": "Extract tables from PDF",
            "POST /api/pdf/merge": "Merge multiple PDFs",
            "POST /api/pdf/split": "Split PDF into parts",
            "POST /api/pdf/info": "Get PDF information",
            "POST /api/pdf/extract-images": "Extract images from PDF",
            "GET /api/pdf/render-page/{doc_id}": "Render PDF page as image"
        }
    }


@router.post("/extract-text")
async def extract_text(request: ExtractTextRequest):
    """
    Extract text from a PDF document.
    
    Returns the full text and per-page text.
    """
    # Download document
    pdf_bytes, doc = await download_document(request.document_id, request.user_id)
    
    # Check if PDF
    if not pdf_service.is_pdf(pdf_bytes):
        raise HTTPException(status_code=400, detail="Document is not a PDF")
    
    # Extract text
    result = await pdf_service.extract_text(pdf_bytes)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "Text extraction failed"))
    
    return {
        "success": True,
        "document_id": request.document_id,
        "document_name": doc.get("filename", "unknown"),
        "text": result["text"],
        "pages": result["pages"],
        "page_count": result["page_count"]
    }


@router.post("/extract-tables")
async def extract_tables(request: ExtractTablesRequest):
    """
    Extract tables from a PDF document.
    
    Returns all tables found with their data.
    """
    # Download document
    pdf_bytes, doc = await download_document(request.document_id, request.user_id)
    
    # Check if PDF
    if not pdf_service.is_pdf(pdf_bytes):
        raise HTTPException(status_code=400, detail="Document is not a PDF")
    
    # Extract tables
    result = await pdf_service.extract_tables(pdf_bytes)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "Table extraction failed"))
    
    return {
        "success": True,
        "document_id": request.document_id,
        "document_name": doc.get("filename", "unknown"),
        "tables": result["tables"],
        "table_count": result["table_count"],
        "page_count": result["page_count"]
    }


@router.post("/merge")
async def merge_pdfs(request: MergePdfsRequest):
    """
    Merge multiple PDF documents into one.
    
    Returns the merged document ID and URL.
    """
    if len(request.document_ids) < 2:
        raise HTTPException(status_code=400, detail="At least 2 documents required for merge")
    
    # Download all documents
    pdf_files = []
    filenames = []
    
    for doc_id in request.document_ids:
        try:
            pdf_bytes, doc = await download_document(doc_id, request.user_id)
            if pdf_service.is_pdf(pdf_bytes):
                pdf_files.append(pdf_bytes)
                filenames.append(doc.get("filename", f"document_{doc_id}"))
        except HTTPException:
            continue
    
    if len(pdf_files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 valid PDF documents required")
    
    # Merge PDFs
    result = await pdf_service.merge_pdfs(pdf_files, filenames)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "PDF merge failed"))
    
    # Save merged document
    merged_doc = await save_document(
        user_id=request.user_id,
        filename=request.output_filename,
        content=result["pdf_bytes"],
        content_type="application/pdf",
        category="merged"
    )
    
    return {
        "success": True,
        "merged_document": merged_doc,
        "page_count": result["page_count"],
        "source_documents": result["source_documents"]
    }


@router.post("/split")
async def split_pdf(request: SplitPdfRequest):
    """
    Split a PDF document into multiple parts.
    
    Returns list of split document IDs and URLs.
    """
    if not request.ranges:
        raise HTTPException(status_code=400, detail="Page ranges required")
    
    # Download document
    pdf_bytes, doc = await download_document(request.document_id, request.user_id)
    
    # Check if PDF
    if not pdf_service.is_pdf(pdf_bytes):
        raise HTTPException(status_code=400, detail="Document is not a PDF")
    
    # Split PDF
    result = await pdf_service.split_pdf(pdf_bytes, request.ranges)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "PDF split failed"))
    
    # Save split documents
    split_documents = []
    base_name = doc.get("filename", "document").replace(".pdf", "")
    
    for idx, part in enumerate(result["parts"]):
        filename = f"{base_name}_part{idx + 1}_pages{part['range']}.pdf"
        
        saved_doc = await save_document(
            user_id=request.user_id,
            filename=filename,
            content=part["pdf_bytes"],
            content_type="application/pdf",
            category="split"
        )
        
        split_documents.append({
            **saved_doc,
            "range": part["range"],
            "pages": part["pages"]
        })
    
    return {
        "success": True,
        "source_document_id": request.document_id,
        "source_page_count": result["source_page_count"],
        "split_documents": split_documents,
        "total_parts": result["total_parts"]
    }


@router.post("/info")
async def get_pdf_info(request: PdfInfoRequest):
    """
    Get information about a PDF document.
    
    Returns page count, size, metadata.
    """
    # Download document
    pdf_bytes, doc = await download_document(request.document_id, request.user_id)
    
    # Get info
    result = await pdf_service.get_info(pdf_bytes)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "Failed to get PDF info"))
    
    return {
        "success": True,
        "document_id": request.document_id,
        "document_name": doc.get("filename", "unknown"),
        **result
    }


@router.post("/extract-images")
async def extract_images(request: PdfInfoRequest):
    """
    Extract images from a PDF document.
    
    Returns list of images with their data.
    """
    # Download document
    pdf_bytes, doc = await download_document(request.document_id, request.user_id)
    
    # Check if PDF
    if not pdf_service.is_pdf(pdf_bytes):
        raise HTTPException(status_code=400, detail="Document is not a PDF")
    
    # Extract images
    result = await pdf_service.extract_images(pdf_bytes)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "Image extraction failed"))
    
    # Note: We don't return the actual image bytes in the response
    # Instead, we return metadata and the user can request specific images
    
    images_metadata = [
        {
            "page_number": img["page_number"],
            "image_index": img["image_index"],
            "width": img["width"],
            "height": img["height"],
            "colorspace": img["colorspace"],
            "extension": img["extension"]
        }
        for img in result["images"]
    ]
    
    return {
        "success": True,
        "document_id": request.document_id,
        "document_name": doc.get("filename", "unknown"),
        "images": images_metadata,
        "image_count": result["image_count"]
    }


@router.get("/render-page/{document_id}")
async def render_page(
    document_id: str,
    user_id: str = Query(default="demo-user"),
    page: int = Query(default=1, ge=1),
    dpi: int = Query(default=150, ge=72, le=300)
):
    """
    Render a PDF page as an image.
    
    Returns the page as a PNG image.
    """
    # Download document
    pdf_bytes, doc = await download_document(document_id, user_id)
    
    # Check if PDF
    if not pdf_service.is_pdf(pdf_bytes):
        raise HTTPException(status_code=400, detail="Document is not a PDF")
    
    # Render page
    result = await pdf_service.extract_page_as_image(pdf_bytes, page, dpi)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "Page rendering failed"))
    
    return Response(
        content=result["image_bytes"],
        media_type="image/png",
        headers={
            "X-Page-Number": str(page),
            "X-Width": str(result["width"]),
            "X-Height": str(result["height"])
        }
    )
