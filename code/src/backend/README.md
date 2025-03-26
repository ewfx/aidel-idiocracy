
# Transaction Analysis API

This is a FastAPI-based backend for the Transaction Analysis application.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the server:
   ```
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`.

## API Endpoints

- `POST /analyze` - Analyze a transaction
- `GET /transactions` - Get transaction history
- `GET /transaction/{transaction_id}` - Get a specific transaction with its analysis

## Database Schema

### Transactions Table
- `id` (TEXT) - Primary key
- `description` (TEXT) - Brief description of the transaction
- `timestamp` (TEXT) - When the transaction was analyzed
- `original_content` (TEXT) - The original text or file content that was analyzed

### Analyses Table
- `transaction_id` (TEXT) - Foreign key to transactions.id
- `analysis` (TEXT) - JSON string containing the analysis results

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
