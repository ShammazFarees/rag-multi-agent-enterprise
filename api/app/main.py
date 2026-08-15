from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.documents import router as documents_router, reset_demo_documents
from app.api.chat import router as chat_router
from app.api.tools import router as tools_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        reset_demo_documents()
    except Exception:
        pass
    yield

app = FastAPI(
    title="DocuMind AI Backend API",
    description="Enterprise RAG & Autonomous Multi-Tool Agent Engine",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents_router)
app.include_router(chat_router)
app.include_router(tools_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "active_provider": settings.active_provider,
        "message": "DocuMind AI Enterprise Backend is operational."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
