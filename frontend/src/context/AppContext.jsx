import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [documents, setDocuments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeProvider, setActiveProvider] = useState('Local Smart RAG Engine (Zero API Key)');
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'agent',
      text: `### 👋 Welcome to **DocuMind AI**!
I am your enterprise agentic assistant grounded on your uploaded documents.

#### 🚀 Quick Start Instructions:
1. **Explore Indexed Documents** in the left sidebar (Demo files: \`Q3_Financial_Audit_Report.txt\` and \`Enterprise_Security_Policy.txt\`).
2. **Ask grounded questions** like *"What is our MFA security policy?"* or *"Summarize Q3 financial highlights"*.
3. **Execute agent actions** like *"Draft an email to the CFO summarizing audit recommendations and create a high priority task for cloud renegotiation"*.
4. **Click interactive citations** \`[Citation: DocName (Section)]\` to view exact source snippets!`,
      citations: [],
      provider: 'System Assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [selectedCitation, setSelectedCitation] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(true);

  // Load initial backend status, docs, and tasks
  const loadInitialData = async () => {
    try {
      const health = await api.fetchHealthStatus();
      setActiveProvider(health.active_provider);

      const docs = await api.fetchDocuments();
      setDocuments(docs);

      const taskList = await api.fetchTasks();
      setTasks(taskList);
    } catch (err) {
      console.error('Failed loading initial data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleUploadFiles = async (fileList) => {
    try {
      setIsUploading(true);
      const uploadedDocs = await api.uploadDocuments(fileList);
      const updatedDocs = await api.fetchDocuments();
      setDocuments(updatedDocs);
      return uploadedDocs;
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await api.deleteDocument(docId);
      const updatedDocs = await api.fetchDocuments();
      setDocuments(updatedDocs);
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleResetDemo = async () => {
    try {
      setIsUploading(true);
      await api.resetDemoDocuments();
      const updatedDocs = await api.fetchDocuments();
      setDocuments(updatedDocs);
    } catch (err) {
      alert('Demo reset failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || isProcessing) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const response = await api.sendChatMessage(text);

      const agentMsg = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: response.answer,
        citations: response.citations || [],
        provider: response.provider || activeProvider,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, agentMsg]);

      // Check if tools were triggered
      if (response.triggered_tools && response.triggered_tools.length > 0) {
        // Refresh tasks
        const updatedTasks = await api.fetchTasks();
        setTasks(updatedTasks);

        // Check if email tool was triggered
        const emailTool = response.triggered_tools.find(t => t.type === 'draft_email');
        if (emailTool) {
          setSelectedEmail(emailTool.data);
        }
      }
    } catch (err) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        text: `⚠️ **Error processing request**: ${err.message}`,
        citations: [],
        provider: 'System Alert',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      await api.toggleTask(taskId);
      const updatedTasks = await api.fetchTasks();
      setTasks(updatedTasks);
    } catch (err) {
      console.error('Failed toggling task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      const updatedTasks = await api.fetchTasks();
      setTasks(updatedTasks);
    } catch (err) {
      console.error('Failed deleting task:', err);
    }
  };

  const handleManualCreateTask = async (title, priority, deadline, assignee) => {
    try {
      await api.createTask({ title, priority, deadline, assignee });
      const updatedTasks = await api.fetchTasks();
      setTasks(updatedTasks);
    } catch (err) {
      console.error('Failed creating task:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        documents,
        tasks,
        activeProvider,
        messages,
        selectedCitation,
        setSelectedCitation,
        selectedEmail,
        setSelectedEmail,
        selectedReport,
        setSelectedReport,
        isUploading,
        isProcessing,
        isActionCenterOpen,
        setIsActionCenterOpen,
        handleUploadFiles,
        handleDeleteDocument,
        handleResetDemo,
        handleSendMessage,
        handleToggleTask,
        handleDeleteTask,
        handleManualCreateTask,
        loadInitialData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
