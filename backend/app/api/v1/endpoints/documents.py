from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List
import os

from app.core.config import settings
from app.database import get_db
from app.models import User, Document as DBDocument
from app.services.document_service import process_document
from app.api.deps import get_current_user

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.post("/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload one or more documents (PDF or DOC) for processing."""
    if not current_user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email address before uploading documents"
        )
    
    total_chunks = 0
    for file in files:
        # Save file temporarily
        file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        try:
            # Process the document
            chunks = process_document(file_path, current_user.id, db)
            total_chunks += chunks
        finally:
            # Clean up temporary file
            if os.path.exists(file_path):
                os.remove(file_path)

    return {
        "message": f"Processed {len(files)} files",
        "total_chunks": total_chunks
    }

@router.get("/documents")
async def list_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all documents for the current user."""
    documents = db.query(DBDocument).filter(DBDocument.user_id == current_user.id).all()
    return documents 