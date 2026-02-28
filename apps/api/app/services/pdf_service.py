"""
MiniDoc - PDF Service
PDF operations: extract text, tables, merge, split.
"""
import io
import re
from typing import List, Dict, Any, Optional, Tuple
import fitz  # PyMuPDF
import pdfplumber
from pypdf import PdfReader, PdfWriter


class PDFService:
    """Service for PDF operations."""

    async def extract_text(self, pdf_bytes: bytes) -> Dict[str, Any]:
        """
        Extract text from a PDF file.
        
        Returns:
            Dict with 'text' (full text), 'pages' (list of page texts), 'page_count'
        """
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            pages = []
            full_text = ""
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                page_text = page.get_text()
                pages.append({
                    "page_number": page_num + 1,
                    "text": page_text.strip()
                })
                full_text += page_text + "\n\n"
            
            doc.close()
            
            return {
                "success": True,
                "text": full_text.strip(),
                "pages": pages,
                "page_count": len(pages)
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "text": "",
                "pages": [],
                "page_count": 0
            }

    async def extract_tables(self, pdf_bytes: bytes) -> Dict[str, Any]:
        """
        Extract tables from a PDF file using pdfplumber.
        
        Returns:
            Dict with 'tables' (list of tables with page number and data)
        """
        try:
            tables = []
            
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                for page_num, page in enumerate(pdf.pages):
                    page_tables = page.extract_tables()
                    
                    for table_idx, table in enumerate(page_tables):
                        if table and len(table) > 0:
                            # Clean up table data
                            cleaned_table = []
                            for row in table:
                                cleaned_row = [
                                    cell.strip() if cell else ""
                                    for cell in row
                                ]
                                cleaned_table.append(cleaned_row)
                            
                            tables.append({
                                "page_number": page_num + 1,
                                "table_index": table_idx + 1,
                                "rows": len(cleaned_table),
                                "columns": len(cleaned_table[0]) if cleaned_table else 0,
                                "data": cleaned_table
                            })
            
            return {
                "success": True,
                "tables": tables,
                "table_count": len(tables),
                "page_count": len(pdf.pages) if pdf else 0
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "tables": [],
                "table_count": 0,
                "page_count": 0
            }

    async def merge_pdfs(self, pdf_files: List[bytes], filenames: List[str] = None) -> Dict[str, Any]:
        """
        Merge multiple PDF files into one.
        
        Args:
            pdf_files: List of PDF file bytes
            filenames: Optional list of original filenames for metadata
            
        Returns:
            Dict with 'pdf_bytes' (merged PDF as bytes) and 'page_count'
        """
        try:
            writer = PdfWriter()
            total_pages = 0
            source_info = []
            
            for idx, pdf_bytes in enumerate(pdf_files):
                try:
                    reader = PdfReader(io.BytesIO(pdf_bytes))
                    page_count = len(reader.pages)
                    
                    for page in reader.pages:
                        writer.add_page(page)
                    
                    total_pages += page_count
                    source_info.append({
                        "filename": filenames[idx] if filenames and idx < len(filenames) else f"document_{idx + 1}",
                        "pages": page_count
                    })
                except Exception as e:
                    print(f"[PDF] Error reading PDF {idx}: {e}")
                    continue
            
            # Write to bytes
            output = io.BytesIO()
            writer.write(output)
            output.seek(0)
            
            return {
                "success": True,
                "pdf_bytes": output.read(),
                "page_count": total_pages,
                "source_documents": source_info
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "pdf_bytes": None,
                "page_count": 0
            }

    async def split_pdf(
        self, 
        pdf_bytes: bytes, 
        ranges: List[str]
    ) -> Dict[str, Any]:
        """
        Split a PDF into multiple parts based on page ranges.
        
        Args:
            pdf_bytes: PDF file bytes
            ranges: List of page ranges, e.g., ["1-3", "5-7", "10"]
            
        Returns:
            Dict with 'parts' (list of {pdf_bytes, pages, range})
        """
        try:
            reader = PdfReader(io.BytesIO(pdf_bytes))
            total_pages = len(reader.pages)
            parts = []
            
            for range_str in ranges:
                # Parse range
                if "-" in range_str:
                    start, end = map(int, range_str.split("-"))
                else:
                    start = end = int(range_str)
                
                # Validate range
                start = max(1, start)
                end = min(total_pages, end)
                
                if start > end:
                    continue
                
                # Create new PDF with selected pages
                writer = PdfWriter()
                for page_num in range(start - 1, end):
                    writer.add_page(reader.pages[page_num])
                
                output = io.BytesIO()
                writer.write(output)
                output.seek(0)
                
                parts.append({
                    "range": range_str,
                    "pages": end - start + 1,
                    "pdf_bytes": output.read()
                })
            
            return {
                "success": True,
                "parts": parts,
                "total_parts": len(parts),
                "source_page_count": total_pages
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "parts": [],
                "total_parts": 0
            }

    async def get_info(self, pdf_bytes: bytes) -> Dict[str, Any]:
        """
        Get information about a PDF file.
        
        Returns:
            Dict with page count, size, metadata
        """
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            
            metadata = doc.metadata or {}
            
            info = {
                "success": True,
                "page_count": len(doc),
                "size_bytes": len(pdf_bytes),
                "size_kb": round(len(pdf_bytes) / 1024, 2),
                "metadata": {
                    "title": metadata.get("title", ""),
                    "author": metadata.get("author", ""),
                    "subject": metadata.get("subject", ""),
                    "creator": metadata.get("creator", ""),
                    "producer": metadata.get("producer", ""),
                    "creation_date": metadata.get("creationDate", ""),
                    "modification_date": metadata.get("modDate", ""),
                },
                "is_encrypted": doc.is_encrypted,
                "is_pdf": True
            }
            
            doc.close()
            return info
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "is_pdf": False
            }

    async def extract_images(self, pdf_bytes: bytes) -> Dict[str, Any]:
        """
        Extract images from a PDF file.
        
        Returns:
            Dict with 'images' (list of image data with page number)
        """
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            images = []
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                image_list = page.get_images(full=True)
                
                for img_idx, img in enumerate(image_list):
                    xref = img[0]
                    try:
                        base_image = doc.extract_image(xref)
                        images.append({
                            "page_number": page_num + 1,
                            "image_index": img_idx + 1,
                            "width": base_image["width"],
                            "height": base_image["height"],
                            "colorspace": base_image["colorspace"],
                            "bytes": base_image["image"],
                            "extension": base_image["ext"]
                        })
                    except Exception as e:
                        print(f"[PDF] Error extracting image {img_idx} from page {page_num}: {e}")
                        continue
            
            doc.close()
            
            return {
                "success": True,
                "images": images,
                "image_count": len(images)
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "images": [],
                "image_count": 0
            }

    async def extract_page_as_image(
        self, 
        pdf_bytes: bytes, 
        page_number: int = 1,
        dpi: int = 150
    ) -> Dict[str, Any]:
        """
        Render a PDF page as an image.
        
        Args:
            pdf_bytes: PDF file bytes
            page_number: Page number (1-indexed)
            dpi: Resolution for rendering
            
        Returns:
            Dict with 'image_bytes' (PNG format)
        """
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            
            if page_number < 1 or page_number > len(doc):
                return {
                    "success": False,
                    "error": f"Page {page_number} out of range (1-{len(doc)})"
                }
            
            page = doc[page_number - 1]
            
            # Calculate zoom for desired DPI
            zoom = dpi / 72
            mat = fitz.Matrix(zoom, zoom)
            
            # Render page to image
            pix = page.get_pixmap(matrix=mat)
            img_bytes = pix.tobytes("png")
            
            doc.close()
            
            return {
                "success": True,
                "image_bytes": img_bytes,
                "page_number": page_number,
                "width": pix.width,
                "height": pix.height,
                "format": "png"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def is_pdf(self, file_bytes: bytes) -> bool:
        """Check if bytes represent a PDF file."""
        return file_bytes[:4] == b'%PDF'


# Singleton instance
pdf_service = PDFService()
