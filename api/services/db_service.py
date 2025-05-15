import json
import os
import time
from datetime import datetime
import traceback

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
    def get_user_by_id(cls, user_id):
        """Get user by ID"""
        db = cls.read_all()
        if "users" in db and user_id in db["users"]:
            return db["users"][user_id]
        return None

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
    def get_courses_by_professor(cls, professor_id):
        """Get all courses for a specific professor"""
        db = cls.read_all()
        professor_courses = {}

        if "courses" in db:
            for course_id, course_data in db["courses"].items():
                if course_data.get("created_by") == professor_id:
                    professor_courses[course_id] = course_data

        return professor_courses

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
    def update_course(cls, course_id, course_data):
        """Update course data"""
        db = cls.read_all()
        if "courses" in db and str(course_id) in db["courses"]:
            db["courses"][str(course_id)].update(course_data)
            cls.save_all(db)
            return db["courses"][str(course_id)]
        return None

    @classmethod
    def save_progress(
        cls, user_id, course_id, step, content, title=None, description=None
    ):
        """Save progress for a specific step in a course"""
        try:
            print(
                f"DB Service: Saving progress for {user_id}, course {course_id}, step {step}"
            )
            db = cls.read_all()

            # Initialize courses dict if not exists
            if "courses" not in db:
                db["courses"] = {}

            # Create or update course
            now = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

            if course_id not in db["courses"]:
                # Create new course
                course_data = {
                    "title": title or f"Course {course_id}",
                    "description": description
                    or "",  # Garantir que description seja uma string
                    "created_by": user_id,
                    "created_at": now,
                    "steps": {},
                }
                db["courses"][course_id] = course_data
                print(f"Created new course: {course_id}")
            else:
                # Update existing course if title or description provided
                if title:
                    db["courses"][course_id]["title"] = title

                # Garantir que description seja atualizada corretamente
                if description is not None:  # Permitir string vazia
                    db["courses"][course_id]["description"] = description

                print(f"Updated existing course: {course_id}")

            # Update the specific step
            if "steps" not in db["courses"][course_id]:
                db["courses"][course_id]["steps"] = {}

            db["courses"][course_id]["steps"][step] = content
            print(f"Updated step {step} for course {course_id}")

            # Save the updated database
            cls.save_all(db)
            print("Database saved successfully")
            return True
        except Exception as e:
            import traceback

            traceback.print_exc()  # Imprime stack trace completo
            print(f"Error in save_progress: {str(e)}")
            raise e  # Re-raise para propagar o erro

    @classmethod
    def save_user_progress(cls, user_id, course_id, content_id, data):
        """
        Salva o progresso de um usuário em um conteúdo específico
        
        Args:
            user_id: ID do usuário
            course_id: ID do curso
            content_id: ID do item de conteúdo
            data: Dados do progresso (completed, score, lastAccess, etc)
        """
        try:
            db = cls.read_all()
            
            # Inicializa a estrutura de progresso se não existir
            if "progress" not in db:
                db["progress"] = {}
                
            if user_id not in db["progress"]:
                db["progress"][user_id] = {}
                
            if course_id not in db["progress"][user_id]:
                db["progress"][user_id][course_id] = {
                    "lastAccessed": int(time.time()),
                    "items": {},
                }
            else:
                # Atualiza o timestamp de último acesso ao curso
                db["progress"][user_id][course_id]["lastAccessed"] = int(time.time())
                
            # Inicializa a estrutura de itens se não existir
            if "items" not in db["progress"][user_id][course_id]:
                db["progress"][user_id][course_id]["items"] = {}
                
            # Converter content_id para string para garantir consistência como chave
            content_id_str = str(content_id)
            
            # Verificar se content_id já existe para evitar duplicação
            if content_id_str in db["progress"][user_id][course_id]["items"]:
                existing_data = db["progress"][user_id][course_id]["items"][content_id_str]
                # Atualiza os dados existentes com os novos dados
                for key, value in data.items():
                    existing_data[key] = value
                # Se não tiver lastAccess, adiciona
                if "lastAccess" not in existing_data:
                    existing_data["lastAccess"] = int(time.time())
            else:
                # Adiciona os dados como novo progresso com timestamp de acesso atual
                if "lastAccess" not in data:
                    data["lastAccess"] = int(time.time())
                db["progress"][user_id][course_id]["items"][content_id_str] = data
                
            # Salva as alterações no banco de dados
            cls.save_all(db)
            return True
        except Exception as e:
            print(f"Erro ao salvar progresso: {e}")
            return False

    @classmethod
    def get_user_progress(cls, user_id, course_id=None):
        """
        Recupera o progresso do usuário

        Args:
            user_id: ID do usuário
            course_id: ID do curso (opcional, se não fornecido, retorna todo o progresso do usuário)
        """
        db = cls.read_all()

        if "progress" not in db:
            return {} if course_id else {}

        if user_id not in db["progress"]:
            return {} if course_id else {}

        if course_id:
            return db["progress"][user_id].get(course_id, {}).get("items", {})

        return db["progress"][user_id]

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
                    "steps": {},
                }

        # Update the step content
        db["courses"][course_id]["steps"][step] = content

        # Save all data
        cls.save_all(db)

        return {"course_id": course_id, "step": step, "content": content}

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
