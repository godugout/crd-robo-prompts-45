
import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCardCreation } from '@/hooks/useCardCreation';
import { ImageUploadZone } from './ImageUploadZone';
import { CardCustomizer } from './CardCustomizer';
import { SimpleCardRenderer } from './SimpleCardRenderer';

const StepIndicator: React.FC<{ currentStep: string }> = ({ currentStep }) => {
  const steps = [
    { id: 'upload', label: 'Upload', description: 'Choose your image' },
    { id: 'customize', label: 'Customize', description: 'Add details & effects' },
    { id: 'preview', label: 'Preview', description: 'Review your card' },
    { id: 'export', label: 'Export', description: 'Save & share' }
  ];

  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
              ${index <= currentIndex 
                ? 'bg-crd-green text-black' 
                : 'bg-gray-700 text-gray-400'
              }
            `}>
              {index + 1}
            </div>
            <div className="mt-2 text-center">
              <div className={`text-sm font-medium ${
                index <= currentIndex ? 'text-white' : 'text-gray-500'
              }`}>
                {step.label}
              </div>
              <div className="text-xs text-gray-500">
                {step.description}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`
              w-16 h-0.5 mx-4 mt-[-2rem]
              ${index < currentIndex ? 'bg-crd-green' : 'bg-gray-700'}
            `} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export const NewCardStudio: React.FC = () => {
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
        
      case 'customize':
        return state.uploadedImage ? (
          <CardCustomizer
            cardData={state.cardData}
            uploadedImage={state.uploadedImage}
            onUpdateCardData={updateCardData}
            onNext={nextStep}
            onBack={previousStep}
          />
        ) : null;
        
      case 'preview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Preview Your Card</h2>
                <p className="text-gray-400">Your card is ready! Review and save when satisfied.</p>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Card Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Title:</span>
                    <span className="text-white font-medium">{state.cardData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rarity:</span>
                    <span className="text-white font-medium capitalize">{state.cardData.rarity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Effects:</span>
                    <div className="text-right">
                      {state.cardData.effects.holographic > 0 && (
                        <div className="text-purple-400">Holographic {Math.round(state.cardData.effects.holographic * 100)}%</div>
                      )}
                      {state.cardData.effects.metallic > 0 && (
                        <div className="text-yellow-400">Metallic {Math.round(state.cardData.effects.metallic * 100)}%</div>
                      )}
                      {state.cardData.effects.chrome > 0 && (
                        <div className="text-blue-400">Chrome {Math.round(state.cardData.effects.chrome * 100)}%</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={previousStep}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Back to Edit
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                >
                  Export Card
                </Button>
              </div>
            </div>
            
            <div className="h-96 lg:h-full">
              {state.uploadedImage && (
                <SimpleCardRenderer
                  imageUrl={state.uploadedImage}
                  effects={state.cardData.effects}
                />
              )}
            </div>
          </div>
        );
        
      case 'export':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-crd-green rounded-full flex items-center justify-center">
              <div className="text-2xl">🎉</div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Card Exported Successfully!</h2>
              <p className="text-gray-400">Your trading card has been created and saved to your collection.</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button
                onClick={reset}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
              >
                Create Another Card
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

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
              <h1 className="text-xl font-bold text-white">Card Studio</h1>
            </div>
            
            {state.step !== 'upload' && (
              <Button
                onClick={reset}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Start Over
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <StepIndicator currentStep={state.step} />
        
        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};
