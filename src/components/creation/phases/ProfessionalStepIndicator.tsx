
import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
  stepDescriptions: string[];
}

export const ProfessionalStepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepNames,
  stepDescriptions
}) => {
  return (
    <div className="w-full bg-[#141416] border-b border-[#353945] py-6">
      <div className="max-w-6xl mx-auto px-6">
        {/* Progress Bar */}
        <div className="relative mb-8">
          <div className="h-1 bg-[#353945] rounded-full">
            <div 
              className="h-1 bg-gradient-to-r from-[#3772FF] to-[#F97316] rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="flex justify-between items-start">
          {stepNames.map((name, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-xs">
              {/* Step Circle */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-sm font-extrabold mb-3 transition-all duration-300
                ${index < currentStep 
                  ? 'bg-[#27AE60] text-white' 
                  : index === currentStep 
                    ? 'bg-[#3772FF] text-white' 
                    : 'bg-[#353945] text-[#777E90]'
                }
              `}>
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Step Info */}
              <div>
                <h4 className={`
                  text-sm font-extrabold uppercase tracking-wide mb-1
                  ${index <= currentStep ? 'text-[#FCFCFD]' : 'text-[#777E90]'}
                `}>
                  {name}
                </h4>
                <p className="text-xs text-[#777E90] leading-tight">
                  {stepDescriptions[index]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
