import React, { useEffect } from 'react';
import { ArrowLeft, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCardCreation } from '@/hooks/useCardCreation';
import { CardCustomizer } from '@/components/creation/CardCustomizer';
import { SimpleCardRenderer } from '@/components/creation/SimpleCardRenderer';

// Default sample card data
const SAMPLE_CARD_DATA = {
  title: 'Circuit Master',
  description: 'A legendary tech card featuring advanced circuit board technology with holographic effects.',
  rarity: 'legendary' as const,
  effects: {
    holographic: 0.6,
    metallic: 0.4,
    chrome: 0.3,
    particles: true
  }
};

const SAMPLE_IMAGE_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=700&fit=crop';

const StepIndicator: React.FC<{ currentStep: string }> = ({ currentStep }) => {
  const steps = [
    { id: 'customize', label: 'Customize', description: 'Edit sample card' },
    { id: 'preview', label: 'Preview', description: 'Review your changes' },
    { id: 'save', label: 'Export', description: 'Save & share' }
  ];

  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${index <= currentIndex 
                ? 'bg-crd-green text-black' 
                : 'bg-gray-700 text-gray-400'
              }
            `}>
              {index === 0 ? <Sparkles className="w-4 h-4" /> : 
               index === 1 ? <Zap className="w-4 h-4" /> : index + 1}
            </div>
            <div className="mt-1 text-center">
              <div className={`text-xs font-medium ${
                index <= currentIndex ? 'text-white' : 'text-gray-500'
              }`}>
                {step.label}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`
              w-12 h-0.5 mx-3 mt-[-1rem]
              ${index < currentIndex ? 'bg-crd-green' : 'bg-gray-700'}
            `} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export const EnhancedStudio: React.FC = () => {
  const { state, updateCardData, nextStep, previousStep, reset } = useCardCreation('customize');

  // Initialize with sample card data
  useEffect(() => {
    // Set initial sample data
    updateCardData(SAMPLE_CARD_DATA);
  }, [updateCardData]);

  const handleStartFresh = () => {
    reset();
    window.location.href = '/create';
  };

  const renderStep = () => {
    switch (state.step) {
      case 'customize':
        return (
          <CardCustomizer
            cardData={state.cardData}
            uploadedImage={SAMPLE_IMAGE_URL}
            onUpdateCardData={updateCardData}
            onNext={nextStep}
            onBack={() => {}} // No back for sample card
          />
        );
        
      case 'preview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Preview Your Enhanced Card</h2>
                <p className="text-gray-400">Your enhanced card is ready! Export or continue editing.</p>
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
              <SimpleCardRenderer
                imageUrl={SAMPLE_IMAGE_URL}
                effects={state.cardData.effects}
              />
            </div>
          </div>
        );
        
      case 'save':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-crd-green rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Enhanced Card Ready!</h2>
              <p className="text-gray-400">Your enhanced trading card has been exported successfully.</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance Another
              </Button>
              <Button
                onClick={handleStartFresh}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Create From Scratch
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
              <div>
                <h1 className="text-xl font-bold text-white">Enhanced Card Studio</h1>
                <p className="text-sm text-gray-400">Professional-grade card editing with sample template</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleStartFresh}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Start Fresh
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Reset Sample
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <StepIndicator currentStep={state.step} />
        
        {/* Sample Card Notice */}
        <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-white font-medium">Sample Card Loaded</h3>
              <p className="text-gray-400 text-sm">
                Start with our "Circuit Master" sample card. Edit it freely or click "Start Fresh" to upload your own image.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};
