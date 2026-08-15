from fastapi import APIRouter
from app.models import ChatRequest, ChatResponse
from app.services.rag_engine import rag_engine

router = APIRouter(prefix="/api/chat", tags=["RAG Chat"])

@router.post("", response_model=ChatResponse)
def query_chat(request: ChatRequest):
    """Query the enterprise RAG engine for grounded answers, citations, and agent tools."""
    return rag_engine.answer_query(request.message, request.history)
