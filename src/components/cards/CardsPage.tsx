import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, Image, Check, X, Download, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { detectCardsInImages, cropCardFromImage, DetectedCard, CardDetectionResult } from '@/services/cardDetection';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface CreatedCard {
  id: string;
  title: string;
  image: string;
  confidence: number;
  metadata: any;
  createdAt: Date;
}

type WorkflowPhase = 'idle' | 'uploading' | 'detecting' | 'reviewing' | 'creating' | 'complete';

export const CardsPage = () => {
  const [phase, setPhase] = useState<WorkflowPhase>('idle');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [detectionResults, setDetectionResults] = useState<CardDetectionResult[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [createdCards, setCreatedCards] = useState<CreatedCard[]>([]);

  // File upload handling
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setPhase('uploading');
    toast.loading('Uploading images...');

    // Simulate upload time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newImages: UploadedImage[] = acceptedFiles.map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file)
    }));

    setUploadedImages(newImages);
    toast.dismiss();
    toast.success(`Uploaded ${acceptedFiles.length} images`);
    
    // Auto-start detection after upload
    setTimeout(() => startDetection(newImages), 500);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 10
  });

  // Detection phase
  const startDetection = async (images: UploadedImage[]) => {
    setPhase('detecting');
    toast.loading('Detecting cards in images...');

    try {
      const files = images.map(img => img.file);
      const results = await detectCardsInImages(files);
      
      setDetectionResults(results);
      
      // Auto-select all detected cards
      const allCardIds = results.flatMap(result => 
        result.detectedCards.map(card => card.id)
      );
      setSelectedCards(new Set(allCardIds));
      
      toast.dismiss();
      toast.success(`Detected ${allCardIds.length} cards across ${results.length} images`);
      setPhase('reviewing');
    } catch (error) {
      console.error('Detection failed:', error);
      toast.dismiss();
      toast.error('Card detection failed');
      setPhase('idle');
    }
  };

  // Create selected cards with actual cropping
  const createSelectedCards = async () => {
    if (selectedCards.size === 0) {
      toast.error('Please select at least one card');
      return;
    }

    setPhase('creating');
    toast.loading('Creating cards...');

    try {
      const allDetectedCards = detectionResults.flatMap(result => result.detectedCards);
      const cardsToCreate = allDetectedCards.filter(card => selectedCards.has(card.id));
      const newCreatedCards: CreatedCard[] = [];

      // Process each selected card
      for (let i = 0; i < cardsToCreate.length; i++) {
        const card = cardsToCreate[i];
        
        // Use the already cropped image from detection
        newCreatedCards.push({
          id: `created-${card.id}`,
          title: `${card.metadata.cardType || 'Card'} ${i + 1}`,
          image: card.croppedImageUrl, // Use the cropped image
          confidence: card.confidence,
          metadata: card.metadata,
          createdAt: new Date()
        });

        // Show progress
        toast.dismiss();
        toast.loading(`Creating cards... ${i + 1}/${cardsToCreate.length}`);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setCreatedCards(prev => [...prev, ...newCreatedCards]);
      
      toast.dismiss();
      toast.success(`Created ${newCreatedCards.length} cards!`);
      setPhase('complete');
      
      // Auto-reset after showing success
      setTimeout(() => {
        setPhase('idle');
        setUploadedImages([]);
        setDetectionResults([]);
        setSelectedCards(new Set());
      }, 3000);
    } catch (error) {
      console.error('Card creation failed:', error);
      toast.dismiss();
      toast.error('Failed to create cards');
    }
  };

  // Card selection
  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  // Download card
  const downloadCard = (card: CreatedCard) => {
    const link = document.createElement('a');
    link.download = `${card.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.href = card.image;
    link.click();
    toast.success('Card downloaded!');
  };

  // Start over
  const startOver = () => {
    setPhase('idle');
    setUploadedImages([]);
    setDetectionResults([]);
    setSelectedCards(new Set());
  };

  // Render phase indicator
  const renderPhaseIndicator = () => {
    const phases = [
      { key: 'idle', label: 'Upload', icon: Upload },
      { key: 'detecting', label: 'Detect', icon: Image },
      { key: 'reviewing', label: 'Review', icon: Check },
      { key: 'complete', label: 'Complete', icon: Check }
    ];

    const getCurrentPhaseIndex = () => {
      if (phase === 'idle' || phase === 'uploading') return 0;
      if (phase === 'detecting') return 1;
      if (phase === 'reviewing' || phase === 'creating') return 2;
      return 3;
    };

    const currentIndex = getCurrentPhaseIndex();

    return (
      <div className="flex items-center justify-center mb-8">
        {phases.map((phaseItem, index) => {
          const Icon = phaseItem.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          
          return (
            <div key={phaseItem.key} className="flex items-center">
              <div className={`flex items-center ${
                isActive ? 'text-crd-green' : isCompleted ? 'text-white' : 'text-crd-lightGray'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isActive ? 'border-crd-green bg-crd-green text-black' :
                  isCompleted ? 'border-white bg-white text-black' : 'border-crd-mediumGray'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="ml-2 font-medium">{phaseItem.label}</span>
              </div>
              
              {index < phases.length - 1 && (
                <div className={`h-0.5 w-16 mx-4 ${
                  index < currentIndex ? 'bg-crd-green' : 'bg-crd-mediumGray'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Get all detected cards for display
  const allDetectedCards = detectionResults.flatMap(result => result.detectedCards);

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="pt-20 pb-6 border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Card Detection & Upload</h1>
            <p className="text-xl text-crd-lightGray">
              Upload images to automatically detect and crop trading cards
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        {renderPhaseIndicator()}

        {/* Main Content */}
        <div className="bg-editor-dark rounded-xl p-8 border border-crd-mediumGray/20 mb-8">
          {/* IDLE PHASE - Upload */}
          {phase === 'idle' && (
            <div className="text-center">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer ${
                  isDragActive 
                    ? 'border-crd-green bg-crd-green/10' 
                    : 'border-crd-mediumGray hover:border-crd-green/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {isDragActive ? 'Drop images here' : 'Upload Card Images'}
                </h3>
                <p className="text-crd-lightGray text-lg">
                  Drag and drop your trading card images, or click to browse
                </p>
                <p className="text-crd-lightGray text-sm mt-2">
                  Supports JPG, PNG, WebP • Max 10 images
                </p>
              </div>
            </div>
          )}

          {/* UPLOADING PHASE */}
          {phase === 'uploading' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">Uploading Images</h3>
              <p className="text-crd-lightGray">Please wait while we process your images...</p>
            </div>
          )}

          {/* DETECTING PHASE */}
          {phase === 'detecting' && (
            <div className="text-center py-12">
              <div className="relative">
                <Image className="w-16 h-16 text-crd-green mx-auto mb-4 animate-pulse" />
                <div className="absolute inset-0 border-4 border-crd-green border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Detecting Cards</h3>
              <p className="text-crd-lightGray">AI is analyzing your images to find trading cards...</p>
            </div>
          )}

          {/* REVIEWING PHASE */}
          {phase === 'reviewing' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Review Detected Cards</h3>
                  <p className="text-crd-lightGray">
                    Found {allDetectedCards.length} cards • {selectedCards.size} selected
                  </p>
                  <p className="text-crd-lightGray text-sm mt-1">
                    Cards have been automatically cropped to standard dimensions
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={startOver}
                    className="text-crd-lightGray border-crd-mediumGray"
                  >
                    Start Over
                  </Button>
                  <Button
                    onClick={createSelectedCards}
                    disabled={selectedCards.size === 0}
                    className="bg-crd-green hover:bg-crd-green/90 text-black"
                  >
                    Create {selectedCards.size} Cards
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allDetectedCards.map((card) => {
                  const isSelected = selectedCards.has(card.id);
                  
                  return (
                    <div
                      key={card.id}
                      className={`relative group border-2 rounded-lg transition-all p-4 ${
                        isSelected 
                          ? 'border-crd-green bg-crd-green/10' 
                          : 'border-crd-mediumGray hover:border-crd-green/50'
                      }`}
                    >
                      {/* Original vs Cropped comparison */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-crd-lightGray text-xs mb-1">Original</p>
                          <div className="aspect-video bg-editor-tool rounded overflow-hidden">
                            <img
                              src={card.originalImageUrl}
                              alt="Original"
                              className="w-full h-full object-cover"
                            />
                            {/* Overlay showing detection bounds */}
                            <div className="absolute inset-0 pointer-events-none">
                              <div 
                                className="absolute border-2 border-crd-green bg-crd-green/20"
                                style={{
                                  left: `${(card.bounds.x / 800) * 100}%`, // Assuming 800px width for demo
                                  top: `${(card.bounds.y / 600) * 100}%`,   // Assuming 600px height for demo
                                  width: `${(card.bounds.width / 800) * 100}%`,
                                  height: `${(card.bounds.height / 600) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-crd-lightGray text-xs mb-1">Cropped Card</p>
                          <div className="aspect-[3/4] bg-editor-tool rounded overflow-hidden">
                            <img
                              src={card.croppedImageUrl}
                              alt={`Cropped card ${card.id}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card info */}
                      <div className="mb-3">
                        <p className="text-white text-sm font-medium">{card.metadata.cardType || 'Card'}</p>
                        <p className="text-crd-lightGray text-xs">
                          {Math.round(card.confidence * 100)}% confidence
                        </p>
                        <p className="text-crd-lightGray text-xs">
                          Dimensions: {Math.round(card.bounds.width)}×{Math.round(card.bounds.height)}px
                        </p>
                      </div>

                      {/* Selection controls */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleCardSelection(card.id)}
                          className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-all ${
                            isSelected 
                              ? 'bg-crd-green text-black' 
                              : 'bg-crd-mediumGray text-white hover:bg-crd-lightGray'
                          }`}
                        >
                          {isSelected ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 border border-white rounded" />}
                          {isSelected ? 'Selected' : 'Select'}
                        </button>

                        {/* Future: Add adjust bounds button */}
                        <button
                          className="text-crd-lightGray hover:text-white text-xs opacity-50 cursor-not-allowed"
                          disabled
                          title="Crop adjustment coming soon"
                        >
                          Adjust Crop
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CREATING PHASE */}
          {phase === 'creating' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">Creating Cards</h3>
              <p className="text-crd-lightGray">Processing and cropping your selected cards...</p>
            </div>
          )}

          {/* COMPLETE PHASE */}
          {phase === 'complete' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-crd-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Cards Created Successfully!</h3>
              <p className="text-crd-lightGray mb-6">
                Your cards have been processed and added to your collection
              </p>
              <Button
                onClick={startOver}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                Upload More Cards
              </Button>
            </div>
          )}
        </div>

        {/* Card Collection */}
        {createdCards.length > 0 && (
          <div className="bg-editor-dark rounded-xl p-8 border border-crd-mediumGray/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Your Card Collection</h2>
                <p className="text-crd-lightGray">{createdCards.length} cards in your collection</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {createdCards.map((card) => (
                <div key={card.id} className="relative group">
                  <div className="aspect-[3/4] bg-editor-tool rounded-lg overflow-hidden border border-crd-mediumGray">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadCard(card)}
                        className="w-8 h-8 p-0 bg-black/70 hover:bg-black/90 text-white"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Card info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                      <p className="text-white text-xs font-medium">{card.title}</p>
                      <p className="text-crd-lightGray text-xs">
                        {Math.round(card.confidence * 100)}% confidence
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
