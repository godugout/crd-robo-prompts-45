
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { ExtractedCard } from '@/services/cardExtractor';
import type { ManualRegion } from './types';

export const useCardExtraction = () => {
  const [extractedCards, setExtractedCards] = useState<ExtractedCard[]>([]);

  const extractCardsFromRegions = useCallback(async (
    originalImage: HTMLImageElement,
    selectedRegionIds: Set<string>,
    detectedRegions: ManualRegion[]
  ) => {
    if (!originalImage || selectedRegionIds.size === 0) return;
    
    try {
      const selectedRegionData = detectedRegions.filter(region => 
        selectedRegionIds.has(region.id)
      );
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get canvas context');
      
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      ctx.drawImage(originalImage, 0, 0);
      
      const cards: ExtractedCard[] = [];
      
      for (const region of selectedRegionData) {
        const cardCanvas = document.createElement('canvas');
        const cardCtx = cardCanvas.getContext('2d');
        if (!cardCtx) continue;
        
        const cardWidth = 350;
        const cardHeight = 490;
        
        cardCanvas.width = cardWidth;
        cardCanvas.height = cardHeight;
        
        cardCtx.drawImage(
          canvas,
          region.x, region.y, region.width, region.height,
          0, 0, cardWidth, cardHeight
        );
        
        const blob = await new Promise<Blob>((resolve, reject) => {
          cardCanvas.toBlob(
            (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
            'image/jpeg',
            0.95
          );
        });
        
        cards.push({
          imageBlob: blob,
          confidence: region.isManual ? 1.0 : 0.8,
          bounds: region,
          originalImage: originalImage.src
        });
      }
      
      setExtractedCards(cards);
      toast.success(`Extracted ${cards.length} cards successfully!`);
      return cards;
    } catch (error) {
      console.error('Card extraction error:', error);
      toast.error('Failed to extract cards');
      return [];
    }
  }, []);

  return {
    extractedCards,
    setExtractedCards,
    extractCardsFromRegions
  };
};
