
import React, { useState } from 'react';
import Header from '@/components/Header';
import TransactionForm from '@/components/TransactionForm';
import ResultsCard from '@/components/ResultsCard';
import TransactionHistory from '@/components/TransactionHistory';
import { TransactionAnalysis } from '@/utils/api';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentDescription, setCurrentDescription] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<TransactionAnalysis | null>(null);
  
  const handleAnalysisComplete = (description: string, result: TransactionAnalysis) => {
    setCurrentDescription(description);
    setAnalysisResult(result);
    
    // Scroll to results after a short delay
    setTimeout(() => {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const handleHistorySelect = (description: string, analysis: TransactionAnalysis) => {
    setCurrentDescription(description);
    setAnalysisResult(analysis);
    
    // Scroll to results after a short delay
    setTimeout(() => {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main className="mt-8">
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[80vh] rounded-lg border"
          >
            {/* Left panel - Form and Results (60%) */}
            <ResizablePanel defaultSize={60} minSize={40}>
              <div className="p-4 h-full overflow-auto">
                <TransactionForm 
                  onAnalysisComplete={handleAnalysisComplete} 
                  setIsLoading={setIsLoading}
                />
                
                {isLoading && (
                  <div className="mt-8 flex justify-center items-center" id="results-section">
                    <div className="text-center">
                      <div className="loader mx-auto">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                      <p className="mt-4 text-gray-600 animate-pulse-subtle">Analyzing transaction...</p>
                    </div>
                  </div>
                )}
                
                {!isLoading && analysisResult && (
                  <div id="results-section" className="mt-8">
                    <ResultsCard 
                      description={currentDescription || ''} 
                      analysis={analysisResult}
                    />
                  </div>
                )}
              </div>
            </ResizablePanel>
            
            {/* Resizable handle */}
            <ResizableHandle withHandle />
            
            {/* Right panel - Transaction History (40%) */}
            <ResizablePanel defaultSize={40} minSize={30}>
              <div className="p-4 h-full overflow-auto">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Transaction History</h2>
                <TransactionHistory onSelect={handleHistorySelect} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
    </div>
  );
};

export default Index;
