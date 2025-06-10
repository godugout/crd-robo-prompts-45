
import React from 'react';
import { Button } from '@/components/ui/button';
import { WIZARD_STEPS } from '../wizardConfig';

interface WizardNavigationProps {
  currentStep: number;
  canProceed: boolean;
  isCreating: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  canProceed,
  isCreating,
  onPrevious,
  onNext,
  onComplete,
  onCancel
}) => {
  // Only show navigation for steps that need manual navigation
  if (currentStep < 3) {
    return null;
  }

  return (
    <div className="flex justify-between mt-8">
      <Button
        onClick={onPrevious}
        disabled={currentStep <= 1}
        variant="outline"
        className="border-editor-border text-crd-white hover:bg-editor-border"
      >
        Previous
      </Button>
      
      <div className="flex gap-4">
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-red-500 text-red-400 hover:bg-red-500/10"
        >
          Cancel
        </Button>
        
        {currentStep === WIZARD_STEPS.length ? (
          <Button
            onClick={onComplete}
            disabled={isCreating}
            className="bg-crd-green hover:bg-crd-green/90 text-crd-dark min-w-24"
          >
            {isCreating ? 'Creating...' : 'Create Card'}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="bg-crd-green hover:bg-crd-green/90 text-crd-dark"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
