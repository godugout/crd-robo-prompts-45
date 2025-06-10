
import React from 'react';
import { Upload, Eye, Settings } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Upload & Preview', icon: Upload, description: 'Add your images' },
    { number: 2, title: 'Review & Mark', icon: Eye, description: 'Approve or mark for editing' },
    { number: 3, title: 'Adjust & Finalize', icon: Settings, description: 'Fine-tune your cards' }
  ];

  return (
    <div className="flex justify-center">
      <div className="flex items-center space-x-8">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const IconComponent = step.icon;
          
          return (
            <div key={step.number} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors
                  ${isCompleted 
                    ? 'bg-crd-green border-crd-green text-black' 
                    : isActive 
                    ? 'border-crd-green text-crd-green bg-crd-green/10' 
                    : 'border-crd-mediumGray text-crd-lightGray'
                  }
                `}>
                  {isCompleted ? (
                    <span className="font-bold">✓</span>
                  ) : (
                    <IconComponent className="w-5 h-5" />
                  )}
                </div>
                
                {/* Step Info */}
                <div className="text-center mt-2">
                  <div className={`font-medium text-sm ${
                    isActive ? 'text-crd-green' : isCompleted ? 'text-white' : 'text-crd-lightGray'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-crd-lightGray mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`
                  w-16 h-0.5 mx-4 mb-8 transition-colors
                  ${currentStep > step.number ? 'bg-crd-green' : 'bg-crd-mediumGray'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
