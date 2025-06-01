import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { WizardHeader } from './wizard/WizardHeader';
import { WizardStepContent } from './wizard/WizardStepContent';
import { useWizardState } from './wizard/useWizardState';
import type { CardData, DesignTemplate } from '@/hooks/useCardEditor';

interface SimpleCardWizardProps {
  onComplete: (cardData: CardData) => void;
}

export const SimpleCardWizard = ({ onComplete }: SimpleCardWizardProps) => {
  const { wizardState, cardData, handlers, isSaving, templates, updateCardField } = useWizardState(onComplete);

  return (
    <div className="min-h-screen bg-crd-darkest flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <WizardHeader aiAnalysisComplete={wizardState.aiAnalysisComplete} />
        
        {/* Wizard Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  wizardState.currentStep >= step 
                    ? 'bg-crd-green text-black' 
                    : 'bg-editor-border text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    wizardState.currentStep > step ? 'bg-crd-green' : 'bg-editor-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-crd-lightGray text-sm">
              Step {wizardState.currentStep} of 4
            </span>
          </div>
        </div>

        {/* Wizard Content */}
        <div className="bg-editor-dark rounded-xl p-8 mb-6">
          <WizardStepContent
            currentStep={wizardState.currentStep}
            wizardState={wizardState}
            cardData={cardData}
            templates={templates}
            handlers={{
              ...handlers,
              handlePhotoSelect: handlers.handlePhotoSelect,
              handleTemplateSelect: handlers.handleTemplateSelect,
              handleNext: handlers.handleNext,
              handleBack: handlers.handleBack,
              handleComplete: handlers.handleComplete,
              updatePublishingOptions: handlers.updatePublishingOptions,
              updateCreatorAttribution: handlers.updateCreatorAttribution,
              handleAiAnalysis: handlers.handleAiAnalysis
            }}
            updateCardField={updateCardField}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlers.handleBack}
            disabled={wizardState.currentStep === 1}
            className="border-editor-border text-white hover:bg-editor-border"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex space-x-3">
            {wizardState.currentStep < 4 ? (
              <Button
                onClick={handlers.handleNext}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
                disabled={isSaving}
              >
                {wizardState.currentStep === 1 && wizardState.aiAnalysisComplete && wizardState.selectedTemplate 
                  ? 'Skip to Details' 
                  : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handlers.handleComplete}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
                disabled={isSaving}
              >
                {isSaving ? 'Creating...' : 'Create Card'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
