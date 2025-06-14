
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FrameSelectionStep } from './steps/FrameSelectionStep';
import { EnhancedImageUploadStep } from './steps/EnhancedImageUploadStep';
import { ImageAdjustmentStep } from './steps/ImageAdjustmentStep';
import { TextElementsStep } from './steps/TextElementsStep';
import { LayerElementsStep } from './steps/LayerElementsStep';
import { FinalSceneStep } from './steps/FinalSceneStep';
import { ProgressiveWizardLayout } from './ProgressiveWizardLayout';

interface CardCreationData {
  selectedFrame?: string;
  imageUrl?: string;
  imageAdjustments?: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  textElements?: Array<{
    id: string;
    type: 'name' | 'title' | 'stats';
    content: string;
    position: { x: number; y: number };
  }>;
  layerElements?: Array<{
    id: string;
    type: 'logo' | 'nameplate' | 'effect';
    elementId: string;
    position: { x: number; y: number };
  }>;
  sceneEffects?: {
    lighting: string;
    atmosphere: string;
    style: string;
  };
}

const STEPS = [
  { id: 'frame', title: 'Choose Frame', description: 'Pick a frame style' },
  { id: 'image', title: 'Add Image', description: 'Upload your photo' },
  { id: 'adjust', title: 'Adjust Image', description: 'Position & resize' },
  { id: 'text', title: 'Add Text', description: 'Essential details' },
  { id: 'elements', title: 'Layer Elements', description: 'Logos & effects' },
  { id: 'scene', title: 'Final Scene', description: 'Style & finish' }
];

export const ProgressiveCardWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [cardData, setCardData] = useState<CardCreationData>({});
  const [isComplete, setIsComplete] = useState(false);

  const updateCardData = (updates: Partial<CardCreationData>) => {
    setCardData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step - complete card creation
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!cardData.selectedFrame;
      case 1: return !!cardData.imageUrl;
      case 2: return true; // Image adjustment is optional
      case 3: return true; // Text is optional
      case 4: return true; // Layer elements are optional
      case 5: return true; // Scene effects are optional
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <FrameSelectionStep
            selectedFrame={cardData.selectedFrame}
            onFrameSelect={(frameId) => updateCardData({ selectedFrame: frameId })}
          />
        );
      case 1:
        return (
          <EnhancedImageUploadStep
            selectedFrame={cardData.selectedFrame}
            uploadedImage={cardData.imageUrl}
            onImageUpload={(imageUrl) => updateCardData({ imageUrl })}
          />
        );
      case 2:
        return (
          <ImageAdjustmentStep
            imageUrl={cardData.imageUrl}
            selectedFrame={cardData.selectedFrame}
            adjustments={cardData.imageAdjustments}
            onAdjustmentsChange={(adjustments) => updateCardData({ imageAdjustments: adjustments })}
          />
        );
      case 3:
        return (
          <TextElementsStep
            selectedFrame={cardData.selectedFrame}
            textElements={cardData.textElements}
            onTextElementsChange={(textElements) => updateCardData({ textElements })}
          />
        );
      case 4:
        return (
          <LayerElementsStep
            selectedFrame={cardData.selectedFrame}
            layerElements={cardData.layerElements}
            onLayerElementsChange={(layerElements) => updateCardData({ layerElements })}
          />
        );
      case 5:
        return (
          <FinalSceneStep
            cardData={cardData}
            sceneEffects={cardData.sceneEffects}
            onSceneEffectsChange={(sceneEffects) => updateCardData({ sceneEffects })}
            onComplete={() => setIsComplete(true)}
          />
        );
      default:
        return null;
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Card Created!</h2>
          <p className="text-gray-300 mb-6">Your card has been successfully created.</p>
          <div className="space-x-4">
            <Button onClick={() => navigate('/gallery')} className="bg-crd-green text-black">
              View in Gallery
            </Button>
            <Button onClick={() => navigate('/cards')} variant="outline" className="border-gray-600 text-white">
              Create Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProgressiveWizardLayout
      steps={STEPS}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onBack={() => navigate('/cards')}
    >
      {/* Step Content - Takes remaining space */}
      <div className="flex-1 overflow-hidden">
        {renderStep()}
      </div>

      {/* Navigation - Fixed at bottom */}
      <div className="border-t border-editor-border p-6 bg-editor-dark">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="border-gray-600 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleSkip}
                className="border-gray-600 text-gray-300"
              >
                Skip This Step
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-crd-green text-black hover:bg-crd-green/90"
            >
              {currentStep === STEPS.length - 1 ? 'Complete' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </ProgressiveWizardLayout>
  );
};
