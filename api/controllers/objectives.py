from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["objectives"])

@router.post("/generate-objectives")
async def generate_objectives(data: dict):
    # AI logic to generate educational objectives
    return {
        "data": data,
        "general": "O objetivo geral deste projeto é promover o uso de inteligência artificial como ferramenta auxiliar no processo educacional, melhorando a qualidade do ensino e facilitando a personalização do aprendizado de acordo com as necessidades individuais dos alunos.",
        "specific": [
            {
                "id": "1",
                "text": "Identificar as principais tecnologias de IA aplicáveis ao contexto educacional",
            },
            {
                "id": "2",
                "text": "Desenvolver habilidades para implementação de ferramentas de IA no processo de ensino",
            },
            {
                "id": "3",
                "text": "Avaliar o impacto da IA na personalização da aprendizagem",
            },
            {
                "id": "4",
                "text": "Criar estratégias de ensino potencializadas por sistemas de IA",
            },
            {
                "id": "5",
                "text": "Compreender os aspectos éticos envolvidos na aplicação de IA na educação",
            },
        ],
    }