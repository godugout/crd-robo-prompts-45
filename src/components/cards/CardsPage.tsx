
import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, Image, Check, X, Download, RotateCw, Move, Square } from 'lucide-react';
import { toast } from 'sonner';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface DetectedCard {
  id: string;
  imageId: string;
  bounds: { x: number; y: number; width: number; height: number };
  confidence: number;
  croppedImage?: string;
}

interface CreatedCard {
  id: string;
  title: string;
  image: string;
  confidence: number;
  createdAt: Date;
}

type WorkflowPhase = 'idle' | 'uploading' | 'detecting' | 'reviewing' | 'creating' | 'complete';

export const CardsPage = () => {
  const [phase, setPhase] = useState<WorkflowPhase>('idle');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [createdCards, setCreatedCards] = useState<CreatedCard[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Simulate AI detection with realistic timing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const detected: DetectedCard[] = [];
    
    images.forEach((image, imgIndex) => {
      // Generate 1-3 mock detections per image
      const numCards = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numCards; i++) {
        detected.push({
          id: `card-${image.id}-${i}`,
          imageId: image.id,
          bounds: {
            x: Math.random() * 200 + 50,
            y: Math.random() * 200 + 50,
            width: 150 + Math.random() * 100,
            height: 200 + Math.random() * 100
          },
          confidence: 0.7 + Math.random() * 0.3
        });
      }
    });

    setDetectedCards(detected);
    setSelectedCards(new Set(detected.map(card => card.id)));
    
    toast.dismiss();
    toast.success(`Detected ${detected.length} cards`);
    setPhase('reviewing');
  };

  // Card cropping
  const cropCard = async (card: DetectedCard): Promise<string> => {
    const image = uploadedImages.find(img => img.id === card.imageId);
    if (!image) return '';

    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve('');
          return;
        }

        // Standard card dimensions
        canvas.width = 300;
        canvas.height = 420;

        // Draw cropped region
        ctx.drawImage(
          img,
          card.bounds.x, card.bounds.y, card.bounds.width, card.bounds.height,
          0, 0, canvas.width, canvas.height
        );

        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = image.preview;
    });
  };

  // Create selected cards
  const createSelectedCards = async () => {
    if (selectedCards.size === 0) {
      toast.error('Please select at least one card');
      return;
    }

    setPhase('creating');
    toast.loading('Creating cards...');

    const cardsToCreate = detectedCards.filter(card => selectedCards.has(card.id));
    const newCreatedCards: CreatedCard[] = [];

    // Process each selected card
    for (const card of cardsToCreate) {
      const croppedImage = await cropCard(card);
      
      newCreatedCards.push({
        id: `created-${card.id}`,
        title: `Card ${newCreatedCards.length + 1}`,
        image: croppedImage,
        confidence: card.confidence,
        createdAt: new Date()
      });

      // Show progress
      toast.dismiss();
      toast.loading(`Creating cards... ${newCreatedCards.length}/${cardsToCreate.length}`);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setCreatedCards(prev => [...prev, ...newCreatedCards]);
    
    toast.dismiss();
    toast.success(`Created ${newCreatedCards.length} cards!`);
    setPhase('complete');
    
    // Auto-reset after showing success
    setTimeout(() => {
      setPhase('idle');
      setUploadedImages([]);
      setDetectedCards([]);
      setSelectedCards(new Set());
    }, 3000);
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
    setDetectedCards([]);
    setSelectedCards(new Set());
    setCurrentImageIndex(0);
    setEditingCard(null);
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
                    Found {detectedCards.length} cards • {selectedCards.size} selected
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

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {detectedCards.map((card) => {
                  const isSelected = selectedCards.has(card.id);
                  
                  return (
                    <div
                      key={card.id}
                      className={`relative group cursor-pointer border-2 rounded-lg transition-all ${
                        isSelected 
                          ? 'border-crd-green bg-crd-green/10' 
                          : 'border-crd-mediumGray hover:border-crd-green/50'
                      }`}
                      onClick={() => toggleCardSelection(card.id)}
                    >
                      <div className="aspect-[3/4] bg-editor-tool rounded-lg overflow-hidden">
                        {/* Mock card preview */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Image className="w-8 h-8 mx-auto mb-2 opacity-70" />
                            <p className="text-xs opacity-70">Card Preview</p>
                            <p className="text-xs mt-1">{Math.round(card.confidence * 100)}%</p>
                          </div>
                        </div>
                        
                        {/* Selection indicator */}
                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isSelected ? 'bg-crd-green text-black' : 'bg-black/50 text-white'
                        }`}>
                          {isSelected ? <Check className="w-4 h-4" /> : <div className="w-3 h-3 border border-white rounded-full" />}
                        </div>
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
