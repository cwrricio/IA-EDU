from fastapi import APIRouter, UploadFile, File

router = APIRouter(prefix="/api", tags=["documents"])

@router.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):
    # Here you'll process the PDF with your AI logic
    content = await file.read()
    # Simulate AI processing
    return {
        "message": "Document received",
        "filename": file.filename,
    }