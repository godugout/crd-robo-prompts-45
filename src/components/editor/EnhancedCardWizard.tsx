import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useCardEditor, CardData, DesignTemplate, PublishingOptions, CreatorAttribution } from '@/hooks/useCardEditor';
import { WizardStepIndicator } from './wizard/WizardStepIndicator';
import { PhotoUploadStep } from './wizard/PhotoUploadStep';
import { TemplateSelectionStep } from './wizard/TemplateSelectionStep';
import { CardDetailsStep } from './wizard/CardDetailsStep';
import { PublishingOptionsStep } from './wizard/PublishingOptionsStep';
import { WizardNavigation } from './wizard/WizardNavigation';
import type { CardAnalysisResult } from '@/services/cardAnalyzer';

interface EnhancedCardWizardProps {
  onComplete: (cardData: CardData) => void;
  onCancel: () => void;
}

export const EnhancedCardWizard = ({ onComplete, onCancel }: EnhancedCardWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  
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

  const templates: DesignTemplate[] = [
    { 
      id: 'classic', 
      name: 'Classic Frame', 
      category: 'Traditional',
      description: 'Timeless design with elegant borders',
      preview_url: '',
      template_data: { style: 'classic', borderWidth: 2 },
      is_premium: false,
      usage_count: 1250,
      tags: ['classic', 'elegant']
    },
    { 
      id: 'vintage', 
      name: 'Vintage Sports', 
      category: 'Sports',
      description: 'Retro-inspired trading card style',
      preview_url: '',
      template_data: { style: 'vintage', overlay: 'sepia' },
      is_premium: false,
      usage_count: 890,
      tags: ['vintage', 'sports', 'retro']
    },
    { 
      id: 'modern', 
      name: 'Modern Minimal', 
      category: 'Contemporary',
      description: 'Clean, modern design aesthetic',
      preview_url: '',
      template_data: { style: 'modern', layout: 'minimal' },
      is_premium: false,
      usage_count: 2100,
      tags: ['modern', 'minimal', 'clean']
    },
    { 
      id: 'neon', 
      name: 'Neon Cyber', 
      category: 'Futuristic',
      description: 'Futuristic cyberpunk-inspired design',
      preview_url: '',
      template_data: { style: 'neon', effects: ['glow', 'gradient'] },
      is_premium: true,
      usage_count: 750,
      tags: ['neon', 'cyber', 'futuristic']
    }
  ];

  const steps = [
    { number: 1, title: 'Upload Photo', description: 'Add your image' },
    { number: 2, title: 'Choose Template', description: 'Select design style' },
    { number: 3, title: 'Card Details', description: 'Review AI suggestions' },
    { number: 4, title: 'Publishing', description: 'Set visibility & options' }
  ];

  const handlePhotoSelect = (photo: string) => {
    setSelectedPhoto(photo);
    updateCardField('image_url', photo);
  };

  const handleAiAnalysis = (analysis: CardAnalysisResult) => {
    // Pre-fill all fields with AI suggestions
    updateCardField('title', analysis.title);
    updateCardField('description', analysis.description);
    updateCardField('rarity', analysis.rarity);
    updateCardField('tags', analysis.tags);
    updateCardField('category', analysis.category);
    updateCardField('type', analysis.type);
    updateCardField('series', analysis.series);
    
    setAiAnalysisComplete(true);
    
    // Auto-select a template based on analysis
    const suggestedTemplate = templates.find(t => 
      analysis.tags.some(tag => t.tags.includes(tag)) ||
      t.category.toLowerCase().includes(analysis.category.toLowerCase())
    ) || templates[0];
    
    setSelectedTemplate(suggestedTemplate);
    updateCardField('template_id', suggestedTemplate.id);
    updateCardField('design_metadata', suggestedTemplate.template_data);
    
    toast.success('All fields pre-filled with AI suggestions!');
  };

  const handleTemplateSelect = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    updateCardField('template_id', template.id);
    updateCardField('design_metadata', template.template_data);
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedPhoto) {
      toast.error('Please upload a photo first');
      return;
    }
    if (currentStep === 2 && !selectedTemplate) {
      toast.error('Please select a template');
      return;
    }
    if (currentStep === 3 && !cardData.title.trim()) {
      toast.error('Please enter a card title');
      return;
    }
    
    // Auto-advance if AI has completed analysis
    if (currentStep === 1 && aiAnalysisComplete && selectedTemplate) {
      setCurrentStep(3); // Skip template step since AI selected one
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    try {
      const success = await saveCard();
      if (success) {
        onComplete(cardData);
        toast.success('Card created successfully!');
      }
    } catch (error) {
      toast.error('Failed to create card');
    }
  };

  const updatePublishingOptions = (key: keyof PublishingOptions, value: any) => {
    updateCardField('publishing_options', {
      ...cardData.publishing_options,
      [key]: value
    });
  };

  const updateCreatorAttribution = (key: keyof CreatorAttribution, value: any) => {
    updateCardField('creator_attribution', {
      ...cardData.creator_attribution,
      [key]: value
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PhotoUploadStep
            selectedPhoto={selectedPhoto}
            onPhotoSelect={handlePhotoSelect}
            onAnalysisComplete={handleAiAnalysis}
          />
        );
      case 2:
        return (
          <TemplateSelectionStep
            templates={templates}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
          />
        );
      case 3:
        return (
          <CardDetailsStep
            cardData={cardData}
            onFieldUpdate={updateCardField}
            onCreatorAttributionUpdate={updateCreatorAttribution}
            aiAnalysisComplete={aiAnalysisComplete}
          />
        );
      case 4:
        return (
          <PublishingOptionsStep
            publishingOptions={cardData.publishing_options}
            selectedTemplate={selectedTemplate}
            onPublishingUpdate={updatePublishingOptions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-editor-darker p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Card</h1>
          <p className="text-crd-lightGray">
            Upload your image and let AI suggest the perfect details
            {aiAnalysisComplete && <span className="text-crd-green ml-2">✨ AI analysis complete!</span>}
          </p>
        </div>

        {/* Step Indicator */}
        <WizardStepIndicator steps={steps} currentStep={currentStep} />

        {/* Step Content */}
        <Card className="bg-editor-dark border-editor-border">
          <CardContent className="p-8">
            {renderStepContent()}

            {/* Navigation */}
            <WizardNavigation
              currentStep={currentStep}
              totalSteps={4}
              isLastStep={currentStep === 4}
              isSaving={isSaving}
              onCancel={onCancel}
              onBack={handleBack}
              onNext={handleNext}
              onComplete={handleComplete}
              canSkipToEnd={aiAnalysisComplete && selectedTemplate}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
