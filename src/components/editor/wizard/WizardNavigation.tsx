
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export const WizardNavigation = ({
  currentStep,
  totalSteps,
  isLastStep,
  isSaving,
  onCancel,
  onBack,
  onNext,
  onComplete
}: WizardNavigationProps) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-editor-border">
      <div className="flex space-x-3">
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-editor-border text-white hover:bg-editor-border"
        >
          Cancel
        </Button>
        {currentStep > 1 && (
          <Button
            onClick={onBack}
            variant="outline"
            className="border-editor-border text-white hover:bg-editor-border"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
      </div>

      <div className="flex space-x-3">
        {!isLastStep ? (
          <Button
            onClick={onNext}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={onComplete}
            disabled={isSaving}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            {isSaving ? 'Creating...' : 'Create Card'}
            <Check className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
