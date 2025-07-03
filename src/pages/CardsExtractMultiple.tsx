
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Search, CheckSquare, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMultiCardExtraction } from '@/hooks/useMultiCardExtraction';
import { StudioLayoutWrapper, StudioHeader, StudioButton } from '@/components/studio/shared';
import { toast } from 'sonner';

const CardsExtractMultiple: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentPhase,
    uploadedImage,
    detectedCards,
    selectedCards,
    isProcessing,
    uploadImage,
    runDetection,
    toggleCardSelection,
    saveSelectedCards,
    resetSession
  } = useMultiCardExtraction();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image file is too large. Please use an image smaller than 15MB.');
      return;
    }

    await uploadImage(file);
  };

  const handleRunDetection = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }
    await runDetection();
  };

  const handleSaveCards = async () => {
    if (selectedCards.length === 0) {
      toast.error('Please select at least one card to save');
      return;
    }
    await saveSelectedCards();
  };

  const getPhaseInfo = () => {
    switch (currentPhase) {
      case 'upload':
        return {
          title: 'Upload Image',
          description: 'Upload an image containing multiple trading cards',
          icon: Upload
        };
      case 'detect':
        return {
          title: 'Detect Cards',
          description: 'AI will automatically detect all cards in your image',
          icon: Search
        };
      case 'review':
        return {
          title: 'Review & Select',
          description: 'Review detected cards and select which ones to save',
          icon: CheckSquare
        };
      case 'complete':
        return {
          title: 'Save Complete',
          description: 'Your selected cards have been saved to your collection',
          icon: Save
        };
      default:
        return {
          title: 'Multi-Card Extraction',
          description: 'Extract multiple cards from a single image',
          icon: Upload
        };
    }
  };

  const phaseInfo = getPhaseInfo();
  const PhaseIcon = phaseInfo.icon;

  return (
    <StudioLayoutWrapper>
      <div className="flex-1 flex flex-col">
        <StudioHeader
          title={phaseInfo.title}
          subtitle={phaseInfo.description}
          onBack={() => navigate('/cards')}
          backLabel="Back to Cards"
          actions={
            <div className="flex items-center gap-2 text-white">
              <PhaseIcon className="w-5 h-5" />
              <span className="text-sm font-medium capitalize">{currentPhase}</span>
            </div>
          }
        />
        
        <div className="flex-1 overflow-y-auto p-6">

          {/* Progress Indicator */}
          <Card className="bg-[#1a1a1a]/80 border-[#4a4a4a] mb-8 max-w-7xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {['upload', 'detect', 'review', 'complete'].map((phase, index) => {
                const isActive = phase === currentPhase;
                const isCompleted = ['upload', 'detect', 'review', 'complete'].indexOf(currentPhase) > index;
                const isDisabled = ['upload', 'detect', 'review', 'complete'].indexOf(currentPhase) < index;
                
                return (
                  <div key={phase} className="flex items-center">
                    <div className={`flex items-center ${
                      isActive ? 'text-crd-green' : 
                      isCompleted ? 'text-white' : 'text-crd-lightGray'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        isActive ? 'border-crd-green bg-crd-green text-black' :
                        isCompleted ? 'border-white bg-white text-black' : 
                        'border-crd-mediumGray'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="ml-2 font-medium capitalize">{phase}</span>
                    </div>
                    
                    {index < 3 && (
                      <div className={`h-0.5 w-16 mx-4 ${
                        isCompleted ? 'bg-crd-green' : 'bg-crd-mediumGray'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

          {/* Main Content Area */}
          <Card className="bg-[#1a1a1a]/80 border-[#4a4a4a] max-w-7xl mx-auto">
          <CardContent className="p-8">
            {currentPhase === 'upload' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-crd-blue/20 flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-crd-blue" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">Upload Your Image</h3>
                <p className="text-crd-lightGray max-w-lg mx-auto mb-8">
                  Choose an image that contains multiple trading cards. Our AI will automatically detect and extract each card.
                </p>

                <div className="max-w-md mx-auto">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={isProcessing}
                  />
                  <StudioButton
                    variant="primary"
                    size="lg"
                    disabled={isProcessing}
                    className="w-full"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Choose Image
                      </>
                    )}
                  </StudioButton>
                </div>
              </div>
            )}

            {currentPhase === 'detect' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-crd-blue/20 flex items-center justify-center mx-auto mb-6">
                  {isProcessing ? (
                    <div className="w-10 h-10 border-2 border-crd-blue border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-10 h-10 text-crd-blue" />
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  {isProcessing ? 'Detecting Cards...' : 'Ready to Detect Cards'}
                </h3>
                <p className="text-crd-lightGray max-w-lg mx-auto mb-8">
                  {isProcessing 
                    ? 'Our advanced AI is analyzing your image to detect individual trading cards.'
                    : 'Click the button below to start the card detection process.'
                  }
                </p>

                {!isProcessing && (
                  <StudioButton
                    onClick={handleRunDetection}
                    variant="primary"
                    size="lg"
                    icon={<Search className="w-5 h-5" />}
                  >
                    Detect Cards
                  </StudioButton>
                )}
              </div>
            )}

            {currentPhase === 'review' && (
              <div className="py-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Review Detected Cards</h3>
                  <p className="text-crd-lightGray">
                    {detectedCards.length} cards detected. Select the ones you want to save to your collection.
                  </p>
                </div>

                {/* Cards will be rendered here in the next phase */}
                <div className="text-center text-crd-lightGray py-12">
                  Card selection interface will be implemented in the next step
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <StudioButton
                    onClick={resetSession}
                    variant="outline"
                  >
                    Start Over
                  </StudioButton>
                  <StudioButton
                    onClick={handleSaveCards}
                    disabled={selectedCards.length === 0}
                    variant="primary"
                    icon={<Save className="w-4 h-4" />}
                  >
                    Save Selected Cards ({selectedCards.length})
                  </StudioButton>
                </div>
              </div>
            )}

            {currentPhase === 'complete' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <Save className="w-10 h-10 text-green-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">Cards Saved Successfully!</h3>
                <p className="text-crd-lightGray max-w-lg mx-auto mb-8">
                  {selectedCards.length} cards have been added to your collection.
                </p>

                <div className="flex justify-center gap-4">
                  <StudioButton
                    onClick={resetSession}
                    variant="primary"
                  >
                    Extract More Cards
                  </StudioButton>
                  <StudioButton
                    onClick={() => navigate('/gallery')}
                    variant="outline"
                  >
                    View Collection
                  </StudioButton>
                </div>
              </div>
            )}
          </CardContent>
          </Card>
        </div>
      </div>
    </StudioLayoutWrapper>
  );
};

export default CardsExtractMultiple;
