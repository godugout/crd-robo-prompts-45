
import React from 'react';
import { WizardHeader } from './components/WizardHeader';
import { WizardProgressSteps } from './components/WizardProgressSteps';
import { WizardStepContent } from './WizardStepContent';
import { WizardNavigation } from './components/WizardNavigation';

interface WizardLayoutProps {
  currentStep: number;
  wizardState: any;
  cardData: any;
  templates: any[];
  handlers: any;
  isCreating: boolean;
  canProceed: () => boolean;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  currentStep,
  wizardState,
  cardData,
  templates,
  handlers,
  isCreating,
  canProceed,
  onNext,
  onPrevious,
  onComplete,
  onCancel
}) => {
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
            cardData={cardData}
            templates={templates}
            handlers={handlers}
          />
        </div>

        <WizardNavigation
          currentStep={currentStep}
          canProceed={canProceed()}
          isCreating={isCreating}
          onPrevious={onPrevious}
          onNext={onNext}
          onComplete={onComplete}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};
