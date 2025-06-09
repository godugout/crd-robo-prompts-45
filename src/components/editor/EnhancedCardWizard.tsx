import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DEFAULT_TEMPLATES, WIZARD_STEPS, TemplateConfig } from './wizard/wizardConfig';
import { WizardStepContent } from './wizard/WizardStepContent';
import { useCardEditor } from '@/hooks/useCardEditor';
import type { WizardState, WizardHandlers } from './wizard/types';
import { CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedCardWizardProps {
  onComplete: (cardData: any) => void;
  onCancel: () => void;
}

export const EnhancedCardWizard = ({ onComplete, onCancel }: EnhancedCardWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardState, setWizardState] = useState<WizardState>({
    selectedPhoto: '',
    selectedTemplate: DEFAULT_TEMPLATES[0],
    aiAnalysisComplete: false
  });

  const [isCreating, setIsCreating] = useState(false);

  const cardEditor = useCardEditor({
    initialData: {
      title: 'My Custom Card',
      rarity: 'common',
      tags: ['custom', 'card'],
      design_metadata: {
        ...DEFAULT_TEMPLATES[0].template_data
      },
      template_id: DEFAULT_TEMPLATES[0].id,
      visibility: 'private',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: true,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    },
    autoSave: true
  });

  const handlers: WizardHandlers = {
    handlePhotoSelect: (photo: string) => {
      setWizardState(prev => ({ ...prev, selectedPhoto: photo }));
      cardEditor.updateCardField('image_url', photo);
      setCurrentStep(2); // Move to image adjustment step
    },

    handleImageAdjusted: (adjustedImageUrl: string) => {
      setWizardState(prev => ({ ...prev, selectedPhoto: adjustedImageUrl }));
      cardEditor.updateCardField('image_url', adjustedImageUrl);
      cardEditor.updateCardField('thumbnail_url', adjustedImageUrl);
      setCurrentStep(3); // Move to template selection
      toast.success('Image adjusted! Now choose your card template.');
    },

    handleTemplateSelect: (template: TemplateConfig) => {
      setWizardState(prev => ({ ...prev, selectedTemplate: template }));
      cardEditor.updateCardField('template_id', template.id);
      cardEditor.updateDesignMetadata('template_data', template.template_data);
      setCurrentStep(4); // Move to card details
    },

    handleAiAnalysis: (analysis: any) => {
      setWizardState(prev => ({ ...prev, aiAnalysisComplete: true }));
      // Update card data based on AI analysis
      if (analysis?.name) {
        cardEditor.updateCardField('title', analysis.name);
      }
      // Add more fields as needed
    },

    updateCardField: (field: string, value: any) => {
      cardEditor.updateCardField(field, value);
    },

    updateCreatorAttribution: (attribution: any) => {
      cardEditor.updateCardField('creator_attribution', attribution);
    },

    updatePublishingOptions: (options: any) => {
      cardEditor.updateCardField('publishing_options', options);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardState.selectedPhoto !== '';
      case 2:
        return wizardState.selectedPhoto !== '';
      case 3:
        return !!wizardState.selectedTemplate;
      case 4:
        return cardEditor.cardData.title?.trim() !== '';
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < WIZARD_STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsCreating(true);
    try {
      // Save the card data
      await cardEditor.saveCard();
      toast.success('Card created successfully!');
      onComplete(cardEditor.cardData);
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error('Failed to create card. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-editor-dark border-b border-crd-mediumGray/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-crd-white">
            Create New Card
          </h1>
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500/10"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {WIZARD_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep === step.id 
                    ? 'bg-crd-green text-crd-dark' 
                    : currentStep > step.id 
                      ? 'bg-crd-green/20 text-crd-green' 
                      : 'bg-editor-border text-crd-lightGray'
                }`}>
                  {step.id}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    currentStep === step.id ? 'text-crd-white' : 'text-crd-lightGray'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-crd-lightGray">{step.description}</div>
                </div>
                {index < WIZARD_STEPS.length - 1 && (
                  <div className="hidden sm:block w-12 h-px bg-editor-border mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

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

        {/* Navigation only show for steps that need manual navigation */}
        {(currentStep === 3 || currentStep === 4 || currentStep === 5) && (
          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
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
                  onClick={handleComplete}
                  disabled={isCreating}
                  className="bg-crd-green hover:bg-crd-green/90 text-crd-dark min-w-24"
                >
                  {isCreating ? 'Creating...' : 'Create Card'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-crd-green hover:bg-crd-green/90 text-crd-dark"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
