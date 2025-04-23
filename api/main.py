from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Enable CORS for your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/upload-document")
async def upload_document(file: UploadFile = File(...)):
    # Here you'll process the PDF with your AI logic
    content = await file.read()
    # Simulate AI processing
    return {
        "message": "Document received",
        "filename": file.filename,
    }


@app.post("/api/generate-objectives")
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


@app.post("/api/generate-syllabus")
async def generate_syllabus(data: dict):
    # AI logic to generate syllabus
    return {
        "topics": [
            {"id": 1, "title": "Introduction to AI", "depth": 3},
            {"id": 2, "title": "Neural Networks", "depth": 4},
        ]
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
