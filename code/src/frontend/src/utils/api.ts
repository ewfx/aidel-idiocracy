
// Types
export interface Transaction {
  id: string;
  description: string;
  timestamp: string;
  originalContent?: string;
}

export interface TransactionAnalysis {
  sender: string;
  receiver: string;
  amount: string;
  currency: string;
  transactionType: string;
  transactionDate: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidenceScore: number;
  category: string;
  notes: string[];
}

// Default API URL
const API_URL = "http://localhost:8000";

// Check if backend is running
// const checkBackendConnection = async (): Promise<boolean> => {
//   try {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
//     const response = await fetch(`${API_URL}`, {
//       method: 'HEAD',
//       signal: controller.signal
//     });
    
//     clearTimeout(timeoutId);
//     return response.ok;
//   } catch (error) {
//     console.error('Backend connection check failed:', error);
//     return false;
//   }
// };

// Function to analyze a transaction using the Python backend
export const analyzeTransaction = async (
  description: string, 
  file: File | null = null
): Promise<TransactionAnalysis> => {
  try {
    // // Check backend connection first
    // const isBackendRunning = await checkBackendConnection();
    // if (!isBackendRunning) {
    //   throw new Error(`Failed to connect to server at localhost:8000. Please ensure the backend server is running.`);
    // }
    
    // Process file if provided
    let fileContent = null;
    if (file) {
      fileContent = await readFileAsText(file);
    }
    
    // Prepare request data
    const requestData = {
      description,
      file_content: fileContent
    };
    
    // Make API request
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error('Error analyzing transaction:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to connect to server at localhost:8000. Please ensure the backend server is running.`);
  }
};

// Helper to read file as text
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        resolve(content);
      } catch (error) {
        reject(new Error('Failed to parse file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

// Get transaction history
export const getTransactionHistory = async (): Promise<Transaction[]> => {
  try {
    // Check backend connection first
    // const isBackendRunning = await checkBackendConnection();
    // if (!isBackendRunning) {
    //   throw new Error(`Failed to connect to server at localhost:8000. Please ensure the backend server is running.`);
    // }
    
    const response = await fetch(`${API_URL}/transactions`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to connect to server at localhost:8000. Please ensure the backend server is running.`);
  }
};

// Get analysis for a specific transaction
export const getTransactionAnalysis = async (id: string): Promise<TransactionAnalysis | null> => {
  try {
    // Check backend connection first
    // const isBackendRunning = await checkBackendConnection();
    // if (!isBackendRunning) {
    //   throw new Error(`Failed to connect to server at localhost:8000. Please ensure the backend server is running.`);
    // }
    
    const response = await fetch(`${API_URL}/transaction/${id}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error('Error fetching transaction analysis:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to connect to server at localhost:8000. Please ensure the backend server is running.`);
  }
};

// Save transaction to history is no longer needed as backend handles persistence
