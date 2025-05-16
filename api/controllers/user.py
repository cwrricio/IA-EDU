# Create a new file in api/controllers/user.py
from fastapi import APIRouter, HTTPException
from services.db_service import DatabaseService

router = APIRouter(prefix="/api", tags=["users"])

@router.get("/users/{user_id}")
async def get_user_by_id(user_id: str):
    """Get user information by ID."""
    try:
        user = DatabaseService.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Remove sensitive information
        if "password" in user:
            del user["password"]
            
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users")
async def get_all_users():
    """Obter lista de todos os usuários"""
    try:
        db = DatabaseService.read_all()
        users = db.get("users", {})
        
        # Formatar dados para retornar apenas o necessário
        user_list = []
        for user_id, user_data in users.items():
            if user_data.get("role") == "student":  # Filtrar apenas estudantes para este caso
                user_list.append({
                    "id": user_id,
                    "username": user_data.get("username", "Estudante"),
                    "email": user_data.get("email", ""),
                    "role": user_data.get("role", "student")
                })
        
        return {"users": user_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))