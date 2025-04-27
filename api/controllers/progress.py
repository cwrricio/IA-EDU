import time
from datetime import datetime
from fastapi import APIRouter, HTTPException, Body
from services.db_service import DatabaseService

router = APIRouter(prefix="/api", tags=["progress"])

@router.post("/save-progress")
async def save_progress(data: dict = Body(...)):
    """Save course progress to the database."""
    try:
        # Extract data
        user_id = data.get("user_id", "1")  # Default to admin if not provided
        course_id = data.get("course_id")
        step = data.get("step")
        content = data.get("content")
        
        if not course_id:
            # Generate a unique course ID if not provided
            course_id = DatabaseService.generate_course_id()
        
        # Create course metadata if this is a new course
        metadata = None
        if step == "objectives":  # First step in the flow
            metadata = {
                "title": data.get("title", "Untitled Course"),
                "created_by": user_id,
                "created_at": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                "steps": {}
            }
        
        # Save the course step using the database service
        result = DatabaseService.save_course_step(course_id, step, content, metadata)
        
        print(f"Progress saved for course {course_id}, step {step}")
        
        return {
            "success": True,
            "message": f"Progress saved for step {step}",
            "course_id": course_id
        }
        
    except Exception as e:
        print(f"Error saving progress: {str(e)}")  # Debug logging
        raise HTTPException(status_code=500, detail=f"Error saving progress: {str(e)}")