
import React from 'react';
import { TransactionAnalysis } from '@/utils/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Check, Info } from 'lucide-react';

interface ResultsCardProps {
  description: string;
  analysis: TransactionAnalysis | null;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ description, analysis }) => {
  if (!analysis) return null;
  
  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-analytics-low text-white hover:bg-analytics-low/90';
      case 'medium': return 'bg-analytics-medium text-white hover:bg-analytics-medium/90';
      case 'high': return 'bg-analytics-high text-white hover:bg-analytics-high/90';
      default: return '';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <Check className="h-4 w-4" />;
      case 'medium': return <Info className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 animate-fade-in animation-delay-500">
      <Card className="backdrop-blur-sm bg-white/60 shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-brand-50 to-transparent pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Transaction Analysis</CardTitle>
              <CardDescription className="text-gray-600 mt-1 max-w-2xl truncate">
                {description}
              </CardDescription>
            </div>
            <Badge 
              className={`ml-2 ${getRiskBadgeVariant(analysis.riskLevel)} flex items-center gap-1`}
            >
              {getRiskIcon(analysis.riskLevel)}
              {analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)} Risk
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Sender</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{analysis.sender}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Receiver</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{analysis.receiver}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {analysis.amount} {analysis.currency}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="mt-1 text-gray-900">
                  {new Date(analysis.transactionDate).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Transaction Type</h3>
                <p className="mt-1 text-gray-900">{analysis.transactionType}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 text-gray-900">{analysis.category}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Risk Score</h3>
                <div className="mt-1 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${analysis.riskScore}%`,
                        backgroundColor: analysis.riskLevel === 'low' 
                          ? '#10b981' 
                          : analysis.riskLevel === 'medium' 
                            ? '#f59e0b' 
                            : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{analysis.riskScore}%</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Confidence Score</h3>
                <div className="mt-1 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-brand-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${analysis.confidenceScore}*100%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{analysis.confidenceScore*100}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
            <ul className="space-y-1">
              {analysis.notes.map((note, index) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-400 mt-1.5 mr-2"></span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsCard;
