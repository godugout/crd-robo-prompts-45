
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
  canSkipToEnd?: boolean;
}

export const WizardNavigation = ({
  currentStep,
  totalSteps,
  isLastStep,
  isSaving,
  onCancel,
  onBack,
  onNext,
  onComplete,
  canSkipToEnd = false
}: WizardNavigationProps) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-editor-border">
      <div className="flex items-center gap-3">
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

      <div className="flex items-center gap-3">
        {canSkipToEnd && currentStep < totalSteps && (
          <Button
            onClick={() => {
              // Skip to final step
              while (currentStep < totalSteps) {
                onNext();
              }
            }}
            className="bg-crd-green/20 hover:bg-crd-green/30 text-crd-green border border-crd-green/30"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Skip to Preview
          </Button>
        )}
        
        {isLastStep ? (
          <Button
            onClick={onComplete}
            disabled={isSaving}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            {isSaving ? (
              'Creating...'
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Create Card
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
