
import React from 'react';
import { WizardLayout } from './wizard/WizardLayout';
import { useEnhancedWizard } from './wizard/hooks/useEnhancedWizard';
import { DEFAULT_TEMPLATES } from './wizard/wizardConfig';

interface EnhancedCardWizardProps {
  onComplete: (cardData: any) => void;
  onCancel: () => void;
}

export const EnhancedCardWizard = ({ onComplete, onCancel }: EnhancedCardWizardProps) => {
  const {
    currentStep,
    wizardState,
    cardEditor,
    handlers,
    isCreating,
    canProceed,
    handleNext,
    handlePrevious,
    handleComplete
  } = useEnhancedWizard({ onComplete });

  return (
    <WizardLayout
      currentStep={currentStep}
      wizardState={wizardState}
      cardData={cardEditor.cardData}
      templates={DEFAULT_TEMPLATES}
      handlers={handlers}
      isCreating={isCreating}
      canProceed={canProceed}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onComplete={handleComplete}
      onCancel={onCancel}
    />
  );
};
