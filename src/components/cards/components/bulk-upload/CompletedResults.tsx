
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface CompletedResultsProps {
  completedCount: number;
  onAdvance: () => void;
}

export const CompletedResults: React.FC<CompletedResultsProps> = ({ 
  completedCount, 
  onAdvance 
}) => {
  return (
    <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-600/30 p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        
        <h3 className="text-2xl font-semibold text-white mb-2">
          Processing Complete!
        </h3>
        
        <p className="text-crd-lightGray mb-6">
          Successfully processed {completedCount} images with card detection
        </p>
        
        <Button 
          onClick={onAdvance}
          className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
          size="lg"
        >
          Review Detected Cards
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </Card>
  );
};
