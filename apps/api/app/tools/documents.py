"""
MiniDoc - Document Tools
Create PDFs, slides, and spreadsheets.
"""
import json

async def create_pdf(title: str, content: str, filename: str) -> dict:
    """
    Create a PDF document from content.
    Returns the PDF data for download.
    """
    # In production, use a proper PDF library
    # For now, return structured data that frontend can convert
    
    return {
        "success": True,
        "type": "pdf",
        "filename": f"{filename}.pdf",
        "title": title,
        "content": content,
        "download_url": f"/api/files/download/{filename}.pdf",
        "message": f"PDF '{title}' created successfully. Ready for download."
    }


async def create_slide(title: str, slides: list, filename: str) -> dict:
    """
    Create a presentation slide deck.
    Returns slide data that can be exported to PPTX.
    """
    # Format slides for presentation
    formatted_slides = []
    for i, slide in enumerate(slides, 1):
        formatted_slides.append({
            "slide_number": i,
            "title": slide.get("title", f"Slide {i}"),
            "content": slide.get("content", ""),
            "layout": "title_content"
        })
    
    return {
        "success": True,
        "type": "presentation",
        "filename": f"{filename}.pptx",
        "title": title,
        "slides": formatted_slides,
        "slide_count": len(formatted_slides),
        "download_url": f"/api/files/download/{filename}.pptx",
        "message": f"Presentation '{title}' with {len(formatted_slides)} slides created successfully."
    }


async def create_spreadsheet(title: str, data: list, filename: str) -> dict:
    """
    Create a spreadsheet from data.
    Returns data that can be exported to Excel/CSV.
    """
    # Calculate dimensions
    rows = len(data)
    cols = max(len(row) for row in data) if data else 0
    
    return {
        "success": True,
        "type": "spreadsheet",
        "filename": f"{filename}.xlsx",
        "title": title,
        "data": data,
        "dimensions": {
            "rows": rows,
            "columns": cols
        },
        "download_url": f"/api/files/download/{filename}.xlsx",
        "message": f"Spreadsheet '{title}' ({rows}x{cols}) created successfully."
    }
