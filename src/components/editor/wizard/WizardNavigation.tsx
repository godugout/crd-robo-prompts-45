
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Sparkles, Save } from 'lucide-react';

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
  canSkipToEnd
}: WizardNavigationProps) => {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-editor-border">
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-editor-border text-crd-lightGray hover:text-crd-white"
        >
          Cancel
        </Button>
        
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={onBack}
            className="border-editor-border text-crd-lightGray hover:text-crd-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Skip to end option when AI analysis is complete */}
        {canSkipToEnd && currentStep < totalSteps && (
          <Button
            variant="outline"
            onClick={() => {
              // Skip to the last step
              for (let i = currentStep; i < totalSteps - 1; i++) {
                onNext();
              }
            }}
            className="border-crd-green text-crd-green hover:bg-crd-green hover:text-crd-dark"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Skip to Publish
          </Button>
        )}

        {isLastStep ? (
          <Button
            onClick={onComplete}
            disabled={isSaving}
            className="bg-crd-green hover:bg-crd-green/90 text-crd-dark min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Card
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="bg-crd-green hover:bg-crd-green/90 text-crd-dark"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
