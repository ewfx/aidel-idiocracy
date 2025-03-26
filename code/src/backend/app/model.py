import os
import getpass
import configparser
from langchain.retrievers import EnsembleRetriever
from langchain.chat_models import init_chat_model
from langchain_community.retrievers import WikipediaRetriever
import requests
from langchain.schema.document import Document
from langchain.schema.retriever import BaseRetriever
from langchain.document_loaders import TextLoader
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

# Load API keys from model.properties
config = configparser.ConfigParser()
config.read(os.path.join(os.path.dirname(__file__), "model.properties"))

os.environ["GROQ_API_KEY"] = config.get("API_KEYS", "GROQ_API_KEY", fallback="")
os.environ["OPENSANCTIONS_API_KEY"] = config.get("API_KEYS", "OPENSANCTIONS_API_KEY", fallback="")

model = init_chat_model("deepseek-r1-distill-llama-70b", model_provider="groq")

class OpenSanctionsRetriever(BaseRetriever):
    def _get_relevant_documents(self, query):
        """
        Queries OpenSanctions API and returns relevant documents.
        """
        person_name = ""
        company_name = ""
        api_key = "3b9678eb2e0dff14c268b43f7acf4798"
        if "Company:" in query or "Person:" in query:
            parts = query.split(",")
            for part in parts:
                if "Company:" in part:
                    company_name = part.split("Company:")[-1].strip()
                    print(company_name)
                elif "Person:" in part:
                    person_name = part.split("Person:")[-1].strip()
                    print(person_name)

        headers = {"Authorization": api_key}
        query = {
            "queries": {
                "query-A": {"schema": "Person", "properties": {"name": [person_name]}},
                "query-B": {"schema": "Company", "properties": {"name": [company_name]}},
            }
        }
        response = requests.post(
            "https://api.opensanctions.org/match/default", headers=headers, json=query
        )
        response.raise_for_status()
        response_json = response.json()

        documents = []
        for query_id, query_response in response_json["responses"].items():
            for result in query_response["results"]:
                entity_topics = set(result["properties"].get("topics", []))
                entity_datasets = set(result.get("datasets", []))

                name_to_store_page_content = result["properties"].get("name")
                entity_info = {
                    "id": result["id"],
                    "name": result["properties"].get("name", []),
                    "match": result["match"],
                    "topics": list(entity_topics),
                    "datasets": list(entity_datasets),
                }
                doc = Document(
                    page_content=f"Sanctions data for {name_to_store_page_content}",
                    metadata=entity_info,
                )
                documents.append(doc)
        return documents

# Get the absolute path of the Instructions.md file
instructions_path = os.path.join(os.path.dirname(__file__), "aiml.md")

# Use the absolute path in the TextLoader
loader = TextLoader(instructions_path)
docs = loader.load()

embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

vectorstore = FAISS.from_documents(docs, embedding_model)

instructions_retriever = vectorstore.as_retriever()
OpenSanctions_retriever = OpenSanctionsRetriever()
wiki_retriever = WikipediaRetriever()

ensemble_retriever = EnsembleRetriever(
    retrievers=[wiki_retriever, OpenSanctions_retriever, instructions_retriever],
    weights=[0.25, 0.5, 0.25],
)

prompt = ChatPromptTemplate.from_template(
    """
    You are a researcher who has to research about the riskiness of the transactions. Use the instructions given to you and output a json object
    wrapped in a string based on it. Give only the json object with the following keys:
    Example:
    "sender": "Acme Corporation",
    "receiver": "SovCo Capital Partners",
    "amount": "N/A",
    "currency": "N/A",
    "transactionType": "Funds Transfer",
    "transactionDate": "N/A",
    "riskScore": 65,
    "riskLevel": "Moderate Risk",
    "confidenceScore": 0.95,
    "category": "Corporation",
    "notes": [
        "Entity Type: Corporation, Corporation",
        "Reason: SovCo Capital Partners is not on sanctions list but an entity of interest. It is owned by Russian businessmen and related to Socombank PJSC, a sanctioned entity.",
        "Conclusion: The transaction involves SovCo Capital Partners, which is linked to sanctioned entities but not directly listed. The moderate risk score of 0.65 indicates the need for further review but not immediate escalation."
    ]

    Context: {context}
    Transaction: {transaction}
    """
)

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

chain_test = (
    {"context": ensemble_retriever | format_docs, "transaction": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

import json
import re

def analyze_transaction(prompt):
    """
    Analyzes a transaction using the chain_test pipeline.
    Processes the output to extract <think> text and append it to the notes.
    """
    raw_output = chain_test.invoke(prompt)
    
    # Extract the <think> text
    think_match = re.search(r"<think>(.*?)</think>", raw_output, re.DOTALL)
    think_text = think_match.group(1).strip() if think_match else ""

    # Extract the JSON part
    json_match = re.search(r"```json\n(.*?)\n```", raw_output, re.DOTALL)
    json_text = json_match.group(1).strip() if json_match else "{}"
    
    # Parse and modify the JSON
    transaction_data = json.loads(json_text)
    if think_text:
        transaction_data["notes"].append(f"Thought process: {think_text}")
    
    return transaction_data

if __name__ == "__main__":
    print(analyze_transaction())

