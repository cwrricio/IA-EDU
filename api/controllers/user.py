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