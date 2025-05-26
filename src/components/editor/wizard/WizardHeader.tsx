
import React from 'react';

interface WizardHeaderProps {
  aiAnalysisComplete: boolean;
}

export const WizardHeader = ({ aiAnalysisComplete }: WizardHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">Create New Card</h1>
      <p className="text-crd-lightGray">
        Upload your image and let AI suggest the perfect details
        {aiAnalysisComplete && <span className="text-crd-green ml-2">✨ AI analysis complete!</span>}
      </p>
    </div>
  );
};
