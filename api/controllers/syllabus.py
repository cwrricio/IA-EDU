from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["syllabus"])

@router.post("/generate-syllabus")
async def generate_syllabus(data: dict):
    # AI logic to generate syllabus
    return {
        "topics": [
            {"id": 1, "title": "Introduction to AI", "depth": 3},
            {"id": 2, "title": "Neural Networks", "depth": 4},
        ]
    }