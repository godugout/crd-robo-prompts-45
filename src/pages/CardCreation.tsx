
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCardCreation } from '@/hooks/useCardCreation';
import { ImageUploadZone } from '@/components/creation/ImageUploadZone';
import { FrameSelector } from '@/components/creation/FrameSelector';
import { SimpleCardCustomizer } from '@/components/creation/SimpleCardCustomizer';
import { CardPreview } from '@/components/creation/CardPreview';
import { CardExport } from '@/components/creation/CardExport';

const CardCreation = () => {
  const { state, uploadImage, updateCardData, nextStep, previousStep, reset } = useCardCreation();

  const renderStep = () => {
    switch (state.step) {
      case 'upload':
        return (
          <ImageUploadZone
            onImageUpload={uploadImage}
            isProcessing={state.processing}
            error={state.error}
          />
        );
        
      case 'frame':
        return (
          <FrameSelector
            uploadedImage={state.uploadedImage!}
            selectedFrame={state.cardData.frame}
            onFrameSelect={(frame) => updateCardData({ frame })}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
        
      case 'customize':
        return (
          <SimpleCardCustomizer
            cardData={state.cardData}
            uploadedImage={state.uploadedImage!}
            onUpdateCardData={updateCardData}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
        
      case 'preview':
        return (
          <CardPreview
            cardData={state.cardData}
            uploadedImage={state.uploadedImage!}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
        
      case 'export':
        return (
          <CardExport
            cardData={state.cardData}
            uploadedImage={state.uploadedImage!}
            onCreateAnother={reset}
          />
        );
        
      default:
        return null;
    }
  };

  const steps = ['upload', 'frame', 'customize', 'preview', 'export'];
  const currentStepIndex = steps.indexOf(state.step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-[#0a0a0b] to-[#131316]">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => window.location.href = '/'}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">Create Your Card</h1>
                <p className="text-sm text-gray-400">Design and customize your trading card</p>
              </div>
            </div>
            
            {/* Step Progress */}
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStepIndex ? 'bg-crd-green' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderStep()}
      </div>
    </div>
  );
};

export default CardCreation;
