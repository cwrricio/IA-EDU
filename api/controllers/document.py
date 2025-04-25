from fastapi import APIRouter, UploadFile, File, Depends
from services.llm_service import LLMService

router = APIRouter(prefix="/api", tags=["documents"])

@router.post("/upload-document")
async def upload_document(file: UploadFile = File(...), llm_service: LLMService = Depends(lambda: LLMService())):
    # Read the file content
    content = await file.read()
    
    try:
        # Process the document content with LLM
        text_content = content.decode("utf-8")  # Assuming text document
        analysis = await llm_service.process_document(text_content)
        
        return {
            "message": "Document processed successfully",
            "filename": file.filename,
            "analysis": analysis
        }
    except Exception as e:
        # Fallback response
        return {
            "message": "Document received",
            "filename": file.filename,
        }