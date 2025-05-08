from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uuid
import os
import fitz  # PyMuPDF
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA

app = FastAPI()

# Allow CORS for local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

vectorstore = None
retriever = None

class QueryRequest(BaseModel):
    query: str

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    file_id = str(uuid.uuid4())
    filepath = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    with open(filepath, "wb") as f:
        f.write(await file.read())

    # Parse PDF
    doc = fitz.open(filepath)
    text = "\n".join([page.get_text() for page in doc])

    # Split text
    splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = splitter.split_text(text)

    # Create embeddings & vectorstore
    embeddings = OpenAIEmbeddings()
    global vectorstore, retriever
    vectorstore = FAISS.from_texts(chunks, embeddings)
    retriever = vectorstore.as_retriever()

    return {"message": "PDF uploaded and processed", "chunks": len(chunks)}

@app.post("/query")
async def ask_question(query_request: QueryRequest):
    global retriever
    if retriever is None:
        raise HTTPException(status_code=400, detail="No documents uploaded yet")

    qa = RetrievalQA.from_chain_type(llm=OpenAI(), retriever=retriever)
    answer = qa.run(query_request.query)
    return {"answer": answer}

@app.get("/")
def read_root():
    return {"message": "PDF AI Chatbot API running"}
