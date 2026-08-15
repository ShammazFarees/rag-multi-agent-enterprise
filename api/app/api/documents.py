import os
import uuid
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models import DocumentMetadata
from app.services.vector_store import vector_store

router = APIRouter(prefix="/api/documents", tags=["Documents"])

DEFAULT_DEMO_DOCS = [
    {
        "filename": "Q3_Financial_Audit_Report.txt",
        "doc_id": "demo-q3_financial_audit_report",
        "content": """DOCUMIND ENTERPRISE FINANCIAL AUDIT REPORT - Q3 2026

Executive Summary:
DocuMind Technologies underwent a comprehensive Q3 2026 financial and compliance audit conducted by Apex Financial Advisory LLC. The objective of this audit was to evaluate financial operations, operational expense controls, recurring revenue performance, and cloud infrastructure expenditure efficiency. Overall audit rating: SATISFACTORY with minor recommendations.

1. Financial Highlights & Metrics:
- Total Q3 Revenue: $14.82 Million (Up 18.5% YoY, driven by enterprise RAG platform subscriptions).
- Gross Margin: 76.4% (Target: 75.0%).
- Net Operating Income: $3.45 Million.
- Recurring Revenue (ARR): $54.2 Million across 420 active enterprise clients.
- Cash & Equivalents Reserves: $28.6 Million held in tier-1 FDIC-insured institutions.

2. Cost Center Analysis & Departmental Spends:
- Research & Development (R&D): $5.12 Million (34.5% of revenue). Key investments were directed toward multi-modal RAG context windows, agentic vector search indexing, and automated evaluation suites.
- Cloud Infrastructure & API Costs: $1.85 Million. Serverless compute and GPU vector store hosting represented 62% of this cost. Recommendation: Migrate low-priority vector index builds to spot GPU clusters to reduce quarterly cloud spend by estimated $320,000.
- Sales & Marketing (S&M): $3.90 Million (26.3% of revenue). Customer Acquisition Cost (CAC) improved from $14,200 to $11,800 per enterprise account.
- General & Administrative (G&A): $2.35 Million (15.8% of revenue).

3. Audit Findings & Action Items:
- Item 3.1 [Priority: High]: Cloud infrastructure vendor commitments require quarterly renegotiation to leverage volume discounts. Assigned owner: CFO Office / Infrastructure Director. Deadline: Q4 Week 3.
- Item 3.2 [Priority: Medium]: Software license utilization audit revealed 85 unused SaaS seats across sales operations. Estimated annual savings: $48,000.
- Item 3.3 [Priority: Low]: Travel expense reporting compliance reached 98.2%, well within corporate compliance thresholds.

4. Conclusion & CFO Note:
DocuMind maintains a highly resilient balance sheet with expanding operating margins. CFO approval required for R&D GPU cluster expansion budget exceeding $500,000 in Q4.
"""
    },
    {
        "filename": "Enterprise_Security_Policy.txt",
        "doc_id": "demo-enterprise_security_policy",
        "content": """DOCUMIND ENTERPRISE INFORMATION SECURITY & DATA GOVERNANCE POLICY
Document Control ID: SEC-POL-2026-V4
Effective Date: January 15, 2026
Applies To: All Employees, Contractors, Subcontractors, and Third-Party System Integrators.

1. Authentication & Access Management:
- Section 1.1 - Password Standards: All user accounts must use strong passwords with a minimum length of 16 characters including uppercase, lowercase, numbers, and symbols. Passwords must be rotated every 90 days or immediately upon suspected compromise.
- Section 1.2 - Multi-Factor Authentication (MFA): MFA is MANDATORY across all enterprise portals, single sign-on (SSO) endpoints, code repositories, and production server access. FIDO2 / hardware security keys or TOTP authenticator apps are required; SMS-based MFA is prohibited for internal systems.
- Section 1.3 - Role-Based Access Control (RBAC): Access to production data, vector database indices, customer document stores, and secret managers is governed strictly by Least Privilege principles. All privileged access requires JIT (Just-In-Time) approval tickets valid for a maximum of 8 hours.

2. RAG & AI Data Privacy Standards:
- Section 2.1 - Grounding & Isolation: Customer documents uploaded to the DocuMind RAG engine must remain logically and cryptographically isolated within tenant-specific vector namespaces.
- Section 2.2 - LLM Training Restrictions: No customer uploaded documents, vectors, embeddings, or query telemetry may be transmitted to external LLM providers for model training purposes. Zero-Data-Retention (ZDR) enterprise agreements must be active for all external LLM API providers (e.g. Google Gemini Enterprise, OpenAI Enterprise).
- Section 2.3 - PII Sanitization: Automatic PII scrubbing filters (redacting SSNs, credit card numbers, and confidential passwords) must run prior to chunking and vector embedding generation.

3. Incident Response & Security Escalations:
- Section 3.1 - Incident Severity Thresholds: Security incidents are classified as SEV-1 (Critical Data Breach / System Outage), SEV-2 (High Risk / Unauthorized Access Attempt), or SEV-3 (Low Risk / Policy Violation).
- Section 3.2 - Reporting SLA: All suspected security incidents must be reported immediately to security@documind.ai or via the internal #security-escalations Slack channel within 15 minutes of detection.
"""
    }
]

@router.get("", response_model=List[DocumentMetadata])
def list_documents():
    """List all uploaded and indexed documents."""
    docs = vector_store.list_documents()
    if not docs:
        reset_demo_documents()
        docs = vector_store.list_documents()
    return docs

@router.post("/upload", response_model=List[DocumentMetadata])
async def upload_documents(files: List[UploadFile] = File(...)):
    """Upload and chunk/index multiple documents (.pdf, .txt, .csv, .docx)."""
    indexed_docs = []
    for file in files:
        file_bytes = await file.read()
        doc_id = str(uuid.uuid4())[:8]
        file_type = file.filename.split(".")[-1].upper() if "." in file.filename else "TXT"
        
        meta = vector_store.add_document(
            doc_id=doc_id,
            filename=file.filename,
            file_bytes=file_bytes,
            file_type=file_type
        )
        indexed_docs.append(meta)

    return indexed_docs

@router.delete("/{doc_id}")
def delete_document(doc_id: str):
    """Delete a document and remove its chunks from the vector store."""
    success = vector_store.delete_document(doc_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document and associated vectors deleted successfully", "doc_id": doc_id}

@router.post("/reset-demo")
def reset_demo_documents():
    """Re-load sample enterprise documents into the vector store."""
    vector_store.clear_all()
    loaded = []
    
    for doc in DEFAULT_DEMO_DOCS:
        meta = vector_store.add_document(
            doc_id=doc["doc_id"],
            filename=doc["filename"],
            file_bytes=doc["content"].encode("utf-8"),
            file_type="TXT"
        )
        loaded.append(meta)

    return {"message": "Demo documents successfully indexed", "documents": loaded}
