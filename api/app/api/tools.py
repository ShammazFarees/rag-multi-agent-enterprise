from typing import List
from fastapi import APIRouter, HTTPException
from app.models import TaskItem, ToolExecuteRequest, ToolExecuteResponse
from app.services.agent_tools import agent_tools

router = APIRouter(prefix="/api/tools", tags=["Agent Tools & Action Center"])

@router.get("/tasks", response_model=List[TaskItem])
def get_all_tasks():
    """Fetch all agent-generated or user-created tasks."""
    return agent_tools.get_tasks()

@router.post("/tasks", response_model=TaskItem)
def create_new_task(title: str, priority: str = "Medium", deadline: str = "TBD", assignee: str = "Unassigned"):
    """Manually add a task to the action center."""
    return agent_tools.create_task(title=title, priority=priority, deadline=deadline, assignee=assignee)

@router.post("/tasks/{task_id}/toggle", response_model=TaskItem)
def toggle_task_status(task_id: str):
    """Toggle task completion state."""
    task = agent_tools.toggle_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.delete("/tasks/{task_id}")
def delete_task_item(task_id: str):
    """Delete a task item."""
    success = agent_tools.delete_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully", "task_id": task_id}

@router.post("/execute", response_model=ToolExecuteResponse)
def execute_tool_manually(request: ToolExecuteRequest):
    """Execute autonomous tool actions (`create_task`, `draft_email`, `export_report`)."""
    tool_name = request.tool_name
    params = request.parameters

    if tool_name == "create_task":
        task = agent_tools.create_task(
            title=params.get("title", "New Task"),
            priority=params.get("priority", "Medium"),
            deadline=params.get("deadline", "TBD"),
            assignee=params.get("assignee", "Unassigned")
        )
        return ToolExecuteResponse(
            success=True,
            result=task.model_dump(),
            message=f"Task '{task.title}' created successfully."
        )

    elif tool_name == "draft_email":
        email = agent_tools.draft_email(
            recipient=params.get("recipient", "cfo@company.com"),
            subject=params.get("subject", "DocuMind Summary"),
            body=params.get("body", "Executive summary attached.")
        )
        return ToolExecuteResponse(
            success=True,
            result=email.model_dump(),
            message=f"Email draft for '{email.recipient}' ready."
        )

    elif tool_name == "export_report":
        report = agent_tools.export_report(
            title=params.get("title", "Executive Report"),
            summary=params.get("summary", "Summary of findings"),
            sections=params.get("sections", [])
        )
        return ToolExecuteResponse(
            success=True,
            result=report.model_dump(),
            message="Report exported successfully."
        )

    else:
        raise HTTPException(status_code=400, detail=f"Unknown tool name '{tool_name}'")
