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
        response = await llm_service.generate_syllabus(context)

        # Parse the JSON response
        result = json.loads(response)
        return result
    except Exception as e:
        # AI logic to generate syllabus (fallback)
        return {
            "topics": [
                {"id": 1, "title": "Introduction to AI", "depth": 3},
                {"id": 2, "title": "Neural Networks", "depth": 4},
            ]
        }
