from langchain_cohere import CohereRerank
from langchain_ollama import OllamaEmbeddings
from pydantic_settings import BaseSettings, SettingsConfigDict
from langchain_groq import ChatGroq

class Settings(BaseSettings):
    GROQ_API_KEY: str
    COHERE_API_KEY: str
    PGHOST: str
    PGPORT: int
    PGDATABASE: str
    PGUSER: str
    PGPASSWORD: str

    model_config = SettingsConfigDict(
        env_file="./.env",
        env_ignore_empty=True,
        extra="ignore"
    )

    @property
    def database_url(self):
        return f"postgresql+asyncpg://{self.PGUSER}:{self.PGPASSWORD}@{self.PGHOST}:{self.PGPORT}/{self.PGDATABASE}"

    @property
    def embedding_model(self):
        return OllamaEmbeddings(model="qwen3-embedding:0.6b")

    @property
    def chat_model(self):
        return ChatGroq(model="llama-3.3-70b-versatile", api_key=self.GROQ_API_KEY)

    @property
    def rerank_model(self):
        return CohereRerank(model="rerank-english-v3.0", top_n=5, cohere_api_key=self.COHERE_API_KEY)

settings = Settings()