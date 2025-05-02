from services.db_service import DatabaseService

class LoginService:
    """Service for handling user login and authentication."""

    @staticmethod
    def authenticate_user(email, password):
        """
        Authenticate a user with the given email and password.
        
        Args:
            email (str): The email address of the user.
            password (str): The password of the user.
        
        Returns:
            dict: A result object containing success status, message, and user data if successful.
        """
        # Fetch all users from the database
        users = DatabaseService.get_all_users()
        
        # First check if the email exists
        email_exists = False
        for user_id, user_data in users.items():
            if user_data.get('email') == email:
                email_exists = True
                # Check if password matches
                if user_data.get('password') == password:
                    # Return user data without the password
                    user_info = user_data.copy()
                    user_info['id'] = user_id
                    return {
                        "success": True,
                        "message": "Login successful",
                        "user": user_info
                    }
                else:
                    # Email exists but password is incorrect
                    return {
                        "success": False,
                        "message": "Senha incorreta",
                        "user": None
                    }
        
        # If we get here, the email doesn't exist
        if not email_exists:
            return {
                "success": False,
                "message": "Não há nenhum usuário cadastrado com esse email",
                "user": None
            }