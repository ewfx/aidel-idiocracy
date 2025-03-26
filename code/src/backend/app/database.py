
import sqlite3
from fastapi import Depends

def get_db():
    conn = sqlite3.connect("transactions.db")
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = sqlite3.connect("transactions.db")
    cursor = conn.cursor()
    
    # Create transactions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        description TEXT,
        timestamp TEXT,
        original_content TEXT
    )
    """)
    
    # Create analyses table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analyses (
        transaction_id TEXT,
        analysis TEXT,
        FOREIGN KEY (transaction_id) REFERENCES transactions (id)
    )
    """)
    
    conn.commit()
    conn.close()
