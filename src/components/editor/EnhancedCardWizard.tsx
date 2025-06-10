
import React from 'react';
import { DEFAULT_TEMPLATES } from './wizard/wizardConfig';
import { WizardStepContent } from './wizard/WizardStepContent';
import { WizardHeader } from './wizard/components/WizardHeader';
import { WizardProgressSteps } from './wizard/components/WizardProgressSteps';
import { WizardNavigation } from './wizard/components/WizardNavigation';
import { useEnhancedWizard } from './wizard/hooks/useEnhancedWizard';

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
    <div className="min-h-screen bg-crd-darkest">
      <WizardHeader onCancel={onCancel} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WizardProgressSteps currentStep={currentStep} />

        {/* Step Content */}
        <div className="bg-editor-dark rounded-xl border border-editor-border p-8">
          <WizardStepContent
            currentStep={currentStep}
            wizardState={wizardState}
            cardData={cardEditor.cardData}
            templates={DEFAULT_TEMPLATES}
            handlers={handlers}
          />
        </div>

        <WizardNavigation
          currentStep={currentStep}
          canProceed={canProceed()}
          isCreating={isCreating}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onComplete={handleComplete}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};
