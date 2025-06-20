
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { CardRarity } from '@/types/card';

interface CardData {
  id?: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  template_id?: string;
  rarity: CardRarity;
  tags: string[];
}

export const useSimpleCardEditor = () => {
  const [cardData, setCardData] = useState<CardData>({
    title: '',
    description: '',
    image_url: '',
    thumbnail_url: '',
    template_id: '',
    rarity: 'common',
    tags: []
  });
  const [isSaving, setIsSaving] = useState(false);

  const updateField = useCallback((field: keyof CardData, value: any) => {
    console.log('📝 Updating card field:', field, value);
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const saveCard = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('💾 Saving card:', cardData);
      
      // In a real app, this would save to database
      const savedCard = {
        ...cardData,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      };
      
      console.log('✅ Card saved successfully:', savedCard);
      toast.success('Card saved successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to save card:', error);
      toast.error('Failed to save card');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [cardData]);

  const publishCard = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🚀 Publishing card:', cardData);
      
      // In a real app, this would save and publish to database
      const publishedCard = {
        ...cardData,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        is_public: true
      };
      
      console.log('✅ Card published successfully:', publishedCard);
      toast.success('Card published successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to publish card:', error);
      toast.error('Failed to publish card');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [cardData]);

  return {
    cardData,
    updateField,
    saveCard,
    publishCard,
    isSaving
  };
};
