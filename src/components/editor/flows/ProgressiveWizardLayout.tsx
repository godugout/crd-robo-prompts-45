
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface ProgressiveWizardLayoutProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onBack: () => void;
  children: React.ReactNode;
}

export const ProgressiveWizardLayout: React.FC<ProgressiveWizardLayoutProps> = ({
  steps,
  currentStep,
  onStepChange,
  onBack,
  children
}) => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="border-b border-editor-border bg-editor-dark">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Create Your Card</h1>
              <p className="text-gray-400">Step {currentStep + 1} of {steps.length}</p>
            </div>
            
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-2">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isClickable = index <= currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => isClickable && onStepChange(index)}
                    disabled={!isClickable}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      isCompleted
                        ? 'bg-crd-green border-crd-green text-black'
                        : isActive
                        ? 'border-crd-green text-crd-green bg-transparent'
                        : 'border-gray-600 text-gray-400 bg-transparent'
                    } ${isClickable ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </button>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-2 transition-colors ${
                      isCompleted ? 'bg-crd-green' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Step Info */}
          <div className="text-center mt-4">
            <h2 className="text-xl font-semibold text-white">{steps[currentStep]?.title}</h2>
            <p className="text-gray-400 text-sm">{steps[currentStep]?.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto h-[calc(100vh-200px)]">
        {children}
      </div>
    </div>
  );
};
