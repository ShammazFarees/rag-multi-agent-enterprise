const API_BASE = '/api';

export async function fetchHealthStatus() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch backend health status');
  return res.json();
}

export async function fetchDocuments() {
  const res = await fetch(`${API_BASE}/documents`);
  if (!res.ok) throw new Error('Failed to fetch document list');
  return res.json();
}

export async function uploadDocuments(fileList) {
  const formData = new FormData();
  for (let i = 0; i < fileList.length; i++) {
    formData.append('files', fileList[i]);
  }
  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload documents');
  return res.json();
}

export async function deleteDocument(docId) {
  const res = await fetch(`${API_BASE}/documents/${docId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete document');
  return res.json();
}

export async function resetDemoDocuments() {
  const res = await fetch(`${API_BASE}/documents/reset-demo`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reset demo documents');
  return res.json();
}

export async function sendChatMessage(message, history = []) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error('Failed to send query to RAG engine');
  return res.json();
}

export async function fetchTasks() {
  const res = await fetch(`${API_BASE}/tools/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(taskData) {
  const queryParams = new URLSearchParams(taskData).toString();
  const res = await fetch(`${API_BASE}/tools/tasks?${queryParams}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function toggleTask(taskId) {
  const res = await fetch(`${API_BASE}/tools/tasks/${taskId}/toggle`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to toggle task status');
  return res.json();
}

export async function deleteTask(taskId) {
  const res = await fetch(`${API_BASE}/tools/tasks/${taskId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
}

export async function executeTool(toolName, parameters) {
  const res = await fetch(`${API_BASE}/tools/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool_name: toolName, parameters }),
  });
  if (!res.ok) throw new Error('Failed to execute tool action');
  return res.json();
}
