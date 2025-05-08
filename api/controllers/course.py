# api/controllers/courses.py
from fastapi import APIRouter, HTTPException, Depends
from services.db_service import DatabaseService

router = APIRouter(prefix="/api", tags=["courses"])


@router.get("/courses")
async def get_all_courses():
    """Get all courses."""
    try:
        courses = DatabaseService.get_all_courses()
        return {"courses": courses}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/courses/professor/{professor_id}")
async def get_courses_by_professor(professor_id: str):
    """Get all courses for a specific professor."""
    try:
        courses = DatabaseService.get_courses_by_professor(professor_id)
        return {"courses": courses}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/courses/{course_id}")
async def get_course(course_id: str):
    """Get a specific course by ID."""
    try:
        course = DatabaseService.get_course(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Certifique-se de que o endpoint de progresso do curso esteja salvando o conteúdo completo

@router.post("/courses/progress")
async def save_course_progress(data: dict):
    # Extract data from request
    user_id = data.get("user_id")
    course_id = data.get("course_id")
    step = data.get("step")
    content = data.get("content")
    title = data.get("title", "")
    description = data.get("description", "")
    
    # Use service to save content
    result = await DatabaseService.save_course_progress(
        user_id, course_id, step, content, title, description
    )
    
    return result


@router.delete("/courses/{course_id}")
async def delete_course(course_id: str):
    """Delete a course by ID."""
    try:
        result = DatabaseService.delete_course(course_id)
        if not result:
            raise HTTPException(status_code=404, detail="Course not found")
        return {"success": True, "message": f"Course {course_id} deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
