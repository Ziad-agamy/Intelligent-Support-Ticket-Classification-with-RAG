
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import SystemMessage, HumanMessage
from app.config import settings
from app.rag.retriever import Retriever
import os


class Generator():
    def __init__(self):
        self.__llm = settings.chat_model
        prompt_path = os.path.join("app", "prompts", "generator_prompt.md")
        with open(prompt_path, 'r', encoding='utf-8') as f:
            self.__system_prompt = f.read()

    async def generate(self, query: str, category: str = None) -> str:
        retriever = Retriever()
        docs = await retriever.retrieve_docs(query, category)

        context = "\n\n---\n\n".join(doc.metadata.get('answer', 'No answer available in knowledge base.') for doc in docs)

        messages = [
            SystemMessage(content=self.__system_prompt),
            HumanMessage(content=f"Context from Knowledge Base:\n{context}\n\nUser's Current Query:\n{query}")
        ]

        chain = self.__llm | StrOutputParser()
        return await chain.ainvoke(messages)
