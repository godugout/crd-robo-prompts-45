
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Search, CheckSquare, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMultiCardExtraction } from '@/hooks/useMultiCardExtraction';
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
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/cards')}
              className="text-crd-lightGray hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cards
            </Button>
            <div className="h-6 w-px bg-crd-mediumGray" />
            <div>
              <h1 className="text-3xl font-bold text-white">{phaseInfo.title}</h1>
              <p className="text-crd-lightGray mt-1">{phaseInfo.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-crd-lightGray">
            <PhaseIcon className="w-5 h-5" />
            <span className="text-sm font-medium capitalize">{currentPhase}</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="bg-crd-dark border-crd-mediumGray mb-8">
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
        <Card className="bg-crd-dark border-crd-mediumGray">
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
                  <Button
                    variant="default"
                    size="lg"
                    asChild
                    disabled={isProcessing}
                    className="bg-crd-green hover:bg-crd-green/90 text-black w-full"
                  >
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          Choose Image
                        </>
                      )}
                    </label>
                  </Button>
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
                  <Button
                    onClick={handleRunDetection}
                    className="bg-crd-green hover:bg-crd-green/90 text-black"
                    size="lg"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Detect Cards
                  </Button>
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
                  <Button
                    variant="outline"
                    onClick={resetSession}
                    className="border-crd-mediumGray text-crd-lightGray hover:text-white"
                  >
                    Start Over
                  </Button>
                  <Button
                    onClick={handleSaveCards}
                    disabled={selectedCards.length === 0}
                    className="bg-crd-green hover:bg-crd-green/90 text-black"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Selected Cards ({selectedCards.length})
                  </Button>
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
                  <Button
                    onClick={resetSession}
                    className="bg-crd-green hover:bg-crd-green/90 text-black"
                  >
                    Extract More Cards
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/gallery')}
                    className="border-crd-mediumGray text-crd-lightGray hover:text-white"
                  >
                    View Collection
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CardsExtractMultiple;
