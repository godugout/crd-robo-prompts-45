
import React from 'react';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onStepClick?: (step: number) => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
  onStepClick
}) => {
  return (
    <div className="px-4 py-3 border-b border-white/10">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isClickable = stepNumber <= currentStep && onStepClick;

          return (
            <div key={stepNumber} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable}
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                  isCompleted
                    ? 'bg-crd-green border-crd-green text-black'
                    : isActive
                    ? 'border-crd-green text-crd-green bg-transparent'
                    : 'border-gray-600 text-gray-400 bg-transparent'
                } ${isClickable ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-semibold">{stepNumber}</span>
                )}
              </button>
              
              <span className={`ml-2 text-sm font-medium ${
                isActive ? 'text-white' : 'text-gray-400'
              }`}>
                {label}
              </span>
              
              {index < stepLabels.length - 1 && (
                <div className={`mx-4 h-0.5 w-8 ${
                  isCompleted ? 'bg-crd-green' : 'bg-gray-600'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
