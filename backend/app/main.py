from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import auth, documents
from app.database import init_db
from generate_postman import generate_postman_collection

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Document AI Chatbot API with multi-tenant support",
    version=settings.VERSION
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["Documents"])

@app.on_event("startup")
async def startup_event():
    """Initialize database and generate Postman collection on startup."""
    init_db()
    try:
        generate_postman_collection()
    except Exception as e:
        print(f"Failed to generate Postman collection: {str(e)}")

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "healthy", "version": settings.VERSION} 