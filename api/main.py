from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import routers
from controllers.document import router as document_router
from controllers.objectives import router as objectives_router
from controllers.syllabus import router as syllabus_router

app = FastAPI(title="IA-EDU API")

# Enable CORS for your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],  # Your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(document_router)
app.include_router(objectives_router)
app.include_router(syllabus_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)