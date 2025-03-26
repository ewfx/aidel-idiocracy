
import React, { useState, useEffect } from 'react';
import { getTransactionHistory, getTransactionAnalysis, Transaction, TransactionAnalysis } from '@/utils/api';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface TransactionHistoryProps {
  onSelect: (description: string, analysis: TransactionAnalysis) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onSelect }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTransactionHistory();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        setError(error instanceof Error ? error.message : 'Failed to load transaction history');
        // Use local storage as a fallback
        const historyString = localStorage.getItem('transactionHistory');
        if (historyString) {
          setTransactions(JSON.parse(historyString));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
    
    // Refresh transaction history every 30 seconds
    const interval = setInterval(fetchTransactions, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleTransactionClick = async (transaction: Transaction) => {
    try {
      const analysis = await getTransactionAnalysis(transaction.id);
      
      if (analysis) {
        onSelect(transaction.description, analysis);
      } else {
        toast({
          title: "Error",
          description: "Could not load analysis for this transaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching transaction analysis:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load transaction analysis",
        variant: "destructive",
      });
      
      // Try fallback from localStorage
      const analysisString = localStorage.getItem(`analysis_${transaction.id}`);
      if (analysisString) {
        const analysis = JSON.parse(analysisString);
        onSelect(transaction.description, analysis);
      }
    }
  };

  // Format date for better readability
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-md"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No transaction history found</p>
        <p className="text-sm mt-2">Analyze a transaction to see it here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div 
          key={transaction.id}
          onClick={() => handleTransactionClick(transaction)}
          className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200"
        >
          <div className="font-medium truncate">{transaction.description || 'Unnamed Transaction'}</div>
          <div className="text-sm text-gray-500 mt-1">{formatDate(transaction.timestamp)}</div>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;
