
import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';

interface WizardHeaderProps {
  aiAnalysisComplete: boolean;
}

export const WizardHeader = ({ aiAnalysisComplete }: WizardHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-crd-green to-crd-blue rounded-full flex items-center justify-center">
          <Wand2 className="w-6 h-6 text-crd-white" />
        </div>
        <h1 className="text-3xl font-bold text-crd-white">Create Your Card</h1>
      </div>
      
      <p className="text-crd-lightGray text-lg max-w-2xl mx-auto">
        Upload an image and our AI will help you create a stunning card in minutes. 
        Follow the steps below to customize every detail.
      </p>

      {aiAnalysisComplete && (
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-crd-green/10 border border-crd-green/20 rounded-full">
          <Sparkles className="w-4 h-4 text-crd-green" />
          <span className="text-crd-green text-sm font-medium">AI Analysis Complete</span>
        </div>
      )}
    </div>
  );
};
