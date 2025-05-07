import time
from datetime import datetime
from fastapi import APIRouter, HTTPException, Body
from services.db_service import DatabaseService

router = APIRouter(prefix="/api", tags=["progress"])


@router.post("/save-progress")
async def save_progress(data: dict = Body(...)):
    try:
        user_id = data.get("user_id")
        course_id = data.get("course_id")
        step = data.get("step")
        content = data.get("content")
        title = data.get("title")
        description = data.get("description")
        
        # Generate a course ID if not provided (mantém o comportamento atual)
        if not course_id:
            course_id = f"course_{int(time.time())}"
        
        # Salva o progresso
        DatabaseService.save_progress(user_id, course_id, step, content, title, description)
        
        # Sempre retorna o course_id, mesmo quando foi enviado pelo frontend
        return {"success": True, "message": f"Progress saved for step {step}", "course_id": course_id}
    except Exception as e:
        import traceback
        traceback.print_exc()  # Imprime stack trace completo
        print(f"Error saving progress: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving progress: {str(e)}")
