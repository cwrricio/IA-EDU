from fastapi import APIRouter, HTTPException, Body
from services.login_service import LoginService

router = APIRouter(prefix="/api", tags=["auth"])

@router.post("/login")
async def login(data: dict = Body(...)):
    """Login with email and password."""
    try:
        email = data.get("email")
        password = data.get("password")
        
        print(f"Login attempt: {email}")  # Add logging for debugging
        
        if not email or not password:
            raise HTTPException(status_code=400, detail="Email and password required")
            
        result = LoginService.authenticate_user(email, password)
        
        if result["success"]:
            print(f"Login successful for: {email}")
            return {
                "success": True,
                "user": result["user"]
            }
        else:
            print(f"Login failed for: {email} - {result['message']}")
            return {
                "success": False,
                "message": result["message"]
            }
            
    except Exception as e:
        print(f"Error in login endpoint: {str(e)}")
        return {
            "success": False,
            "message": f"Server error: {str(e)}"
        }