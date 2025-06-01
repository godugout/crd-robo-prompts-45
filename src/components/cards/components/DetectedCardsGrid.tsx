
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, RotateCcw, Save, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { CardDetectionResult } from '@/services/cardDetection';

interface DetectedCardsGridProps {
  results: CardDetectionResult[];
  onStartOver: () => void;
}

export const DetectedCardsGrid: React.FC<DetectedCardsGridProps> = ({
  results,
  onStartOver
}) => {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  
  const totalCards = results.reduce((sum, result) => sum + result.detectedCards.length, 0);

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

  const selectAll = () => {
    const allCardIds = results.flatMap(result => 
      result.detectedCards.map(card => card.id)
    );
    setSelectedCards(new Set(allCardIds));
  };

  const clearSelection = () => {
    setSelectedCards(new Set());
  };

  const downloadCard = async (card: any) => {
    try {
      const response = await fetch(card.croppedImageUrl);
      const blob = await response.blob();
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `card_${card.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Downloaded card ${card.id}`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download card');
    }
  };

  const saveSelectedCards = async () => {
    if (selectedCards.size === 0) {
      toast.warning('Please select at least one card to save');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Get all selected cards
      const cardsToSave = results.flatMap(result => 
        result.detectedCards.filter(card => selectedCards.has(card.id))
      );
      
      // For now, we'll download the selected cards
      // In a real app, this would save to a collection or database
      for (const card of cardsToSave) {
        await downloadCard(card);
      }
      
      toast.success(`Successfully saved ${selectedCards.size} cards to your collection!`);
      setSelectedCards(new Set()); // Clear selection after save
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save cards. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Detected Cards</h2>
        <p className="text-crd-lightGray">
          Found {totalCards} trading cards with high accuracy detection
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={selectAll}
            className="text-white border-crd-mediumGray hover:border-crd-green"
          >
            Select All ({totalCards})
          </Button>
          <Button
            variant="outline"
            onClick={clearSelection}
            className="text-white border-crd-mediumGray hover:border-red-500"
          >
            Clear Selection
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onStartOver}
            className="text-white border-crd-mediumGray hover:border-crd-green"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
          <Button
            onClick={saveSelectedCards}
            disabled={selectedCards.size === 0 || isSaving}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Selected ({selectedCards.size})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {results.map((result) =>
          result.detectedCards.map((card) => {
            const isSelected = selectedCards.has(card.id);
            
            return (
              <div key={card.id} className="relative">
                <Card
                  className={`relative cursor-pointer transition-all group ${
                    isSelected 
                      ? 'ring-2 ring-crd-green bg-crd-green/10' 
                      : 'hover:ring-1 hover:ring-crd-lightGray'
                  }`}
                  onClick={() => toggleCardSelection(card.id)}
                >
                  <div className="aspect-[2.5/3.5] bg-black rounded-lg overflow-hidden">
                    <img
                      src={card.croppedImageUrl}
                      alt={`Detected card ${card.id}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        // Fallback to original image if cropped fails
                        e.currentTarget.src = card.originalImageUrl;
                      }}
                    />
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-6 h-6 text-crd-green bg-black rounded-full" />
                      </div>
                    )}
                    
                    {/* Confidence Badge */}
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-1 bg-black/80 text-white text-xs rounded">
                        {Math.round(card.confidence * 100)}%
                      </span>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadCard(card);
                      }}
                      className="absolute top-2 left-2 w-8 h-8 bg-black/80 hover:bg-black rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      <div className="text-center text-crd-lightGray text-sm">
        <p>
          {selectedCards.size} of {totalCards} cards selected
        </p>
        <p className="mt-1">
          Click cards to select them, then use "Save Selected" to add them to your collection
        </p>
      </div>
    </div>
  );
};
