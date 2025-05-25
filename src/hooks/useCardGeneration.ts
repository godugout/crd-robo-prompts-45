
import { useState } from 'react';
import { toast } from 'sonner';
import { CardGenerator } from '@/services/cardGenerator';

export const useCardGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<string[]>([]);

  const generateCards = async (count: number = 101) => {
    setIsGenerating(true);
    try {
      const generator = new CardGenerator();
      const cardIds = await generator.generateAndSaveCards(count);
      setGeneratedCards(cardIds);
      toast.success(`Successfully generated ${cardIds.length} cards!`);
      return cardIds;
    } catch (error) {
      console.error('Error generating cards:', error);
      toast.error('Failed to generate cards. Please try again.');
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateCards,
    isGenerating,
    generatedCards
  };
};
