
from pydantic import BaseModel
from typing import List, Optional

class TransactionRequest(BaseModel):
    description: str
    file_content: Optional[str] = None

class Transaction(BaseModel):
    id: str
    description: str
    timestamp: str
    original_content: Optional[str] = None

class TransactionAnalysis(BaseModel):
    sender: str
    receiver: str
    amount: str
    currency: str
    transactionType: str
    transactionDate: str
    riskScore: int
    riskLevel: str
    confidenceScore: float
    category: str
    notes: List[str]

class AnalysisResponse(BaseModel):
    transaction: Transaction
    analysis: TransactionAnalysis
