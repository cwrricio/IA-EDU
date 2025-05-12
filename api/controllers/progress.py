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


@router.post("/user-progress")
async def save_user_progress(data: dict = Body(...)):
    """
    Salva o progresso do usuário em um conteúdo específico
    
    Espera um corpo com:
    - user_id: ID do usuário
    - course_id: ID do curso
    - content_id: ID do conteúdo
    - completed: boolean indicando se o conteúdo foi concluído
    - score: pontuação opcional (para quizzes)
    """
    try:
        user_id = data.get("user_id")
        course_id = data.get("course_id")
        content_id = data.get("content_id")
        
        if not user_id or not course_id or not content_id:
            raise HTTPException(
                status_code=400, 
                detail="user_id, course_id e content_id são obrigatórios"
            )
        
        # Cria um dicionário com os dados de progresso
        progress_data = {
            "lastAccess": int(time.time())
        }
        
        # Adicione campos opcionais se fornecidos
        if "completed" in data:
            progress_data["completed"] = data["completed"]
        
        if "score" in data:
            progress_data["score"] = data["score"]
            
        # Salvar o progresso
        DatabaseService.save_user_progress(user_id, course_id, content_id, progress_data)
        
        return {
            "success": True, 
            "message": "Progresso salvo com sucesso"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar progresso: {str(e)}")


@router.get("/user-progress/{user_id}/{course_id}")
async def get_user_progress(user_id: str, course_id: str):
    """
    Retorna o progresso do usuário em um curso específico
    """
    try:
        progress = DatabaseService.get_user_progress(user_id, course_id)
        return progress
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar progresso: {str(e)}")
