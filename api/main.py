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
        "general": ["Understand key concepts of machine learning"],
        "specific": ["Implement a basic neural network", "Evaluate model performance"],
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
