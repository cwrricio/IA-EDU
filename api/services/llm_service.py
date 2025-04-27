import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file


class LLMService:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")

        self.client = Groq(api_key=api_key)
        self.model = "llama-3.3-70b-versatile"  # editável

    async def generate_objectives(self, context):
        """Gere um conjunto abrangente de objetivos de aprendizagem com base no contexto educacional fornecido."""
        prompt = f"""
        Baseado nas seguintes informações educacionais, gere um conjunto abrangente de objetivos de aprendizagem.
        Inclua um objetivo geral e de 3 a 5 objetivos específicos.
        
        Contexto: {context}
        
        Formate a resposta como um objeto JSON válido com a seguinte estrutura:
        {{
            "general": "O objetivo geral do curso",
            "specific": [
                {{"id": "1", "text": "Primeiro objetivo específico"}},
                {{"id": "2", "text": "Segundo objetivo específico"}},
                {{"id": "3", "text": "Terceiro objetivo específico"}},
            ]
        }}
        
        IMPORTANTE: Certifique-se de que o JSON esteja formatado corretamente, com todas as chaves e colchetes balanceados.
        Cada objeto no array 'specific' DEVE ter uma chave de fechamento.
        NÃO use marcadores de bloco de código (```) em sua resposta.
        """

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an educational AI assistant that helps create well-structured learning objectives. You output properly formatted JSON.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=1000,
        )

        content = response.choices[0].message.content
        return self._clean_and_validate_json(content)

    async def generate_syllabus(self, context):
        """Gere um plano de curso com base no contexto educacional fornecido."""
        prompt = f"""
        Baseado nas seguintes informações educacionais, gere um plano de curso abrangente com tópicos relevantes.
        
        Contexto: {context}
        
        Formate a resposta como um objeto JSON válido com a seguinte estrutura:
        {{
            "topics": [
                {{"id": 1, "title": "Título do Tópico", "depth": 3}},
                {{"id": 2, "title": "Outro tópico", "depth": 4}},
                ...
            ]
        }}
        Onde 'profundidade' é um valor de 1 a 5 indicando a profundidade recomendada de cobertura.
        
        IMPORTANTE: Certifique-se de que o JSON esteja formatado corretamente, com todas as chaves e colchetes balanceados.
        """

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an educational AI assistant that helps create well-structured course syllabi. You output properly formatted JSON.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=1000,
        )

        content = response.choices[0].message.content
        return self._clean_and_validate_json(content)

    async def generate_content(self, context):
        """Generate detailed content based on the educational context provided."""
        prompt = f"""
        Based on the following educational context, generate detailed content items for a course.
        
        Context: {context}
        
        Format the response as a valid JSON object with the following structure:
        {{
            "content_items": [
                {{
                    "id": 1,
                    "title": "Title of Content Item",
                    "description": "Brief description of this content item",
                    "content": "<p>Detailed HTML content with important points</p><ul><li>Key point 1</li><li>Key point 2</li></ul>",
                    "learning_objectives": [
                        "First learning objective for this content",
                        "Second learning objective for this content"
                    ],
                    "related_objectives": [
                        "Related general course objective 1",
                        "Related general course objective 2"
                    ]
                }},
                ...more items...
            ]
        }}
        
        IMPORTANT: Ensure the JSON is properly formatted with balanced brackets and quotes.
        Generate 3-5 content items that cover the most important aspects of the topic.
        Each content item should have meaningful HTML content and relevant learning objectives.
        """

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an educational AI assistant that helps create well-structured course content. You output properly formatted JSON.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=2000,
        )

        content = response.choices[0].message.content
        return self._clean_and_validate_json(content)

    def _clean_and_validate_json(self, content):
        """Clean and validate JSON from LLM response"""
        # Remove code block markers if present
        cleaned_content = content.strip()
        if cleaned_content.startswith("```"):
            parts = cleaned_content.split("```")
            if len(parts) >= 3:
                # Extract the middle part (actual JSON)
                cleaned_content = parts[1]
                # Remove language identifier if present
                if cleaned_content.startswith("json"):
                    cleaned_content = cleaned_content[4:].strip()
                else:
                    cleaned_content = cleaned_content.strip()

        # Fix common JSON structure errors
        try:
            # Try parsing directly first
            return json.loads(cleaned_content)
        except json.JSONDecodeError:
            # Fix missing closing braces in array items
            fixed_content = re.sub(
                r'("text": "[^"]+?")(\s*\])', r"\1}\2", cleaned_content
            )

            # Fix extra closing braces at the end
            bracket_count = 0
            brace_count = 0
            for char in fixed_content:
                if char == "{":
                    brace_count += 1
                elif char == "}":
                    brace_count -= 1
                elif char == "[":
                    bracket_count += 1
                elif char == "]":
                    bracket_count -= 1

            # Add missing closing braces/brackets or remove extras
            if brace_count > 0:
                fixed_content += "}" * brace_count
            elif brace_count < 0:
                fixed_content = fixed_content.rsplit("}", -brace_count)[0]

            if bracket_count > 0:
                fixed_content += "]" * bracket_count
            elif bracket_count < 0:
                fixed_content = fixed_content.rsplit("]", -bracket_count)[0]

            return json.loads(fixed_content)

    async def process_document(self, document_content):
        """Extraia as informações-chave de um documento educacional."""
        prompt = f"""
        Por favor, analise este documento educacional e extraia informações-chave que possam ser úteis para o planejamento de cursos.
        
        Conteúdo do documento: {document_content}
        
        Identifique os principais tópicos, objetivos de aprendizagem e abordagens de ensino recomendadas.
        """

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an educational AI assistant that specializes in analyzing educational documents.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.5,
            max_tokens=1500,
        )

        # Extract and return the generated content
        return response.choices[0].message.content
