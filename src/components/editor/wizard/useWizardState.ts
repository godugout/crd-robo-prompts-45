

import { useState } from 'react';
import { toast } from 'sonner';
import { useCardEditor, CardData } from '@/hooks/useCardEditor';
import { DEFAULT_TEMPLATES, TemplateConfig } from './wizardConfig';
import type { WizardState, WizardHandlers } from './types';
import type { CardAnalysisResult } from '@/services/cardAnalyzer';

export const useWizardState = (onComplete: (cardData: CardData) => void) => {
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    selectedPhoto: '',
    selectedTemplate: null,
    aiAnalysisComplete: false
  });

  const { cardData, updateCardField, saveCard, isSaving } = useCardEditor({
    initialData: {
      creator_attribution: {
        collaboration_type: 'solo'
      },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: {
          currency: 'USD'
        },
        distribution: {
          limited_edition: false
        }
      }
    }
  });

  const handlers: WizardHandlers = {
    handlePhotoSelect: (photo: string) => {
      setWizardState(prev => ({ ...prev, selectedPhoto: photo }));
      updateCardField('image_url', photo);
    },

    handleAiAnalysis: (analysis: CardAnalysisResult) => {
      updateCardField('title', analysis.title);
      updateCardField('description', analysis.description);
      updateCardField('rarity', analysis.rarity);
      updateCardField('tags', analysis.tags);
      
      setWizardState(prev => ({ ...prev, aiAnalysisComplete: true }));
      
      // Find template based on tags only since category field doesn't exist in database
      const suggestedTemplate = DEFAULT_TEMPLATES.find(t => 
        analysis.tags.some(tag => t.tags.includes(tag))
      ) || DEFAULT_TEMPLATES[0];
      
      setWizardState(prev => ({ ...prev, selectedTemplate: suggestedTemplate }));
      updateCardField('template_id', suggestedTemplate.id);
      updateCardField('design_metadata', suggestedTemplate.template_data);
      
      toast.success('All fields pre-filled with AI suggestions!');
    },

    handleTemplateSelect: (template: TemplateConfig) => {
      setWizardState(prev => ({ ...prev, selectedTemplate: template }));
      updateCardField('template_id', template.id);
      updateCardField('design_metadata', template.template_data);
    },

    handleNext: () => {
      if (wizardState.currentStep === 1 && !wizardState.selectedPhoto) {
        toast.error('Please upload a photo first');
        return;
      }
      if (wizardState.currentStep === 2 && !wizardState.selectedTemplate) {
        toast.error('Please select a template');
        return;
      }
      if (wizardState.currentStep === 3 && !cardData.title.trim()) {
        toast.error('Please enter a card title');
        return;
      }
      
      if (wizardState.currentStep === 1 && wizardState.aiAnalysisComplete && wizardState.selectedTemplate) {
        setWizardState(prev => ({ ...prev, currentStep: 3 }));
      } else {
        setWizardState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 4) }));
      }
    },

    handleBack: () => {
      setWizardState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));
    },

    handleComplete: async () => {
      try {
        const success = await saveCard();
        if (success) {
          onComplete(cardData);
          toast.success('Card created successfully!');
        }
      } catch (error) {
        toast.error('Failed to create card');
      }
    },

    updatePublishingOptions: (key, value) => {
      updateCardField('publishing_options', {
        ...cardData.publishing_options,
        [key]: value
      });
    },

    updateCreatorAttribution: (key, value) => {
      updateCardField('creator_attribution', {
        ...cardData.creator_attribution,
        [key]: value
      });
    },

    updateCardField: updateCardField
  };

  return {
    wizardState,
    cardData,
    handlers,
    isSaving,
    templates: DEFAULT_TEMPLATES,
    updateCardField
  };
};

