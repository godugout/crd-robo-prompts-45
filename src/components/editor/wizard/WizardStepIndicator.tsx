
import React from 'react';
import { Check } from 'lucide-react';

interface WizardStep {
  number: number;
  title: string;
  description: string;
}

interface WizardStepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
}

export const WizardStepIndicator = ({ steps, currentStep }: WizardStepIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step.number < currentStep 
                    ? 'bg-crd-green text-crd-dark' 
                    : step.number === currentStep
                    ? 'bg-crd-green text-crd-dark shadow-lg'
                    : 'bg-editor-border text-crd-lightGray'
                }`}>
                  {step.number < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${
                    step.number === currentStep ? 'text-crd-white' : 'text-crd-lightGray'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-crd-lightGray">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 mx-4 transition-all ${
                  step.number < currentStep ? 'bg-crd-green' : 'bg-editor-border'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
