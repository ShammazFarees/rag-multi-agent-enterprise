import json
import requests
from typing import Dict, Any, List
from app.config import settings
from app.services.vector_store import vector_store
from app.services.agent_tools import agent_tools
from app.models import Citation, ChatResponse

EXECUTIVE_SYSTEM_PROMPT = """You are DocuMind AI, an elite enterprise agentic assistant.
Your goal is to provide beautifully structured, executive-ready, highly professional responses grounded strictly on provided document context.

### RESPONSE FORMATTING RULES:
1. **Executive Summary Card**: Start with a concise, high-impact 2-sentence summary.
2. **Structured Sections**: Use clear Markdown headings (`###`, `####`) with relevant emojis (e.g. 👤 Candidate Profile, 📊 Key Metrics, 🛡️ Policy & Governance, 💼 Work Experience, ⚡ Action Items).
3. **Visual Hierarchy & Formatting**:
   - Use bold text for key metrics, names, dates, and numbers.
   - Use bullet points and numbered lists for legibility.
   - Use GFM markdown tables when presenting structured data or comparison items.
   - Use blockquotes (`>`) to emphasize direct quotes or critical policy rules.
4. **Citations**: Include source citations using the syntax `[DocName: Section]` after facts or figures.
5. **No Hallucination**: Ground answers strictly on context. If information is partially absent, state what is present and what is missing.
"""

