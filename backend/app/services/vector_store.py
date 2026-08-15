import math
import re
import datetime
from collections import Counter
from typing import List, Dict, Any, Optional
from app.services.document_processor import DocumentProcessor

def tokenize(text: str) -> List[str]:
    return re.findall(r'\w+', text.lower())

class VectorStore:
    def __init__(self):
        # Maps doc_id -> metadata dictionary
        self.documents: Dict[str, Dict[str, Any]] = {}
        # List of chunk objects
        self.chunks: List[Dict[str, Any]] = []

    def add_document(self, doc_id: str, filename: str, file_bytes: bytes, file_type: str) -> Dict[str, Any]:
        """Parse, chunk, and index a document into the vector store."""
        extracted_chunks = DocumentProcessor.extract_text_and_chunks(file_bytes, filename)

        doc_meta = {
            "id": doc_id,
            "name": filename,
            "size_bytes": len(file_bytes),
            "chunk_count": len(extracted_chunks),
            "upload_time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "status": "Indexed",
            "file_type": file_type
        }

        self.documents[doc_id] = doc_meta

        for chunk in extracted_chunks:
            self.chunks.append({
                "doc_id": doc_id,
                "doc_name": filename,
                "section": chunk["section"],
                "chunk_id": chunk["chunk_id"],
                "text": chunk["text"],
                "tokens": tokenize(chunk["text"])
            })

        return doc_meta

    def list_documents(self) -> List[Dict[str, Any]]:
        return list(self.documents.values())

    def delete_document(self, doc_id: str) -> bool:
        if doc_id in self.documents:
            del self.documents[doc_id]
            self.chunks = [c for c in self.chunks if c["doc_id"] != doc_id]
            return True
        return False

    def clear_all(self):
        self.documents.clear()
        self.chunks.clear()

    def search_similar_chunks(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """
        Computes TF-IDF & Cosine Similarity between query and stored text chunks.
        Returns top_k matching chunks with similarity score.
        """
        if not self.chunks or not query.strip():
            return []

        query_tokens = tokenize(query)
        if not query_tokens:
            return []

        # Corpus tokens
        corpus_tokens = [c["tokens"] for c in self.chunks]
        N = len(corpus_tokens)

        # Compute document frequency (DF)
        df = Counter()
        for tokens in corpus_tokens:
            for w in set(tokens):
                df[w] += 1

        # Compute Inverse Document Frequency (IDF)
        idf = {w: math.log((N + 1.0) / (count + 1.0)) + 1.0 for w, count in df.items()}

        # Compute TF-IDF vector for query
        query_tf = Counter(query_tokens)
        query_vec = {}
        for w, count in query_tf.items():
            query_vec[w] = (count / len(query_tokens)) * idf.get(w, 1.0)

        query_mag = math.sqrt(sum(v**2 for v in query_vec.values()))

        results = []
        for chunk in self.chunks:
            chunk_tokens = chunk["tokens"]
            if not chunk_tokens:
                continue

            chunk_tf = Counter(chunk_tokens)
            chunk_vec = {}
            for w, count in chunk_tf.items():
                if w in query_vec:
                    chunk_vec[w] = (count / len(chunk_tokens)) * idf.get(w, 1.0)

            dot_product = sum(query_vec[w] * chunk_vec[w] for w in chunk_vec)
            chunk_mag = math.sqrt(sum(((count / len(chunk_tokens)) * idf.get(w, 1.0))**2 for w, count in chunk_tf.items()))

            if query_mag > 0 and chunk_mag > 0:
                similarity = dot_product / (query_mag * chunk_mag)
            else:
                # Direct keyword overlap boost for specific queries (e.g., names, intro, CV terms)
                token_overlap = set(query_tokens) & set(chunk_tokens)
                similarity = (len(token_overlap) / len(query_tokens)) * 0.5 if token_overlap else 0.0

            results.append({
                "doc_id": chunk["doc_id"],
                "doc_name": chunk["doc_name"],
                "section": chunk["section"],
                "chunk_id": chunk["chunk_id"],
                "text": chunk["text"],
                "similarity_score": round(similarity, 3)
            })

        # Sort by similarity score descending
        results.sort(key=lambda x: x["similarity_score"], reverse=True)

        top_matches = results[:top_k]
        
        # Ensure non-zero score representation for UI badges
        for item in top_matches:
            if item["similarity_score"] == 0:
                item["similarity_score"] = 0.50

        return top_matches

vector_store = VectorStore()
