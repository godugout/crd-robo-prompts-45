

import React from 'react';
import { PhotoUploadStep } from './PhotoUploadStep';
import { TemplateSelectionStep } from './TemplateSelectionStep';
import { CardDetailsStep } from './CardDetailsStep';
import { PublishingOptionsStep } from './PublishingOptionsStep';
import type { WizardState, WizardHandlers } from './types';
import type { CardData } from '@/hooks/useCardEditor';
import type { TemplateConfig } from './wizardConfig';

interface WizardStepContentProps {
  currentStep: number;
  wizardState: WizardState;
  cardData: CardData;
  templates: TemplateConfig[];
  handlers: WizardHandlers;
}

export const WizardStepContent = ({ 
  currentStep, 
  wizardState, 
  cardData, 
  templates, 
  handlers 
}: WizardStepContentProps) => {
  switch (currentStep) {
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
          onFieldUpdate={handlers.updateCardField}
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

