
import React from 'react';
import { WIZARD_STEPS } from '../wizardConfig';

interface WizardProgressStepsProps {
  currentStep: number;
}

export const WizardProgressSteps: React.FC<WizardProgressStepsProps> = ({ currentStep }) => {
  // Convert currentStep number to step index for comparison
  const getCurrentStepIndex = () => {
    return Math.max(0, Math.min(currentStep - 1, WIZARD_STEPS.length - 1));
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {WIZARD_STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStepIndex === index 
                ? 'bg-crd-green text-crd-dark' 
                : currentStepIndex > index 
                  ? 'bg-crd-green/20 text-crd-green' 
                  : 'bg-editor-border text-crd-lightGray'
            }`}>
              {index + 1}
            </div>
            <div className="ml-3 hidden sm:block">
              <div className={`text-sm font-medium ${
                currentStepIndex === index ? 'text-crd-white' : 'text-crd-lightGray'
              }`}>
                {step.title}
              </div>
              <div className="text-xs text-crd-lightGray">{step.description}</div>
            </div>
            {index < WIZARD_STEPS.length - 1 && (
              <div className="hidden sm:block w-12 h-px bg-editor-border mx-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
