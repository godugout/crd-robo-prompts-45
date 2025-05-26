
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CardData {
  id?: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity: 'common' | 'rare' | 'legendary';
  tags: string[];
  design_metadata: Record<string, any>;
  is_public: boolean;
  creator_id?: string;
}

export const useCardEditor = (initialData: Partial<CardData> = {}) => {
  const { user } = useAuth();
  const [cardData, setCardData] = useState<CardData>({
    id: initialData.id || uuidv4(),
    title: initialData.title || '',
    description: initialData.description || '',
    image_url: initialData.image_url,
    thumbnail_url: initialData.thumbnail_url,
    rarity: initialData.rarity || 'common',
    tags: initialData.tags || [],
    design_metadata: initialData.design_metadata || {},
    is_public: initialData.is_public || false,
    creator_id: user?.id
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (user?.id && !cardData.creator_id) {
      setCardData(prev => ({ ...prev, creator_id: user.id }));
    }
  }, [user?.id, cardData.creator_id]);

  const updateCardField = <K extends keyof CardData>(field: K, value: CardData[K]) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const updateDesignMetadata = (key: string, value: any) => {
    setCardData(prev => ({
      ...prev,
      design_metadata: { ...prev.design_metadata, [key]: value }
    }));
  };

  const saveCard = async (): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to save cards');
      return false;
    }

    if (!cardData.title.trim()) {
      toast.error('Please enter a card title');
      return false;
    }

    setIsSaving(true);
    try {
      const cardToSave = {
        ...cardData,
        creator_id: user.id,
        title: cardData.title.trim()
      };

      const { error } = await supabase
        .from('cards')
        .upsert(cardToSave, { onConflict: 'id' });

      if (error) {
        console.error('Error saving card:', error);
        toast.error('Failed to save card');
        return false;
      }

      setLastSaved(new Date());
      toast.success('Card saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const publishCard = async (): Promise<boolean> => {
    const saved = await saveCard();
    if (!saved) return false;

    try {
      const { error } = await supabase
        .from('cards')
        .update({ is_public: true })
        .eq('id', cardData.id);

      if (error) {
        toast.error('Failed to publish card');
        return false;
      }

      updateCardField('is_public', true);
      toast.success('Card published successfully');
      return true;
    } catch (error) {
      toast.error('Failed to publish card');
      return false;
    }
  };

  return {
    cardData,
    updateCardField,
    updateDesignMetadata,
    saveCard,
    publishCard,
    isSaving,
    lastSaved
  };
};
