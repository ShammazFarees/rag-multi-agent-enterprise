from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class DocumentMetadata(BaseModel):
    id: str
    name: str
    size_bytes: int
    chunk_count: int
    upload_time: str
    status: str = "Indexed"  # "Indexed", "Processing", "Error"
    file_type: str

class Citation(BaseModel):
    doc_id: str
    doc_name: str
    page_or_section: str
    snippet: str
    similarity_score: float

class TaskItem(BaseModel):
    id: str
    title: str
    priority: str = "Medium"  # High, Medium, Low
    deadline: str = "TBD"
    assignee: str = "Unassigned"
    completed: bool = False
    created_at: str

class EmailDraft(BaseModel):
    recipient: str
    subject: str
    body: str

class ReportExport(BaseModel):
    title: str
    summary: str
    sections: List[Dict[str, str]]
    timestamp: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = None

class ToolAction(BaseModel):
    tool_name: str  # "create_task", "draft_email", "export_report"
    parameters: Dict[str, Any]

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]
    triggered_tools: List[Dict[str, Any]] = []
    provider: str

class ToolExecuteRequest(BaseModel):
    tool_name: str
    parameters: Dict[str, Any]

class ToolExecuteResponse(BaseModel):
    success: bool
    result: Dict[str, Any]
    message: str
