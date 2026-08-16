# 🚀 DocuMind AI — Enterprise RAG & Autonomous Agent System

[![Live Production Demo](https://img.shields.io/badge/Live%20Demo-Vercel-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://rag-multi-agent-enterprise.vercel.app)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Groq Llama 3.3](https://img.shields.io/badge/Groq-Llama%203.3%2070B-f97316?style=for-the-badge)](https://groq.com)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg?style=for-the-badge)](LICENSE)

**DocuMind AI** is an enterprise-grade Retrieval-Augmented Generation (RAG) dashboard and multi-tool agent workspace. It enables instant multi-format document ingestion (`.pdf`, `.txt`, `.csv`, `.docx`), vector similarity search with TF-IDF cosine matching, interactive source grounding citations, and automated agent tools for email drafting and task management.

---

## 🌐 Live Production Application

### 🔗 **[https://rag-multi-agent-enterprise.vercel.app](https://rag-multi-agent-enterprise.vercel.app)**

> Both the **React Frontend** and **FastAPI Python Backend** are deployed together on Vercel as a unified full-stack serverless application with zero external server hosting fees.

---

## ✨ Key Features

- 📄 **Multi-Format Document Ingestion**: Drag & drop or browse `.pdf`, `.txt`, `.csv`, and `.docx` files.
- ⚡ **Automated Token Chunking**: Splits uploaded documents into 500-token chunks with 50-token overlap.
- 🔍 **Pure Python Vector Store**: Calculates TF-IDF vectors and Cosine Similarity scores in real-time with zero external DB dependencies.
- 🤖 **Multi-LLM Provider Engine**: Powered by **Groq Llama 3.3 70B** and **Google Gemini Free Tier** with local fallback.
- 🎯 **Grounding Evidence Citations**: Interactive citation badges `[DocName: Section]` with confidence match percentage scores and modal snippet inspection.
- ⚡ **Autonomous Agent Tools**:
  - ✉️ **Email Draft Generator**: Formats executive summaries into ready-to-send email drafts.
  - 📌 **Interactive Task Manager**: Automatically creates and manages tasks with priorities (High/Med/Low), assignees, and deadlines.
  - 📑 **Report Exporter**: Generates structured executive markdown reports.
- 🎨 **Enterprise Glassmorphism UI**: Built with React, Vite, Lucide Icons, and Tailwind CSS.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User[👤 User Browser / Client] -->|HTTPS Requests| VercelApp[🌐 Vercel Unified Domain]
    
    subgraph Vercel Cloud Platform
        VercelApp -->|Static Routes /| ReactFrontend[🎨 React + Vite Frontend]
        VercelApp -->|API Routes /api/*| PythonServerless[⚡ @vercel/python Serverless API]
        
        subgraph Python FastAPI Backend
            PythonServerless --> DocProcessor[📄 Document Processor & Chunker]
            PythonServerless --> VectorEngine[🧠 TF-IDF Vector Store]
            PythonServerless --> RAGEngine[🤖 RAG & Agent Engine]
        end
    end

    subgraph LLM Provider Integration
        RAGEngine -->|Groq API Key| GroqAI[🔥 Groq Llama 3.3 70B]
        RAGEngine -->|Gemini API Key| GeminiAI[✨ Google Gemini 2.5 Flash]
        RAGEngine -->|Fallback| LocalSmartEngine[💻 Local Smart RAG Engine]
    end
```

---

## 📁 Repository Directory Structure

```
rag-multi-agent-enterprise/
├── api/                       # Vercel Serverless Function Entrypoint
│   ├── index.py               # Exports FastAPI app for Vercel
│   └── app/                   # Bundled Python backend modules
├── backend/                   # Local FastAPI Backend Application
│   ├── app/
│   │   ├── api/               # API Router endpoints (documents, chat, tools)
│   │   ├── services/          # Document Processor, Vector Store, RAG Engine
│   │   ├── models.py          # Pydantic Schemas
│   │   ├── config.py          # Environment settings
│   │   └── main.py            # FastAPI Application Root
│   └── sample_data/           # Sample enterprise demo documents
├── frontend/                  # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/        # Sidebar, ChatWorkspace, ActionCenter, Modals
│   │   ├── context/           # AppContext state manager
│   │   ├── services/          # Axios API Client
│   │   └── App.jsx
│   └── package.json
├── vercel.json                # Vercel Unified Deployment Configuration
├── requirements.txt           # Python dependencies for Serverless runtime
└── README.md
```

---

## 🔒 Proprietary & Copyright Notice

Copyright (c) 2026 **Mohamed Shammas**. All rights reserved.

This software and source code are proprietary. Unauthorized copying, modification, editing, redistribution, or commercial use is strictly prohibited. See the [`LICENSE`](LICENSE) file for complete details.
