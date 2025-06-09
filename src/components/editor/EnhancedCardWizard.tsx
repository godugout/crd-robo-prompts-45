
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WizardStepIndicator } from './wizard/WizardStepIndicator';
import { WizardHeader } from './wizard/WizardHeader';
import { WizardNavigation } from './wizard/WizardNavigation';
import { PhotoUploadStep } from './wizard/PhotoUploadStep';
import { TemplateSelectionStep } from './wizard/TemplateSelectionStep';
import { CardDetailsStep } from './wizard/CardDetailsStep';
import { PublishingOptionsStep } from './wizard/PublishingOptionsStep';
import { useWizardState } from './wizard/useWizardState';
import { WIZARD_STEPS } from './wizard/wizardConfig';
import type { EnhancedCardWizardProps } from './wizard/types';

export const EnhancedCardWizard = ({ onComplete, onCancel }: EnhancedCardWizardProps) => {
  const { wizardState, cardData, handlers, isSaving, templates, updateCardField } = useWizardState(onComplete);

  const renderStepContent = () => {
    switch (wizardState.currentStep) {
      case 1:
        return (
          <PhotoUploadStep
            selectedPhoto={wizardState.selectedPhoto}
            onPhotoSelect={handlers.handlePhotoSelect}
            onAnalysisComplete={handlers.handleAiAnalysis}
          />
        );
      case 2:
        return (
          <TemplateSelectionStep
            templates={templates}
            selectedTemplate={wizardState.selectedTemplate}
            onTemplateSelect={handlers.handleTemplateSelect}
          />
        );
      case 3:
        return (
          <CardDetailsStep
            cardData={cardData}
            onFieldUpdate={updateCardField}
            onCreatorAttributionUpdate={handlers.updateCreatorAttribution}
            aiAnalysisComplete={wizardState.aiAnalysisComplete}
          />
        );
      case 4:
        return (
          <PublishingOptionsStep
            publishingOptions={cardData.publishing_options}
            selectedTemplate={wizardState.selectedTemplate}
            onPublishingUpdate={handlers.updatePublishingOptions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-editor-darker p-6">
      <div className="max-w-4xl mx-auto">
        <WizardHeader aiAnalysisComplete={wizardState.aiAnalysisComplete} />
        
        <WizardStepIndicator steps={WIZARD_STEPS} currentStep={wizardState.currentStep} />

        <Card className="bg-editor-dark border-editor-border">
          <CardContent className="p-8">
            {renderStepContent()}

            <WizardNavigation
              currentStep={wizardState.currentStep}
              totalSteps={4}
              isLastStep={wizardState.currentStep === 4}
              isSaving={isSaving}
              onCancel={onCancel}
              onBack={handlers.handleBack}
              onNext={handlers.handleNext}
              onComplete={handlers.handleComplete}
              canSkipToEnd={wizardState.aiAnalysisComplete && !!wizardState.selectedTemplate}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
