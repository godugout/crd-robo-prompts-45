
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, Palette, Sparkles, Eye, Download,
  Image, Type, Layers, Zap
} from 'lucide-react';
import { useCardCreation } from '@/hooks/useCardCreation';
import { ImageUploadZone } from './ImageUploadZone';
import { TemplateSelector } from './TemplateSelector';
import { EffectCustomizer } from './EffectCustomizer';
import { CardPreviewArea } from './CardPreviewArea';
import { CardDetailsForm } from './CardDetailsForm';
import { SAMPLE_OAK_TEMPLATES } from '@/data/oakTemplateData';

type CreationStep = 'template' | 'image' | 'customize' | 'effects' | 'preview';

const STEPS = [
  { id: 'template', label: 'Template', icon: Layers, description: 'Choose your style' },
  { id: 'image', label: 'Image', icon: Image, description: 'Upload your photo' },
  { id: 'customize', label: 'Details', icon: Type, description: 'Add information' },
  { id: 'effects', label: 'Effects', icon: Zap, description: 'Apply visual effects' },
  { id: 'preview', label: 'Preview', icon: Eye, description: 'Review & export' }
];

export const EnhancedCardCreator: React.FC = () => {
  const { state, uploadImage, updateCardData, reset } = useCardCreation();
  const [currentStep, setCurrentStep] = useState<CreationStep>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleTemplateSelect = useCallback((templateId: string) => {
    setSelectedTemplate(templateId);
    updateCardData({ frame: templateId });
  }, [updateCardData]);

  const handleStepNavigation = (step: CreationStep) => {
    setCurrentStep(step);
  };

  const canAdvanceFromStep = (step: CreationStep): boolean => {
    switch (step) {
      case 'template':
        return Boolean(selectedTemplate);
      case 'image':
        return Boolean(state.uploadedImage);
      case 'customize':
        return Boolean(state.cardData.title.trim());
      case 'effects':
        return true;
      case 'preview':
        return true;
      default:
        return false;
    }
  };

  const getCurrentStepIndex = () => STEPS.findIndex(step => step.id === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-[#0a0a0b] to-[#131316] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create Your <span className="text-crd-green">Trading Card</span>
          </h1>
          <p className="text-xl text-gray-300">
            Design professional trading cards with our enhanced creation tools
          </p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-center mb-8 gap-4">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = getCurrentStepIndex() > index;
            const canAccess = index === 0 || canAdvanceFromStep(STEPS[index - 1].id as CreationStep);
            
            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => canAccess && handleStepNavigation(step.id as CreationStep)}
                  disabled={!canAccess}
                  className={`
                    flex flex-col items-center p-4 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'bg-crd-green/20 border-2 border-crd-green text-crd-green' 
                      : isCompleted 
                        ? 'bg-green-900/30 border border-green-600 text-green-400 hover:bg-green-900/50'
                        : canAccess
                          ? 'bg-gray-800/50 border border-gray-600 text-gray-400 hover:bg-gray-700/50'
                          : 'bg-gray-900/30 border border-gray-800 text-gray-600 cursor-not-allowed'
                    }
                  `}
                >
                  <step.icon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">{step.label}</span>
                  <span className="text-xs opacity-70">{step.description}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${isCompleted ? 'bg-crd-green' : 'bg-gray-700'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Creation Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-black/30 border-white/20 p-6">
              {currentStep === 'template' && (
                <TemplateSelector
                  templates={SAMPLE_OAK_TEMPLATES}
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                />
              )}

              {currentStep === 'image' && (
                <ImageUploadZone
                  onImageUpload={uploadImage}
                  isProcessing={state.processing}
                  error={state.error}
                />
              )}

              {currentStep === 'customize' && (
                <CardDetailsForm
                  cardData={state.cardData}
                  onUpdateCardData={updateCardData}
                />
              )}

              {currentStep === 'effects' && (
                <EffectCustomizer
                  effects={state.cardData.effects}
                  onEffectsChange={(effects) => updateCardData({ effects })}
                />
              )}

              {currentStep === 'preview' && (
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Your Card is Ready!</h3>
                    <p className="text-gray-400">Review your creation and export when satisfied</p>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={reset}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Create Another
                    </Button>
                    <Button className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold">
                      <Download className="w-4 h-4 mr-2" />
                      Export Card
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Step Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                onClick={() => {
                  const currentIndex = getCurrentStepIndex();
                  if (currentIndex > 0) {
                    handleStepNavigation(STEPS[currentIndex - 1].id as CreationStep);
                  }
                }}
                disabled={getCurrentStepIndex() === 0}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Previous
              </Button>
              
              <Button
                onClick={() => {
                  const currentIndex = getCurrentStepIndex();
                  if (currentIndex < STEPS.length - 1 && canAdvanceFromStep(currentStep)) {
                    handleStepNavigation(STEPS[currentIndex + 1].id as CreationStep);
                  }
                }}
                disabled={getCurrentStepIndex() === STEPS.length - 1 || !canAdvanceFromStep(currentStep)}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
              >
                {getCurrentStepIndex() === STEPS.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-black/30 border-white/20 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Live Preview</h3>
                <Badge variant="outline" className="border-crd-green text-crd-green">
                  Real-time
                </Badge>
              </div>
              
              <CardPreviewArea
                template={selectedTemplate}
                uploadedImage={state.uploadedImage}
                cardData={state.cardData}
                effects={state.cardData.effects}
              />
              
              {/* Card Stats */}
              <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
                <h4 className="text-white font-medium mb-2">Card Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Template:</span>
                    <span className="text-white">{selectedTemplate || 'None selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Title:</span>
                    <span className="text-white">{state.cardData.title || 'Untitled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rarity:</span>
                    <span className="text-white capitalize">{state.cardData.rarity}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
