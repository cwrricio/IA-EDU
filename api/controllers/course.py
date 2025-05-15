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

@router.post("/update-course-metadata")
async def update_course_metadata(data: dict):
    try:
        course_id = data.get("course_id")
        title = data.get("title")
        description = data.get("description")
        
        if not course_id:
            raise HTTPException(status_code=400, detail="ID do curso é obrigatório")
        
        # Buscar curso no banco de dados
        try:
            course = DatabaseService.get_course(course_id)
            
            if not course:
                raise HTTPException(status_code=404, detail="Curso não encontrado")
            
            # Criar um dicionário com os dados atualizados
            course_data = {}
            
            if isinstance(course, dict):
                course_data = course.copy()
                if title:
                    course_data["title"] = title
                if description:
                    course_data["description"] = description
            else:
                # Se course é um objeto
                course_data = {
                    "id": course_id,
                    "title": title if title else getattr(course, "title", ""),
                    "description": description if description else getattr(course, "description", "")
                }
            
            # Passar tanto o course quanto o course_data
            DatabaseService.update_course(course_id, course_data)
            
            return {"message": "Metadados do curso atualizados com sucesso"}
        except Exception as e:
            print(f"Erro ao atualizar metadados: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Erro ao processar curso: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Exceção não tratada: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.post("/update-course")
async def update_course(data: dict):
    """Update a course with all fields including icon."""
    try:
        # Extrair o ID do curso
        course_id = data.get("id")
        if not course_id:
            raise HTTPException(status_code=400, detail="Course ID is required")
        
        # Ler o banco de dados diretamente
        import json
        import os
        
        db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "database.json")
        
        # Ler o arquivo atual
        with open(db_path, 'r', encoding='utf-8') as f:
            db_data = json.load(f)
        
        # Verificar se o curso existe
        if course_id not in db_data["courses"]:
            raise HTTPException(status_code=404, detail=f"Course {course_id} not found")
        
        # Atualizar os campos recebidos
        for key, value in data.items():
            if key != "id":  # Não copiar o ID para dentro do objeto
                db_data["courses"][course_id][key] = value
        
        # Garantir que temos um ícone
        if "icon" not in db_data["courses"][course_id] or not db_data["courses"][course_id]["icon"]:
            db_data["courses"][course_id]["icon"] = "PiStudent"
        
        # Salvar as alterações
        with open(db_path, 'w', encoding='utf-8') as f:
            json.dump(db_data, f, indent=4, ensure_ascii=False)
        
        return {"message": "Course updated successfully", "course_id": course_id}
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error updating course: {str(e)}")
        print(f"Error details: {error_details}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
