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
            detailed_content = LLMService.generate_detailed_content(
                item["title"], item["description"]
            )

            enriched_item = {
                "id": item["id"],
                "title": item["title"],
                "description": item["description"],
                "content": detailed_content["content"],
                "learning_objectives": detailed_content["learning_objectives"],
                "related_objectives": detailed_content["related_objectives"],
            }
            enriched_items.append(enriched_item)

        # Manter a mesma estrutura da resposta original
        return {"content_items": enriched_items}
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Error generating content: {str(e)}"
        )


@router.post("/generate-slides")
async def generate_slides(data: dict):
    """Generate educational slides based on the provided content item."""
    try:
        content_item = data.get("content_item", {})
        title = content_item.get("title", "")
        description = content_item.get("description", "")
        content = content_item.get("content", "")
        
        print(f"Gerando slides para: {title}")
        print(f"Descrição: {description[:50]}...")
        print(f"Conteúdo: {content[:50]}...")
        
        # Use the LLM service to generate slides
        result = await LLMService().generate_slides(title, description, content)
        
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error generating slides: {str(e)}")
