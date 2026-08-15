import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    @property
    def active_provider(self) -> str:
        if self.GEMINI_API_KEY:
            return "Google Gemini (Free/Pro)"
        elif self.GROQ_API_KEY:
            return "Groq AI (Free Llama 3)"
        elif self.OPENAI_API_KEY:
            return "OpenAI GPT"
        else:
            return "Local Smart RAG Engine (Zero API Key Fallback)"

settings = Settings()
