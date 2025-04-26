import os
import tempfile
from fastapi import APIRouter, UploadFile, File, Depends
from services.llm_service import LLMService
import PyPDF2
import io

router = APIRouter(prefix="/api", tags=["documents"])

llm_service = LLMService()

@router.post("/upload-document")
async def upload_document(file: UploadFile = File(...), llm_service: LLMService = Depends(lambda: LLMService())):
    # Read the file content
    content = await file.read()
    
    try:
        # Check file type and extract text accordingly
        if file.filename.lower().endswith('.pdf'):
            # Process PDF file
            text_content = extract_text_from_pdf(content)
        else:
            # Process as regular text file
            text_content = content.decode("utf-8")
        
        # Process the document content with LLM
        analysis = await llm_service.process_document(text_content)
        
        return {
            "message": "Document processed successfully",
            "filename": file.filename,
            "analysis": analysis
        }
    except Exception as e:
        print(f"Error processing document: {str(e)}")
        # Fallback response
        return {
            "message": "Document received but could not be fully processed",
            "filename": file.filename,
            "error": str(e)
        }

def extract_text_from_pdf(pdf_content):
    """Extract text from PDF binary content"""
    pdf_file = io.BytesIO(pdf_content)
    reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    
    # Extract text from each page
    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]
        text += page.extract_text() + "\n"
    
    return text