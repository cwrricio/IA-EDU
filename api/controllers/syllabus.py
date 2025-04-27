from fastapi import APIRouter, Depends
import json
from services.llm_service import LLMService

router = APIRouter(prefix="/api", tags=["syllabus"])


@router.post("/generate-syllabus")
async def generate_syllabus(
    data: dict, llm_service: LLMService = Depends(lambda: LLMService())
):
    # Process data through the LLM service
    try:
        context = data.get("context", "AI in education")
        print(f"Processing context for syllabus: {context}")
        
        # The response is already a Python dictionary, no need for additional processing
        result = await llm_service.generate_syllabus(context)
        print(f"Raw syllabus response: {result}")
        
        return result
    except Exception as e:
        print(f"Error in generate_syllabus: {type(e).__name__}: {str(e)}")
        # Fallback to example data if there's an error
        return {
            "topics": [
                {"id": 1, "title": "Introduction to Software Metrics", "depth": 3},
                {"id": 2, "title": "Process Metrics", "depth": 4},
                {"id": 3, "title": "Project Metrics", "depth": 3},
                {"id": 4, "title": "Product Metrics", "depth": 4},
                {"id": 5, "title": "Implementation of Metrics Programs", "depth": 3}
            ]
        }
