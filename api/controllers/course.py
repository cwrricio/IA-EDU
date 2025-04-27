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