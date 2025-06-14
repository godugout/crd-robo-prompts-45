
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system';

type Step = 'frameAndImage' | 'customize' | 'polish' | 'preview';

interface StepNavigationProps {
  currentStep: Step;
  canContinue: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  canContinue,
  onPrevious,
  onNext
}) => {
  return (
    <div className="flex justify-between items-center mt-8">
      <CRDButton
        variant="secondary"
        onClick={onPrevious}
        disabled={currentStep === 'frameAndImage'}
      >
        Previous
      </CRDButton>

      <CRDButton
        onClick={onNext}
        disabled={!canContinue || currentStep === 'preview'}
      >
        {currentStep === 'preview' ? 'Complete' : 'Continue'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </CRDButton>
    </div>
  );
};
