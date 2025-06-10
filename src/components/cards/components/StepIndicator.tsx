
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Upload', description: 'Upload images' },
    { number: 2, label: 'Review', description: 'Review & mark cards' },
    { number: 3, label: 'Adjust', description: 'Fine-tune extractions' },
    { number: 4, label: 'Collection', description: 'Choose collection' },
    { number: 5, label: 'Complete', description: 'Cards saved' }
  ];

  return (
    <div className="bg-editor-dark rounded-lg p-6 border border-crd-mediumGray/20">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = currentStep > step.number;
          const isDisabled = currentStep < step.number;
          
          return (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center ${
                isActive ? 'text-crd-green' : 
                isCompleted ? 'text-white' : 'text-crd-lightGray'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-medium ${
                  isActive ? 'border-crd-green bg-crd-green text-black' :
                  isCompleted ? 'border-white bg-white text-black' : 
                  'border-crd-mediumGray'
                }`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-3">
                  <div className="font-medium text-sm">{step.label}</div>
                  <div className="text-xs opacity-75">{step.description}</div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`h-0.5 w-16 mx-4 ${
                  isCompleted ? 'bg-crd-green' : 'bg-crd-mediumGray'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
