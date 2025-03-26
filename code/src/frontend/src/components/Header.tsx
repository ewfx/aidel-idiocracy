
import React from 'react';
import { ArrowRight } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-800 mb-3 animate-fade-in">
          <span>Transaction Analyzer</span>
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 animate-slide-up">
          Decode Your Transactions
        </h1>
        
        <p className="mt-3 max-w-2xl text-lg text-gray-600 animate-slide-up animation-delay-150">
          Enter a transaction description and let our AI analyze the details, risks, and patterns
        </p>
      </div>
    </header>
  );
};

export default Header;
