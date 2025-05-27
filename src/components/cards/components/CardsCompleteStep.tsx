
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Plus, ArrowDown } from 'lucide-react';

interface CardsCompleteStepProps {
  selectedCards: number;
  onStartOver: () => void;
}

export const CardsCompleteStep: React.FC<CardsCompleteStepProps> = ({ selectedCards, onStartOver }) => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-400" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4">Success! 🎉</h3>
      
      <p className="text-crd-lightGray max-w-lg mx-auto mb-6">
        {selectedCards} new CRDs have been added to your collection! 
        You can view them in your card catalog below.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={onStartOver}
          className="bg-crd-green hover:bg-crd-green/80 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add More Cards
        </Button>
        
        <div className="flex items-center text-crd-lightGray">
          <ArrowDown className="w-4 h-4 mr-2" />
          <span className="text-sm">Check out your cards below</span>
        </div>
      </div>
    </div>
  );
};
