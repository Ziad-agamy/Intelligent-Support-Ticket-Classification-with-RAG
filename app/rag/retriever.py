from langchain_core.documents.base import Document
from typing import List
from scripts.ingest_knowledge import Knowledge
from langchain_community.vectorstores import FAISS
from langchain_community.retrievers import BM25Retriever
from langchain_classic.retrievers import EnsembleRetriever, ContextualCompressionRetriever
from app.config import settings
import os

class Retriever():
    def __init__(self):
        self.__embed = settings.embedding_model
        self.__compressor = settings.rerank_model
        self.__knowledge_path = "faiss_index"
        self.__retriever = None
    
    def __get_retriever(self):
        if os.path.exists(self.__knowledge_path):
            print("loading knowledge...")

            vector_db = FAISS.load_local(
                self.__knowledge_path,
                self.__embed,
                allow_dangerous_deserialization=True
            )

        else:
            print("creating knowledge...")
            kb = Knowledge()
            vector_db = kb.ingest_knowledge()

        faiss_retriever = vector_db.as_retriever(search_kwargs={"k": 10})

        all_docs = list(vector_db.docstore._dict.values())
        bm25_retriever = BM25Retriever.from_documents(all_docs)
        bm25_retriever.k = 10

        hybrid_retriever = EnsembleRetriever(
            retrievers=[bm25_retriever, faiss_retriever],
            weights=[0.3, 0.7]
        )

        return ContextualCompressionRetriever(
            base_compressor=self.__compressor,
            base_retriever=hybrid_retriever
        )

    async def retrieve_docs(self, query: str, category: str = None) -> List[Document]:
        if self.__retriever is None:
            self.__retriever = self.__get_retriever()
        
        if category:
            self.__retriever.base_retriever.retrievers[1].search_kwargs["filter"] = {"type": category}
        else:
            self.__retriever.base_retriever.retrievers[1].search_kwargs.pop("filter", None)

        return await self.__retriever.ainvoke(query)