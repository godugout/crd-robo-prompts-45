
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Scissors, Download, X, Check, Eye, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { extractCardsFromImage, type ExtractedCard } from '@/services/cardExtractor';

interface CardDetectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCardsExtracted: (cards: ExtractedCard[]) => void;
}

export const CardDetectionDialog = ({ 
  isOpen, 
  onClose, 
  onCardsExtracted 
}: CardDetectionDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedCards, setExtractedCards] = useState<ExtractedCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [currentStep, setCurrentStep] = useState<'upload' | 'review'>('upload');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsProcessing(true);
    try {
      toast.info('Analyzing image for trading cards...');
      const cards = await extractCardsFromImage(file);
      
      if (cards.length === 0) {
        toast.warning('No trading cards detected in the image');
        setCurrentStep('upload');
      } else {
        toast.success(`Found ${cards.length} potential trading cards!`);
        setExtractedCards(cards);
        setSelectedCards(new Set(cards.map((_, index) => index)));
        setCurrentStep('review');
      }
    } catch (error) {
      console.error('Card extraction error:', error);
      toast.error('Failed to analyze image for cards');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  const toggleCardSelection = (index: number) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedCards(newSelected);
  };

  const handleUseSelected = () => {
    const selectedCardData = extractedCards.filter((_, index) => selectedCards.has(index));
    onCardsExtracted(selectedCardData);
    toast.success(`Using ${selectedCardData.length} extracted cards`);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep('upload');
    setExtractedCards([]);
    setSelectedCards(new Set());
    setIsProcessing(false);
    onClose();
  };

  const goBackToUpload = () => {
    setCurrentStep('upload');
    setExtractedCards([]);
    setSelectedCards(new Set());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0 bg-gray-900 border-gray-700">
        <DialogHeader className="p-6 pb-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStep === 'review' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBackToUpload}
                  className="text-gray-300 hover:text-white p-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <DialogTitle className="text-white text-xl">
                {currentStep === 'upload' ? 'Card Detection & Extraction' : `Review Detected Cards (${extractedCards.length})`}
              </DialogTitle>
            </div>
            {currentStep === 'review' && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'large' : 'grid')}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {viewMode === 'grid' ? 'Large View' : 'Grid View'}
                </Button>
                <Button
                  onClick={handleUseSelected}
                  disabled={selectedCards.size === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Use {selectedCards.size} Cards
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {currentStep === 'upload' ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="max-w-2xl w-full">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-16 text-center transition-all cursor-pointer
                    ${isDragActive 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-gray-600 hover:border-green-500/50 hover:bg-gray-800/50'
                    }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-6">
                    {isProcessing ? (
                      <>
                        <Scissors className="w-20 h-20 text-green-500 animate-pulse" />
                        <div className="text-white text-2xl font-medium">Extracting Cards...</div>
                        <div className="text-gray-400 text-lg">
                          Analyzing image for trading cards with enhanced detection
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-20 h-20 text-gray-400" />
                        <div className="text-white text-2xl font-medium">
                          {isDragActive ? 'Drop image here' : 'Upload Image for Card Detection'}
                        </div>
                        <div className="text-gray-400 text-lg max-w-md">
                          Upload any image with trading cards. Our AI will detect and extract them with precise cropping.
                        </div>
                        <div className="text-sm text-gray-500 mt-4">
                          Works with screenshots, collection photos, or any card images
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Controls */}
              <div className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400">
                      {selectedCards.size} of {extractedCards.length} selected
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCards(new Set(extractedCards.map((_, i) => i)))}
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCards(new Set())}
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>

              {/* Cards Display */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {extractedCards.map((card, index) => (
                          <div
                            key={index}
                            className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all ${
                              selectedCards.has(index)
                                ? 'ring-2 ring-green-500 shadow-lg scale-105'
                                : 'hover:scale-102 hover:shadow-md ring-1 ring-gray-600'
                            }`}
                            onClick={() => toggleCardSelection(index)}
                          >
                            <img
                              src={URL.createObjectURL(card.imageBlob)}
                              alt={`Extracted card ${index + 1}`}
                              className="w-full aspect-[3/4] object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute top-2 right-2">
                              <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {Math.round(card.confidence * 100)}%
                              </div>
                            </div>
                            {selectedCards.has(index) && (
                              <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {extractedCards.map((card, index) => (
                          <div
                            key={index}
                            className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all ${
                              selectedCards.has(index)
                                ? 'ring-2 ring-green-500 shadow-xl'
                                : 'hover:shadow-lg ring-1 ring-gray-600'
                            }`}
                            onClick={() => toggleCardSelection(index)}
                          >
                            <img
                              src={URL.createObjectURL(card.imageBlob)}
                              alt={`Extracted card ${index + 1}`}
                              className="w-full aspect-[3/4] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex items-center justify-between">
                                <div className="text-white font-medium">
                                  Card {index + 1}
                                </div>
                                <div className="bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                                  {Math.round(card.confidence * 100)}% confidence
                                </div>
                              </div>
                            </div>
                            {selectedCards.has(index) && (
                              <div className="absolute top-4 left-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
