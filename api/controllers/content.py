from fastapi import APIRouter, Depends
import json
from services.llm_service import LLMService

router = APIRouter(prefix="/api", tags=["content"])

@router.post("/generate-content")
async def generate_content(
    data: dict, llm_service: LLMService = Depends(lambda: LLMService())
):
    # Process data through the LLM service
    try:
        context = data.get("context", "AI in education")
        print(f"Processing context for content: {context}")
        
        # Get the response from the LLM service
        result = await llm_service.generate_content(context)
        print(f"Raw content response: {result}")
        
        return result
    except Exception as e:
        print(f"Error in generate_content: {type(e).__name__}: {str(e)}")
        # Fallback to example data if there's an error
        return {
            "content_items": [
                {
                    "id": 1,
                    "title": "Introduction to the Topic",
                    "description": "Overview and fundamental concepts",
                    "content": "<p>This is an introductory module that covers the basic principles and concepts.</p>",
                    "learning_objectives": [
                        "Understand the core principles",
                        "Identify key components",
                        "Apply basic concepts to simple scenarios"
                    ],
                    "related_objectives": [
                        "Develop critical thinking skills",
                        "Build foundational knowledge"
                    ]
                },
                {
                    "id": 2,
                    "title": "Advanced Applications",
                    "description": "Practical implementations and case studies",
                    "content": "<p>This module explores real-world applications and detailed case studies.</p>",
                    "learning_objectives": [
                        "Apply concepts to complex scenarios",
                        "Analyze case studies",
                        "Develop implementation strategies"
                    ],
                    "related_objectives": [
                        "Create innovative solutions",
                        "Evaluate effectiveness of implementations"
                    ]
                }
            ]
        }