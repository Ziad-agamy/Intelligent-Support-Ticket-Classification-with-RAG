from langchain_community.document_loaders import CSVLoader
from langchain_community.vectorstores import FAISS
from langchain_community.vectorstores.utils import DistanceStrategy
from app.config import settings
import os

class Knowledge():
    def __init__(self):
        self.__embed = settings.embedding_model
        self.__path = os.path.join("data", "clean.csv")

    def ingest_knowledge(self):
        loader = CSVLoader(
            file_path=self.__path,
            content_columns=["text"],
            metadata_columns=["answer", "type"]
        )

        docs = loader.load()

        vector_db = FAISS.from_documents(
            docs,
            self.__embed,
            distance_strategy=DistanceStrategy.COSINE
        )
        vector_db.save_local("faiss_index")
        
        return vector_db