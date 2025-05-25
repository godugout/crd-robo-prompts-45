
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Scissors, Download, X } from 'lucide-react';
import { toast } from 'sonner';
import { extractCardsFromImage, ExtractedCard } from '@/services/cardExtractor';

interface CardExtractionUploadProps {
  onCardsExtracted: (cards: ExtractedCard[]) => void;
}

export const CardExtractionUpload = ({ onCardsExtracted }: CardExtractionUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedCards, setExtractedCards] = useState<ExtractedCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());

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
      } else {
        toast.success(`Found ${cards.length} potential trading cards!`);
        setExtractedCards(cards);
        // Auto-select all cards initially
        setSelectedCards(new Set(cards.map((_, index) => index)));
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
    toast.success(`Using ${selectedCardData.length} extracted cards as frames`);
  };

  const clearResults = () => {
    setExtractedCards([]);
    setSelectedCards(new Set());
  };

  return (
    <div className="space-y-4">
      {extractedCards.length === 0 ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
            ${isDragActive 
              ? 'border-crd-green bg-crd-green/10' 
              : 'border-editor-border hover:border-crd-green/50 hover:bg-editor-tool/20'
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            {isProcessing ? (
              <>
                <Scissors className="w-12 h-12 text-crd-green animate-pulse" />
                <div className="text-white font-medium">Extracting Cards...</div>
                <div className="text-crd-lightGray text-sm">
                  Analyzing image for trading cards
                </div>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-crd-lightGray" />
                <div className="text-white font-medium">
                  {isDragActive ? 'Drop image here' : 'Upload Screenshot or Image'}
                </div>
                <div className="text-crd-lightGray text-sm">
                  Upload any image with trading cards and we'll extract them automatically
                </div>
                <div className="text-xs text-crd-lightGray mt-2">
                  Works with Instagram screenshots, collection photos, or any card images
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">
              Extracted Cards ({extractedCards.length})
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCards(new Set(extractedCards.map((_, i) => i)))}
                className="border-editor-border text-white hover:bg-editor-darker"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCards(new Set())}
                className="border-editor-border text-white hover:bg-editor-darker"
              >
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearResults}
                className="border-editor-border text-white hover:bg-editor-darker"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-96">
            <div className="grid grid-cols-3 gap-3 pr-4">
              {extractedCards.map((card, index) => (
                <div
                  key={index}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all ${
                    selectedCards.has(index)
                      ? 'ring-2 ring-crd-green shadow-lg scale-105'
                      : 'hover:scale-102 hover:shadow-md'
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
                    <div className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {Math.round(card.confidence * 100)}%
                    </div>
                  </div>
                  {selectedCards.has(index) && (
                    <div className="absolute top-2 left-2 w-5 h-5 bg-crd-green rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2">
            <Button
              onClick={handleUseSelected}
              disabled={selectedCards.size === 0}
              className="bg-crd-green hover:bg-crd-green/80"
            >
              <Download className="w-4 h-4 mr-2" />
              Use {selectedCards.size} Cards as Frames
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
