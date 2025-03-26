
from fastapi import APIRouter, HTTPException, Depends
import sqlite3
import uuid
from datetime import datetime
import json
from typing import List

from .models import TransactionRequest, Transaction, AnalysisResponse
from .database import get_db
from .analyzer import analyze_transaction_text

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
def analyze_transaction(request: TransactionRequest, db: sqlite3.Connection = Depends(get_db)):
    # Create new transaction ID
    transaction_id = str(uuid.uuid4())
    
    # Determine original content to store
    original_content = request.file_content if request.file_content else request.description
    
    # Generate analysis
    analysis = analyze_transaction_text(
        request.description, 
        request.file_content
    )
    
    # Create transaction record
    description = request.description
    if not description and request.file_content:
        description = "File upload: " + request.file_content[:50] + "..."
    
    transaction = {
        "id": transaction_id,
        "description": description,
        "timestamp": datetime.now().isoformat(),
        "original_content": original_content
    }
    
    # Save to database
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO transactions (id, description, timestamp, original_content) VALUES (?, ?, ?, ?)",
        (transaction["id"], transaction["description"], transaction["timestamp"], transaction["original_content"])
    )
    
    cursor.execute(
        "INSERT INTO analyses (transaction_id, analysis) VALUES (?, ?)",
        (transaction["id"], json.dumps(analysis))
    )
    
    db.commit()
    
    return {
        "transaction": transaction,
        "analysis": analysis
    }

@router.get("/transactions", response_model=List[Transaction])
def get_transactions(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 10")
    rows = cursor.fetchall()
    
    return [dict(row) for row in rows]

@router.get("/transaction/{transaction_id}", response_model=AnalysisResponse)
def get_transaction(transaction_id: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    
    # Get transaction
    cursor.execute("SELECT * FROM transactions WHERE id = ?", (transaction_id,))
    transaction_row = cursor.fetchone()
    
    if not transaction_row:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    transaction = dict(transaction_row)
    
    # Get analysis
    cursor.execute("SELECT analysis FROM analyses WHERE transaction_id = ?", (transaction_id,))
    analysis_row = cursor.fetchone()
    
    if not analysis_row:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    analysis = json.loads(analysis_row["analysis"])
    
    return {
        "transaction": transaction,
        "analysis": analysis
    }
