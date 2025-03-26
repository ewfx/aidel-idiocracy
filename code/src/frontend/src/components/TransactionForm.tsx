
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { analyzeTransaction, TransactionAnalysis } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { Send, Upload, ToggleLeft, ToggleRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TransactionFormProps {
  onAnalysisComplete: (description: string, result: TransactionAnalysis) => void;
  setIsLoading: (loading: boolean) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAnalysisComplete, setIsLoading }) => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [useFileUpload, setUseFileUpload] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({
        title: "File Selected",
        description: `${e.target.files[0].name} has been selected.`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() && (!file || !useFileUpload)) {
      toast({
        title: "Input Required",
        description: "Please enter a transaction description or upload a file to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await analyzeTransaction(description, useFileUpload ? file : null);
      onAnalysisComplete(description || (file && useFileUpload ? file.name : ''), result);
      
      toast({
        title: "Analysis Complete",
        description: "Transaction has been successfully analyzed.",
      });
    } catch (error) {
      console.error('Failed to analyze transaction:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "We couldn't analyze your transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 w-full animate-fade-in animation-delay-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">Transaction Details</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-end space-x-2">
          <span className="text-sm text-gray-500">Text</span>
          <div className="flex items-center" onClick={() => setUseFileUpload(!useFileUpload)}>
            {useFileUpload ? (
              <ToggleRight className="h-6 w-6 text-brand-600 cursor-pointer" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-gray-400 cursor-pointer" />
            )}
          </div>
          <span className="text-sm text-gray-500">File</span>
        </div>

        {!useFileUpload ? (
          <div>
            <label htmlFor="description" className="text-sm font-medium block mb-2 text-gray-700">
              Transaction Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter your transaction description (e.g., 'John sent $500 to ABC Corp for consulting services')"
              className="w-full min-h-[120px] bg-white bg-opacity-50 border-gray-200 focus:border-brand-500 focus:ring-brand-500 transition-all duration-300"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        ) : (
          <div className="w-full">
            <label htmlFor="file-upload" className="text-sm font-medium block mb-2 text-gray-700">
              Upload Transaction File
            </label>
            <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white bg-opacity-50 border-2 border-gray-200 border-dashed rounded-md appearance-none cursor-pointer hover:border-brand-500 focus:outline-none">
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-6 h-6 text-gray-500" />
                <span className="font-medium text-sm text-gray-600">
                  {file ? file.name : 'Drop files or click to upload'}
                </span>
                {file && <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>}
              </div>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".txt,.csv,.json,.xlsx"
              />
            </label>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-300 transform hover:translate-y-[-1px] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50 flex items-center justify-center gap-2"
        >
          <span>Analyze Transaction</span>
          <Send size={16} className="opacity-80" />
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
