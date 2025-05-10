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

    async def generate_title(self, context):
        """Generate a concise and descriptive course title based on the document content."""
        prompt = f"""
        Based on the following educational document content, generate a concise, professional, and descriptive course title in Portuguese.
        Keep it under 60 characters and make it attractive and representative of the subject matter.
        
        Document content: {context}
        
        Return ONLY the title text, with no quotes, explanations, or additional formatting.
        """
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an educational content expert skilled at creating concise and descriptive course titles in Portuguese."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=60,
        )
        
        # Extract just the title text
        title = response.choices[0].message.content.strip()
        # Remove quotes if present
        title = title.strip('"\'')
        
        return title
    
    async def generate_description(self, context):
        """Generate a brief course description based on the document content."""
        prompt = f"""
        Based on the following educational document content, generate a brief and enticing course description in Portuguese.
        Keep it under 150 characters and make it informative about what the learner will gain from the course.
        
        Document content: {context}
        
        Return ONLY the description text, with no quotes, explanations, or additional formatting.
        """
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an educational content expert skilled at creating compelling course descriptions in Portuguese."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150,
        )
        
        # Extract just the description text
        description = response.choices[0].message.content.strip()
        # Remove quotes if present
        description = description.strip('"\'')
        
        return description

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
                {{"id": 2", "title": "Outro tópico", "depth": 4}},
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

    @classmethod
    def generate_detailed_content(cls, title, description):
        """Generate detailed content for a specific content item."""
        try:
            # Aqui você usaria o modelo LLM para gerar conteúdo detalhado
            # Por simplicidade, estou retornando dados mockados
            content = f"Conteúdo detalhado para {title}. {description} Este tópico aborda conceitos fundamentais e aplicações práticas."
            
            learning_objectives = [
                f"Compreender os conceitos fundamentais de {title}",
                f"Aplicar conhecimentos de {title} em situações práticas",
                f"Analisar e avaliar diferentes abordagens para {title}"
            ]
            
            related_objectives = [
                f"Relacionar {title} com outros tópicos do curso",
                f"Desenvolver habilidades práticas em {title}"
            ]
            
            return {
                "content": content,
                "learning_objectives": learning_objectives,
                "related_objectives": related_objectives
            }
        except Exception as e:
            print(f"Error generating detailed content: {str(e)}")
            # Retornar dados vazios em caso de erro
            return {
                "content": "",
                "learning_objectives": [],
                "related_objectives": []
            }

    async def generate_slides(self, title, description, content):
        """Generate educational slides based on content."""
        prompt = f"""
        Considerando o conteúdo:
        
        Título: {title}
        Descrição: {description}
        Conteúdo completo: {content}
        
        Gere um conjunto de 10 slides a partir deste conteúdo, sendo que:
        
        Slide 1: Deve apresentar uma situação problema 
        Slide 2: Deve apresentar os objetivos específicos associados começando com "Ao final desta aula, você deverá ser capaz de...".
        Slide 3: Gere um quiz de avaliação diagnóstica com 5 questões sobre o conteúdo. Ele deve ser de múltipla escolha, com 4 alternativas e deve indicar a opção correta.
        Slides 4 ao 8: Contém o conteúdo na íntegra para o usuário. Esse conteúdo pode ser apresentado em uma das seguintes estruturas: 
          - Título, subtítulo e parágrafo curto (apropriado para um slide) OU 
          - Título e tópicos pontuais (ao menos uma frase por tópico). 
        Os slides devem estar auto-contidos e ter um roteiro de início, meio e fim.
        Slide 9: Deve apresentar um resumo do conteúdo estudado.
        Slide 10: Um quiz avaliativo com 10 questões sobre o conteúdo estudado. Ele deve ser de múltipla escolha, com 4 alternativas e deve indicar a opção correta.
        
        RESPONDA APENAS COM O JSON PURO, sem comentários ou textos adicionais.
        
        {{
            "slides": [
                {{
                    "tipo": "problema", 
                    "titulo": "Título do Slide", 
                    "conteudo": "Texto descrevendo uma situação problema"
                }},
                {{
                    "tipo": "objetivos", 
                    "titulo": "Objetivos de Aprendizagem", 
                    "objetivos": ["Objetivo 1", "Objetivo 2", "..."]
                }},
                {{
                    "tipo": "quiz_diagnostico",
                    "titulo": "Avaliação Diagnóstica",
                    "perguntas": [
                        {{
                            "pergunta": "Texto da pergunta 1?",
                            "alternativas": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
                            "resposta": 2
                        }},
                        {{
                            "pergunta": "Texto da pergunta 2?",
                            "alternativas": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
                            "resposta": 0
                        }}
                    ]
                }}
            ]
        }}
        """

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an educational AI assistant that creates well-structured course slides based on content. You output ONLY properly formatted JSON without any text before or after it.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=4000,  # Aumentar o limite de tokens para resposta completa
            response_format={"type": "json_object"}  # Forçar resposta em formato JSON (para modelos que suportam)
        )

        content = response.choices[0].message.content
        return self._clean_and_validate_json(content)

    def _clean_and_validate_json(self, content):
        """Clean and validate JSON from LLM response"""
        import re  # Adicionar importação local para garantir acesso
        
        if not content or not content.strip():
            print("Conteúdo vazio recebido do LLM")
            return {"slides": []}
            
        try:
            # Primeira tentativa: tentar carregar diretamente
            return json.loads(content)
        except json.JSONDecodeError as e:
            print(f"JSON inicial inválido, tentando corrigir: {str(e)}")
            
            # Remover marcadores de código de LLMs
            cleaned_content = re.sub(r'^```json\s+|\s+```$', '', content.strip())
            cleaned_content = re.sub(r'^```\s+|\s+```$', '', cleaned_content.strip())
            
            try:
                # Segunda tentativa com conteúdo limpo
                return json.loads(cleaned_content)
            except json.JSONDecodeError as e:
                print(f"Ainda inválido após limpeza básica: {str(e)}")
                
                # Corrigir escapes inválidos
                fixed_content = ""
                i = 0
                while i < len(cleaned_content):
                    if cleaned_content[i] == '\\':
                        # Se o próximo caractere não for um escape válido, tratar como escape literal
                        if i + 1 < len(cleaned_content) and cleaned_content[i+1] not in '"\\/bfnrtu':
                            fixed_content += '\\\\'  # Escape duplo para representar um escape literal
                            i += 1
                            continue
                    fixed_content += cleaned_content[i]
                    i += 1
                
                try:
                    # Terceira tentativa com escapes corrigidos
                    return json.loads(fixed_content)
                except json.JSONDecodeError as e:
                    print(f"Ainda inválido após correção de escapes: {str(e)}")
                    print(f"Trecho problemático: {fixed_content[max(0, e.pos-30):min(len(fixed_content), e.pos+30)]}")
                    
                    # Tentar corrigir comentários e outros problemas comuns
                    try:
                        # Remover comentários de estilo JS que o modelo pode gerar
                        no_comments = re.sub(r'//.*?(\n|$)', '\n', fixed_content)
                        # Substituir aspas simples por aspas duplas
                        quotes_fixed = no_comments.replace("'", '"')
                        return json.loads(quotes_fixed)
                    except Exception:
                        # Última tentativa: limpar caracteres problemáticos
                        try:
                            import re
                            sanitized = re.sub(r'\\(?!["\\/bfnrtu])', '\\\\', fixed_content)
                            return json.loads(sanitized)
                        except Exception as final_e:
                            print(f"Falha na tentativa final de correção: {str(final_e)}")
                            # Fallback: retornar estrutura vazia
                            return {"slides": []}

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
