"""
MiniDoc - VLM Router
Vision Language Model endpoints for image analysis.
"""
from fastapi import APIRouter, UploadFile, File, Form, Query, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import base64
import httpx
import os

router = APIRouter(prefix="/api/vlm", tags=["vlm"])


@router.post("/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    prompt: str = Form(default="Describe this image in detail."),
    user_id: str = Form(default="demo-user")
):
    """
    Analyze an image using Vision Language Model.
    Supports JPEG, PNG, WebP, and GIF images.
    """
    # Read image
    image_data = await file.read()
    content_type = file.content_type or "image/jpeg"
    
    # Validate image type
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Check file size (max 10MB)
    if len(image_data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 10MB)")
    
    # Encode to base64
    image_base64 = base64.b64encode(image_data).decode("utf-8")
    
    # Try Z.AI SDK first
    zai_api_key = os.getenv("ZAI_API_KEY")
    if zai_api_key:
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    "https://api.z.ai/internal/vision/analyze",
                    headers={
                        "Authorization": f"Bearer {zai_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "image": f"data:{content_type};base64,{image_base64}",
                        "prompt": prompt
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "success": True,
                        "analysis": result.get("analysis", result.get("content", "")),
                        "model": "z.ai-vlm",
                        "prompt": prompt
                    }
        except Exception as e:
            print(f"[VLM] Z.AI error: {e}")
    
    # Try NVIDIA NIM with vision model
    nvidia_api_key = os.getenv("NVIDIA_API_KEY")
    if nvidia_api_key:
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    "https://integrate.api.nvidia.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {nvidia_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "microsoft/phi-3-vision-128k-instruct",
                        "messages": [
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": prompt
                                    },
                                    {
                                        "type": "image_url",
                                        "image_url": {
                                            "url": f"data:{content_type};base64,{image_base64}"
                                        }
                                    }
                                ]
                            }
                        ],
                        "max_tokens": 1024
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                    return {
                        "success": True,
                        "analysis": content,
                        "model": "phi-3-vision",
                        "prompt": prompt
                    }
                else:
                    print(f"[VLM] NVIDIA error: {response.status_code}")
        except Exception as e:
            print(f"[VLM] NVIDIA error: {e}")
    
    # Fallback response
    return {
        "success": False,
        "analysis": "Image analysis is not available. Please configure ZAI_API_KEY or NVIDIA_API_KEY.",
        "model": None,
        "prompt": prompt,
        "error": "No VLM API configured"
    }


@router.post("/ocr")
async def extract_text(
    file: UploadFile = File(...),
    user_id: str = Form(default="demo-user")
):
    """
    Extract text from an image using OCR.
    """
    return await analyze_image(
        file=file,
        prompt="Extract all text from this image. Return only the extracted text, nothing else.",
        user_id=user_id
    )


@router.post("/describe")
async def describe_image(
    file: UploadFile = File(...),
    detail_level: str = Form(default="normal"),
    user_id: str = Form(default="demo-user")
):
    """
    Generate a detailed description of an image.
    """
    prompts = {
        "brief": "Describe this image in one sentence.",
        "normal": "Describe this image in detail. Include main subjects, colors, composition, and any text visible.",
        "detailed": "Provide a comprehensive analysis of this image. Describe: 1) Main subjects and objects, 2) Colors and lighting, 3) Composition and perspective, 4) Any visible text or symbols, 5) Overall mood and style, 6) Any notable details or interesting elements."
    }
    
    prompt = prompts.get(detail_level, prompts["normal"])
    return await analyze_image(file=file, prompt=prompt, user_id=user_id)


@router.post("/chart")
async def analyze_chart(
    file: UploadFile = File(...),
    user_id: str = Form(default="demo-user")
):
    """
    Analyze a chart, graph, or diagram image.
    """
    prompt = """Analyze this chart or graph. Provide:
1. Type of chart (bar, line, pie, etc.)
2. Title and axis labels if visible
3. Key data points and trends
4. Any notable patterns or insights
5. Summary of what the data shows"""
    
    return await analyze_image(file=file, prompt=prompt, user_id=user_id)
