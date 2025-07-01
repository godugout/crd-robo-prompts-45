
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfessionalStepIndicator } from './phases/ProfessionalStepIndicator';
import { ProfessionalFrameGallery } from './phases/ProfessionalFrameGallery';
import { SmartImageUpload } from './phases/SmartImageUpload';
import { EffectsMaterialsStudio } from './phases/EffectsMaterialsStudio';
import { ShowcaseEnvironmentSelector } from './phases/ShowcaseEnvironmentSelector';
import { PublishingWorkflow } from './phases/PublishingWorkflow';
import { useNavigate } from 'react-router-dom';

export const EnhancedCardCreatorProfessional: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [cardData, setCardData] = useState({
    selectedFrame: '',
    uploadedImage: '',
    effects: {},
    environment: 'studio',
    title: '',
    description: '',
    rarity: 'common'
  });

  const steps = [
    'Frame Gallery',
    'Smart Upload', 
    'Effects Studio',
    'Showcase',
    'Publish'
  ];

  const stepDescriptions = [
    'Choose from 8 professional categories with rarity indicators',
    'Frame-aware positioning with smart cropping interface',
    'Professional effects with real-time 3D preview',
    'Select environment with preset lighting conditions',
    'Export CRD, PNG, JPEG, and 3D model formats'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return cardData.selectedFrame !== '';
      case 1: return cardData.uploadedImage !== '';
      case 2: return true;
      case 3: return true;
      case 4: return cardData.title !== '';
      default: return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProfessionalFrameGallery
            selectedFrame={cardData.selectedFrame}
            onFrameSelect={(frameId) => setCardData({...cardData, selectedFrame: frameId})}
          />
        );
      case 1:
        return (
          <SmartImageUpload
            selectedFrame={cardData.selectedFrame}
            uploadedImage={cardData.uploadedImage}
            onImageUpload={(imageUrl) => setCardData({...cardData, uploadedImage: imageUrl})}
          />
        );
      case 2:
        return (
          <EffectsMaterialsStudio
            effects={cardData.effects}
            onEffectsChange={(effects) => setCardData({...cardData, effects})}
            previewImage={cardData.uploadedImage}
            selectedFrame={cardData.selectedFrame}
          />
        );
      case 3:
        return (
          <ShowcaseEnvironmentSelector
            selectedEnvironment={cardData.environment}
            onEnvironmentSelect={(env) => setCardData({...cardData, environment: env})}
            cardPreview={{ frame: cardData.selectedFrame, image: cardData.uploadedImage, effects: cardData.effects }}
          />
        );
      case 4:
        return (
          <PublishingWorkflow
            cardData={cardData}
            onDataUpdate={setCardData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#141416]">
      {/* Header */}
      <div className="bg-[#141416] border-b border-[#353945]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="text-[#777E90] hover:text-[#FCFCFD] hover:bg-[#353945]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-black text-[#FCFCFD]">Professional Card Studio</h1>
                <p className="text-sm text-[#777E90]">Create premium trading cards with advanced effects</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <ProfessionalStepIndicator
        currentStep={currentStep}
        totalSteps={steps.length}
        stepNames={steps}
        stepDescriptions={stepDescriptions}
      />

      {/* Content */}
      <div className="flex-1">
        {renderCurrentStep()}
      </div>

      {/* Navigation */}
      <div className="bg-[#23262F] border-t border-[#353945] px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="border-[#353945] text-[#777E90] hover:text-[#FCFCFD] hover:bg-[#353945]"
          >
            Previous
          </Button>
          
          <div className="text-sm text-[#777E90]">
            Step {currentStep + 1} of {steps.length}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed() || currentStep === steps.length - 1}
            className="bg-[#3772FF] hover:bg-[#3772FF]/90 text-white font-extrabold px-6"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};
