import json
import os
import time
from datetime import datetime

# Use absolute path to ensure consistency
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATABASE_PATH = os.path.join(BASE_DIR, "database.json")

class DatabaseService:
    """
    Serviço de banco de dados que abstrai operações de armazenamento.
    Atualmente usa um arquivo JSON, mas pode ser facilmente modificado para usar um SGBD no futuro.
    """
    
    @classmethod
    def read_all(cls):
        """Read all data from the database"""
        try:
            with open(DATABASE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            # Return basic structure if file doesn't exist or is invalid
            return {"users": {}, "courses": {}}
    
    @classmethod
    def save_all(cls, data):
        """Write all data to the database"""
        with open(DATABASE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        return True
    
    @classmethod
    def get_user(cls, user_id):
        """Get a user by ID"""
        db = cls.read_all()
        return db.get("users", {}).get(str(user_id))
    
    @classmethod
    def get_all_users(cls):
        """Get all users"""
        db = cls.read_all()
        return db.get("users", {})
    
    @classmethod
    def save_user(cls, user_id, user_data):
        """Save or update user data"""
        db = cls.read_all()
        if "users" not in db:
            db["users"] = {}
        
        db["users"][str(user_id)] = user_data
        cls.save_all(db)
        return user_data
    
    @classmethod
    def get_course(cls, course_id):
        """Get a course by ID"""
        db = cls.read_all()
        return db.get("courses", {}).get(str(course_id))
    
    @classmethod
    def get_all_courses(cls):
        """Get all courses"""
        db = cls.read_all()
        return db.get("courses", {})
    
    @classmethod
    def save_course(cls, course_id, course_data):
        """Save or update course data"""
        db = cls.read_all()
        if "courses" not in db:
            db["courses"] = {}
        
        db["courses"][str(course_id)] = course_data
        cls.save_all(db)
        return course_data
    
    @classmethod
    def save_course_step(cls, course_id, step, content, metadata=None):
        """Save a course step's content"""
        db = cls.read_all()
        
        # Ensure courses key exists
        if "courses" not in db:
            db["courses"] = {}
        
        # Create course if it doesn't exist
        if course_id not in db["courses"]:
            # Use metadata if provided, otherwise create default
            if metadata:
                course = metadata
                course["steps"] = {}
                db["courses"][course_id] = course
            else:
                db["courses"][course_id] = {
                    "title": "Untitled Course",
                    "created_by": "1",
                    "created_at": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                    "steps": {}
                }
        
        # Update the step content
        db["courses"][course_id]["steps"][step] = content
        
        # Save all data
        cls.save_all(db)
        
        return {
            "course_id": course_id,
            "step": step,
            "content": content
        }
    
    @classmethod
    def delete_course(cls, course_id):
        """Delete a course by ID"""
        db = cls.read_all()
        if "courses" in db and course_id in db["courses"]:
            del db["courses"][course_id]
            cls.save_all(db)
            return True
        return False
    
    @classmethod
    def generate_course_id(cls):
        """Generate a unique course ID"""
        return f"course_{int(time.time())}"