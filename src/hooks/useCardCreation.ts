
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { uploadCardImage } from '@/lib/imageUpload';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import type { CardRarity } from '@/types/card';

export interface CardCreationData {
  id: string;
  title: string;
  description: string;
  rarity: CardRarity;
  tags: string[];
  image_url?: string;
  template_id?: string;
  design_metadata: Record<string, any>;
}

export const useCardCreation = () => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [cardData, setCardData] = useState<CardCreationData>({
    id: uuidv4(),
    title: '',
    description: '',
    rarity: 'common',
    tags: [],
    design_metadata: {}
  });

  const updateCardData = (updates: Partial<CardCreationData>) => {
    setCardData(prev => ({ ...prev, ...updates }));
  };

  const uploadImage = async (file: File): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to upload images');
      return false;
    }

    try {
      const result = await uploadCardImage(file, user.id, cardData.id);
      if (result) {
        updateCardData({ image_url: result.publicUrl });
        toast.success('Image uploaded successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return false;
    }
  };

  const createCard = async (): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to create cards');
      return false;
    }

    if (!cardData.title.trim()) {
      toast.error('Please enter a card title');
      return false;
    }

    if (!cardData.image_url) {
      toast.error('Please upload an image for your card');
      return false;
    }

    setIsCreating(true);
    try {
      const cardToSave = {
        id: cardData.id,
        title: cardData.title.trim(),
        description: cardData.description?.trim() || '',
        rarity: cardData.rarity,
        tags: cardData.tags,
        image_url: cardData.image_url,
        thumbnail_url: cardData.image_url, // Use same image for thumbnail for now
        template_id: cardData.template_id || null,
        design_metadata: cardData.design_metadata,
        creator_id: user.id,
        is_public: true, // Make cards public by default
        edition_size: 1,
        verification_status: 'pending',
        print_metadata: {},
        creator_attribution: {
          creator_name: user.user_metadata?.full_name || user.email,
          collaboration_type: 'solo'
        },
        publishing_options: {
          marketplace_listing: false,
          crd_catalog_inclusion: true,
          print_available: false,
          pricing: { currency: 'USD' },
          distribution: { limited_edition: false }
        },
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false
      };

      const { error } = await supabase
        .from('crd_cards')
        .insert(cardToSave);

      if (error) {
        console.error('Database error:', error);
        toast.error(`Failed to create card: ${error.message}`);
        return false;
      }

      toast.success('Card created successfully!');
      
      // Reset form for next card
      const newId = uuidv4();
      setCardData({
        id: newId,
        title: '',
        description: '',
        rarity: 'common',
        tags: [],
        design_metadata: {}
      });

      return true;
    } catch (error) {
      console.error('Card creation error:', error);
      toast.error('Failed to create card');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !cardData.tags.includes(trimmedTag) && cardData.tags.length < 10) {
      updateCardData({ tags: [...cardData.tags, trimmedTag] });
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateCardData({ 
      tags: cardData.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  return {
    cardData,
    updateCardData,
    uploadImage,
    createCard,
    addTag,
    removeTag,
    isCreating
  };
};
