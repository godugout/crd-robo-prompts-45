
import React from 'react';
import { Typography } from '@/components/ui/design-system';

type Step = 'frameAndImage' | 'customize' | 'polish' | 'preview';

interface StepProgressIndicatorProps {
  currentStep: Step;
  getStepDescription: () => string;
}

export const StepProgressIndicator: React.FC<StepProgressIndicatorProps> = ({
  currentStep,
  getStepDescription
}) => {
  const steps: Step[] = ['frameAndImage', 'customize', 'polish', 'preview'];

  return (
    <>
      {/* Header */}
      <div className="text-center mb-12">
        <Typography as="h2" variant="h1" className="mb-4">
          Create Your Card in 4 Easy Steps
        </Typography>
        <Typography variant="body" className="text-crd-lightGray text-lg max-w-2xl mx-auto">
          {getStepDescription()}
        </Typography>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-4">
          {steps.map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                stepName === currentStep 
                  ? 'bg-crd-green text-black' 
                  : index < steps.indexOf(currentStep)
                  ? 'bg-crd-green text-black'
                  : 'bg-crd-mediumGray text-gray-400'
              }`}>
                {index + 1}
              </div>
              {index < 3 && (
                <div className={`w-12 h-1 mx-2 transition-colors ${
                  index < steps.indexOf(currentStep) 
                    ? 'bg-crd-green' 
                    : 'bg-crd-mediumGray'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
