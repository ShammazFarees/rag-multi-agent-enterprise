import io
import csv
from typing import List, Dict, Any

try:
    import pypdf
except ImportError:
    pypdf = None

try:
    import docx
except ImportError:
    docx = None

class DocumentProcessor:
    @staticmethod
    def extract_text_and_chunks(file_bytes: bytes, filename: str) -> List[Dict[str, Any]]:
        """
        Parses text from various file formats (.txt, .pdf, .docx, .csv)
        and chunks them into structured segments with metadata.
        """
        filename_lower = filename.lower()
        chunks = []

        if filename_lower.endswith(".txt"):
            text = file_bytes.decode("utf-8", errors="ignore")
            chunks = DocumentProcessor._chunk_text_by_sections(text, filename)

        elif filename_lower.endswith(".pdf"):
            if pypdf:
                try:
                    pdf_reader = pypdf.PdfReader(io.BytesIO(file_bytes))
                    for page_idx, page in enumerate(pdf_reader.pages):
                        page_text = page.extract_text() or ""
                        if page_text.strip():
                            page_chunks = DocumentProcessor._chunk_string(
                                page_text, 
                                chunk_size=500, 
                                overlap=50, 
                                section_name=f"Page {page_idx + 1}"
                            )
                            chunks.extend(page_chunks)
                except Exception:
                    text = file_bytes.decode("utf-8", errors="ignore")
                    chunks = DocumentProcessor._chunk_string(text, chunk_size=500, overlap=50, section_name="PDF Text")
            else:
                text = file_bytes.decode("utf-8", errors="ignore")
                chunks = DocumentProcessor._chunk_string(text, chunk_size=500, overlap=50, section_name="PDF Text")

        elif filename_lower.endswith(".docx"):
            if docx:
                try:
                    doc = docx.Document(io.BytesIO(file_bytes))
                    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
                    full_text = "\n\n".join(paragraphs)
                    chunks = DocumentProcessor._chunk_text_by_sections(full_text, filename)
                except Exception:
                    text = file_bytes.decode("utf-8", errors="ignore")
                    chunks = DocumentProcessor._chunk_string(text, chunk_size=500, overlap=50, section_name="DOCX Text")
            else:
                text = file_bytes.decode("utf-8", errors="ignore")
                chunks = DocumentProcessor._chunk_string(text, chunk_size=500, overlap=50, section_name="DOCX Text")

        elif filename_lower.endswith(".csv"):
            text_content = file_bytes.decode("utf-8", errors="ignore")
            reader = csv.reader(io.StringIO(text_content))
            rows = [", ".join(row) for row in reader if any(row)]
            full_text = "\n".join(rows)
            chunks = DocumentProcessor._chunk_string(
                full_text, 
                chunk_size=500, 
                overlap=50, 
                section_name="CSV Data"
            )

        else:
            text = file_bytes.decode("utf-8", errors="ignore")
            chunks = DocumentProcessor._chunk_string(text, chunk_size=500, overlap=50, section_name="General")

        return chunks

    @staticmethod
    def _chunk_text_by_sections(text: str, filename: str) -> List[Dict[str, Any]]:
        lines = text.split("\n")
        current_section = "Overview"
        current_buffer = []
        chunks = []

        for line in lines:
            line_str = line.strip()
            if (line_str.startswith(("1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "Section", "Item", "Executive", "Conclusion"))
                    and len(line_str) < 80):
                if current_buffer:
                    section_text = "\n".join(current_buffer)
                    sub_chunks = DocumentProcessor._chunk_string(section_text, chunk_size=500, overlap=50, section_name=current_section)
                    chunks.extend(sub_chunks)
                    current_buffer = []
                current_section = line_str[:50]
            else:
                current_buffer.append(line)

        if current_buffer:
            section_text = "\n".join(current_buffer)
            sub_chunks = DocumentProcessor._chunk_string(section_text, chunk_size=500, overlap=50, section_name=current_section)
            chunks.extend(sub_chunks)

        return chunks if chunks else DocumentProcessor._chunk_string(text, 500, 50, "Document Body")

    @staticmethod
    def _chunk_string(text: str, chunk_size: int = 500, overlap: int = 50, section_name: str = "Section") -> List[Dict[str, Any]]:
        words = text.split()
        if not words:
            return []

        chunks = []
        start = 0
        chunk_idx = 1
        
        while start < len(words):
            end = start + chunk_size
            chunk_words = words[start:end]
            chunk_text = " ".join(chunk_words)
            
            chunks.append({
                "chunk_id": f"{section_name}-chunk-{chunk_idx}",
                "section": section_name,
                "text": chunk_text,
                "word_count": len(chunk_words)
            })
            
            start += (chunk_size - overlap)
            chunk_idx += 1
            
        return chunks
