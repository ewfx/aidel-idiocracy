import sys
import os
from .model import analyze_transaction

def analyze_transaction_text(description: str, file_content: str = None):
    # Use file content if provided and description is empty
    content_to_analyze = description
    
    if not description and file_content:
        content_to_analyze = file_content
    elif file_content:
        content_to_analyze = file_content
    
    lowerDescription = content_to_analyze.lower()
   
    return analyze_transaction(lowerDescription)