class RAGEngine:
    def answer_query(self, message: str, history: List[Dict[str, str]] = None) -> ChatResponse:
        # 1. Retrieve top context chunks
        matched_chunks = vector_store.search_similar_chunks(message, top_k=6)

        # Smart filter: If query mentions a specific uploaded document (e.g., CV, Audit, Policy), prioritize those chunks
        msg_lower = message.lower()
        if any(term in msg_lower for term in ["cv", "resume", "shammas", "mohamd"]):
            cv_chunks = [c for c in matched_chunks if "cv" in c["doc_name"].lower() or "shammas" in c["doc_name"].lower()]
            if cv_chunks:
                matched_chunks = cv_chunks + [c for c in matched_chunks if c not in cv_chunks]

        # Build Citations (Filter out low relevance false-positive matches under threshold if higher matches exist)
        citations = []
        context_blocks = []
        
        # Determine maximum relevance score in batch
        max_score = max([c["similarity_score"] for c in matched_chunks], default=1.0)
        
        for idx, chunk in enumerate(matched_chunks):
            score = chunk["similarity_score"]
            
            # Keep top matches or chunks exceeding relevance ratio threshold
            if idx < 2 or score >= (max_score * 0.4) or score >= 0.10:
                citation = Citation(
                    doc_id=chunk["doc_id"],
                    doc_name=chunk["doc_name"],
                    page_or_section=chunk["section"],
                    snippet=chunk["text"][:280] + ("..." if len(chunk["text"]) > 280 else ""),
                    similarity_score=score
                )
                citations.append(citation)
                context_blocks.append(f"[{chunk['doc_name']} | {chunk['section']}]: {chunk['text']}")

        context_str = "\n\n".join(context_blocks) if context_blocks else "No relevant document chunks found."

        # 2. Check for LLM API keys: Groq AI -> Gemini -> OpenAI -> Local Smart Engine
        if settings.GROQ_API_KEY:
            return self._call_groq(message, context_str, citations, matched_chunks)
        elif settings.GEMINI_API_KEY:
            return self._call_gemini(message, context_str, citations, matched_chunks)
        elif settings.OPENAI_API_KEY:
            return self._call_openai(message, context_str, citations, matched_chunks)
        else:
            return self._call_local_smart_mock(message, matched_chunks, citations)

    def _call_groq(self, message: str, context: str, citations: List[Citation], chunks: List[Dict[str, Any]]) -> ChatResponse:
        try:
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
            user_prompt = (
                f"User Query: {message}\n\n"
                f"Retrieved Document Context:\n{context}\n\n"
                f"Synthesize an executive-ready, beautifully structured response with citations following your formatting rules."
            )
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": EXECUTIVE_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.2
            }
            res = requests.post(url, headers=headers, json=payload, timeout=12)
            data = res.json()
            
            if "choices" in data and len(data["choices"]) > 0:
                answer = data["choices"][0]["message"]["content"]
                return ChatResponse(answer=answer, citations=citations, provider="Groq AI (Llama 3.3 70B)")
            else:
                return self._call_local_smart_mock(message, chunks, citations)
        except Exception as e:
            return self._call_local_smart_mock(message, chunks, citations)

    def _call_gemini(self, message: str, context: str, citations: List[Citation], chunks: List[Dict[str, Any]]) -> ChatResponse:
        try:
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            
            prompt = f"{EXECUTIVE_SYSTEM_PROMPT}\n\nUser Query: {message}\n\nRetrieved Context:\n{context}"
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            return ChatResponse(
                answer=response.text,
                citations=citations,
                provider="Google Gemini (Free API Key)"
            )
        except Exception as e:
            if settings.GROQ_API_KEY:
                return self._call_groq(message, context, citations, chunks)
            return self._call_local_smart_mock(message, chunks, citations)

    def _call_openai(self, message: str, context: str, citations: List[Citation], chunks: List[Dict[str, Any]]) -> ChatResponse:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": EXECUTIVE_SYSTEM_PROMPT},
                    {"role": "user", "content": f"Context:\n{context}\n\nQuery: {message}"}
                ]
            }
            res = requests.post(url, headers=headers, json=payload, timeout=10)
            data = res.json()
            answer = data["choices"][0]["message"]["content"]
            return ChatResponse(answer=answer, citations=citations, provider="OpenAI GPT")
        except Exception as e:
            return self._call_local_smart_mock(message, chunks, citations)

    def _call_local_smart_mock(self, message: str, chunks: List[Dict[str, Any]], citations: List[Citation]) -> ChatResponse:
        msg_lower = message.lower()
        triggered_tools = []
        
        is_email_request = any(word in msg_lower for word in ["email", "draft", "mail", "send to"])
        is_task_request = any(word in msg_lower for word in ["task", "action item", "todo", "assign", "create task"])

        if is_email_request:
            email_draft = agent_tools.draft_email(
                recipient="hr@company.com",
                subject=f"Executive Analysis Summary: {message[:30]}...",
                body="Based on DocuMind RAG analysis of active documents, summary has been drafted."
            )
            triggered_tools.append({"type": "draft_email", "data": email_draft.model_dump()})

        if is_task_request:
            new_task = agent_tools.create_task(
                title=f"Review findings for query: '{message[:40]}...'",
                priority="High" if "high" in msg_lower or "urgent" in msg_lower else "Medium",
                deadline="2026-09-01",
                assignee="Target Reviewer"
            )
            triggered_tools.append({"type": "create_task", "data": new_task.model_dump()})

        if not chunks:
            answer = (
                "### ℹ️ No Specific Context Matches Found\n\n"
                "I searched the active vector index, but couldn't find relevant chunks matching your query. "
                "Please make sure your target document is uploaded and indexed in the left sidebar."
            )
        else:
            answer_parts = []
            answer_parts.append("### 📌 Executive Summary\n")
            answer_parts.append(f"Grounded analysis synthesized from **{len(chunks)} relevant document chunk(s)** in DocuMind RAG Index.\n")

            for idx, c in enumerate(chunks[:3]):
                score_pct = c['similarity_score'] * 100
                answer_parts.append(
                    f"#### 📄 Key Findings from {c['doc_name']} ({c['section']}) `[{score_pct:.0f}% Relevance]`\n"
                    f"> \"{c['text']}\"\n\n"
                    f"`[Citation: {c['doc_name']}: {c['section']}]`\n"
                )

            answer_parts.append("\n#### 📑 Source Evidence Matrix")
            answer_parts.append("| Document Name | Section / Page | Relevance Confidence |")
            answer_parts.append("| :--- | :--- | :--- |")
            for c in chunks:
                answer_parts.append(f"| **{c['doc_name']}** | {c['section']} | `{c['similarity_score'] * 100:.1f}%` |")

            answer = "\n".join(answer_parts)

        return ChatResponse(
            answer=answer,
            citations=citations,
            triggered_tools=triggered_tools,
            provider="Local Smart RAG Engine"
        )

rag_engine = RAGEngine()
