import datetime
from typing import List, Dict, Any, Optional
from app.models import TaskItem, EmailDraft, ReportExport

class AgentToolsService:
    def __init__(self):
        self.tasks: List[TaskItem] = [
            TaskItem(
                id="task-1",
                title="Review Q3 Cloud GPU Infrastructure Renegotiation (Audit Item 3.1)",
                priority="High",
                deadline="2026-09-15",
                assignee="CFO / Infrastructure Director",
                completed=False,
                created_at="2026-08-15 08:30:00"
            ),
            TaskItem(
                id="task-2",
                title="Verify SSO Hardware Token MFA Compliance (Security Policy 1.2)",
                priority="Medium",
                deadline="2026-08-30",
                assignee="SecOps Lead",
                completed=True,
                created_at="2026-08-14 14:15:00"
            )
        ]
        self.emails: List[EmailDraft] = []
        self.reports: List[ReportExport] = []

    def create_task(self, title: str, priority: str = "Medium", deadline: str = "TBD", assignee: str = "Unassigned") -> TaskItem:
        task_id = f"task-{len(self.tasks) + 1}-{int(datetime.datetime.now().timestamp())}"
        task = TaskItem(
            id=task_id,
            title=title,
            priority=priority,
            deadline=deadline,
            assignee=assignee,
            completed=False,
            created_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        self.tasks.insert(0, task)
        return task

    def get_tasks(self) -> List[TaskItem]:
        return self.tasks

    def toggle_task(self, task_id: str) -> Optional[TaskItem]:
        for t in self.tasks:
            if t.id == task_id:
                t.completed = not t.completed
                return t
        return None

    def delete_task(self, task_id: str) -> bool:
        initial_len = len(self.tasks)
        self.tasks = [t for t in self.tasks if t.id != task_id]
        return len(self.tasks) < initial_len

    def draft_email(self, recipient: str, subject: str, body: str) -> EmailDraft:
        email = EmailDraft(recipient=recipient, subject=subject, body=body)
        self.emails.insert(0, email)
        return email

    def export_report(self, title: str, summary: str, sections: List[Dict[str, str]]) -> ReportExport:
        report = ReportExport(
            title=title,
            summary=summary,
            sections=sections,
            timestamp=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        self.reports.insert(0, report)
        return report

agent_tools = AgentToolsService()
