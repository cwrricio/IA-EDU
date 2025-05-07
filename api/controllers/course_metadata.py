from fastapi import APIRouter, Depends, HTTPException
from services.llm_service import LLMService

router = APIRouter(prefix="/api", tags=["course_metadata"])

@router.post("/generate-title")
async def generate_title(
    data: dict, llm_service: LLMService = Depends(lambda: LLMService())
):
    try:
        context = data.get("context", "")
        print(f"Generating title from context: {context[:100]}...")
        
        title = await llm_service.generate_title(context)
        print(f"Generated title: {title}")
        
        return {"title": title}
    except Exception as e:
        print(f"Error generating title: {type(e).__name__}: {str(e)}")
        # Fallback title
        return {"title": "Curso Educacional"}

@router.post("/generate-description")
async def generate_description(
    data: dict, llm_service: LLMService = Depends(lambda: LLMService())
):
    try:
        context = data.get("context", "")
        title = data.get("title", "")
        combined_context = f"Title: {title}\n\nContent: {context}"
        print(f"Generating description from context: {combined_context[:100]}...")
        
        description = await llm_service.generate_description(combined_context)
        print(f"Generated description: {description}")
        
        return {"description": description}
    except Exception as e:
        print(f"Error generating description: {type(e).__name__}: {str(e)}")
        # Fallback description
        return {"description": "Curso educacional com material didático e recursos interativos."}