from fastapi import APIRouter, HTTPException
from services.llm_service import LLMService

router = APIRouter(prefix="/api", tags=["content"])

@router.post("/generate-content")
async def generate_content(data: dict):
    """Generate course content based on the provided context."""
    try:
        context = data.get("context", "")
        
        # Usar o método correto - importante manter o nome do método original
        result = await LLMService().generate_content(context)
        
        # Enriqueça os itens com campos detalhados sem alterar a estrutura original
        enriched_items = []
        for item in result["content_items"]:
            # Gere conteúdo detalhado para cada item
            detailed_content = LLMService.generate_detailed_content(item["title"], item["description"])
            
            enriched_item = {
                "id": item["id"],
                "title": item["title"],
                "description": item["description"],
                "content": detailed_content["content"],
                "learning_objectives": detailed_content["learning_objectives"],
                "related_objectives": detailed_content["related_objectives"]
            }
            enriched_items.append(enriched_item)
        
        # Manter a mesma estrutura da resposta original
        return {"content_items": enriched_items}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")
    
# -------------------código que gera dados mockados para evitar problemas de limite de taxa-------------------

# from fastapi import APIRouter, HTTPException
# from services.llm_service import LLMService
# import time

# router = APIRouter(prefix="/api", tags=["content"])

# @router.post("/generate-content")
# async def generate_content(data: dict):
#     """Generate course content based on the provided context."""
#     try:
#         context = data.get("context", "")
        
#         try:
#             # Tentar usar o serviço LLM principal
#             result = await LLMService().generate_content(context)
#         except Exception as llm_error:
#             # Se falhar por limite de taxa, usar conteúdo mockado
#             if "rate_limit" in str(llm_error).lower():
#                 print("Rate limit reached, using mock content instead")
#                 result = generate_mock_content(context)
#             else:
#                 # Se for outro erro, relançar
#                 raise llm_error
        
#         # Enriqueça os itens com campos detalhados
#         enriched_items = []
#         for item in result["content_items"]:
#             try:
#                 # Tentar gerar conteúdo detalhado
#                 detailed_content = await generate_detailed_content_safely(item["title"], item["description"])
#             except Exception as detail_error:
#                 # Em caso de erro, usar conteúdo detalhado básico
#                 print(f"Error generating detailed content: {str(detail_error)}")
#                 detailed_content = generate_mock_detailed_content(item["title"], item["description"])
            
#             enriched_item = {
#                 "id": item["id"],
#                 "title": item["title"],
#                 "description": item["description"],
#                 "content": detailed_content["content"],
#                 "learning_objectives": detailed_content["learning_objectives"],
#                 "related_objectives": detailed_content["related_objectives"]
#             }
#             enriched_items.append(enriched_item)
        
#         return {"content_items": enriched_items}
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")

# async def generate_detailed_content_safely(title, description):
#     """Wrapper for safe generation of detailed content."""
#     try:
#         return LLMService.generate_detailed_content(title, description)
#     except Exception as e:
#         if "rate_limit" in str(e).lower():
#             # Esperar um pouco e tentar novamente com conteúdo simplificado
#             return generate_mock_detailed_content(title, description)
#         raise e

# def generate_mock_content(context):
#     """Generate mock content when the API has rate limiting issues."""
#     # Extrair palavras-chave do contexto para personalizar o conteúdo mockado
#     keywords = context.split()[:3]  # Usar as primeiras 3 palavras como referência
#     base_topic = " ".join(keywords) if keywords else "Curso Educacional"
    
#     return {
#         "content_items": [
#             {
#                 "id": 1,
#                 "title": f"Introdução ao {base_topic}",
#                 "description": f"Conceitos básicos sobre {base_topic} e sua importância no contexto educacional"
#             },
#             {
#                 "id": 2,
#                 "title": f"Fundamentos de {base_topic}",
#                 "description": f"Princípios e conceitos fundamentais relacionados a {base_topic}"
#             },
#             {
#                 "id": 3,
#                 "title": f"Aplicações Práticas de {base_topic}",
#                 "description": f"Como aplicar os conhecimentos de {base_topic} em situações reais"
#             },
#             {
#                 "id": 4,
#                 "title": f"Avaliação e Análise de {base_topic}",
#                 "description": f"Métodos para avaliar e analisar resultados relacionados a {base_topic}"
#             }
#         ]
#     }

# def generate_mock_detailed_content(title, description):
#     """Generate mock detailed content when the API has rate limiting issues."""
#     return {
#         "content": f"O Sequestro de Prefixos é um evento de segurança que ocorre quando um Sistema Autônomo (AS) anuncia um prefixo IP que não é de sua propriedade. Isso pode causar interrupções na rede e desvios de tráfego, afetando a segurança e a estabilidade da Internet.\n\n{title}: {description}",
#         "learning_objectives": [
#             f"Compreender o conceito de {title}",
#             f"Entender a importância da segurança cibernética",
#             f"Aplicar conhecimentos em simulações práticas"
#         ],
#         "related_objectives": [
#             f"Relacionar {title} com outros conceitos de segurança de rede",
#             f"Desenvolver estratégias de mitigação para {title}"
#         ]
#     }