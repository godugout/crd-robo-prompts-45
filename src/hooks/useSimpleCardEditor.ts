import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import type { CardData, CardRarity } from '@/types/card';

// Helper function to check if a string is a valid UUID
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const useSimpleCardEditor = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [cardData, setCardData] = useState<CardData>({
    id: uuidv4(),
    title: '',
    description: '',
    rarity: 'common' as CardRarity,
    tags: [],
    design_metadata: {},
    visibility: 'public', // Changed from 'private' to 'public'
    is_public: true, // Added this to make cards public by default
    creator_attribution: { collaboration_type: 'solo' },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    }
  });

  const updateField = <K extends keyof CardData>(field: K, value: CardData[K]) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const saveCard = async (): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Please sign in to save cards');
      return false;
    }

    if (!cardData.title.trim()) {
      toast.error('Please enter a card title');
      return false;
    }

    setIsSaving(true);
    try {
      // Prepare data for database - only include fields that exist in the schema
      const dbCard = {
        id: cardData.id,
        title: cardData.title.trim(),
        description: cardData.description?.trim() || null,
        creator_id: user.id,
        rarity: cardData.rarity,
        tags: cardData.tags,
        image_url: cardData.image_url || null,
        thumbnail_url: cardData.thumbnail_url || null,
        design_metadata: cardData.design_metadata,
        is_public: cardData.visibility === 'public' || cardData.is_public, // Ensure cards are public
        // Only set template_id if it's a valid UUID, otherwise store in design_metadata
        template_id: (cardData.template_id && isValidUUID(cardData.template_id)) ? cardData.template_id : null,
        collection_id: cardData.collection_id || null,
        team_id: cardData.team_id || null,
        creator_attribution: cardData.creator_attribution,
        publishing_options: cardData.publishing_options,
        verification_status: 'pending' as const,
        print_metadata: cardData.print_metadata || {},
        price: cardData.price || null,
        edition_size: cardData.edition_size || 1,
        marketplace_listing: cardData.publishing_options.marketplace_listing,
        crd_catalog_inclusion: cardData.publishing_options.crd_catalog_inclusion,
        print_available: cardData.publishing_options.print_available
      };

      // If template_id is not a valid UUID, store it in design_metadata instead
      if (cardData.template_id && !isValidUUID(cardData.template_id)) {
        dbCard.design_metadata = {
          ...dbCard.design_metadata,
          template_reference: cardData.template_id
        };
      }

      const { error } = await supabase
        .from('cards')
        .upsert(dbCard, { onConflict: 'id' });

      if (error) {
        console.error('Save error:', error);
        toast.error(`Failed to save: ${error.message}`);
        return false;
      }

      setLastSaved(new Date());
      toast.success('Card saved and published to gallery!');
      return true;
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save card');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const publishCard = async (): Promise<boolean> => {
    // First save the card
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

      updateField('visibility', 'public');
      updateField('is_public', true);
      toast.success('Card published successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to publish card');
      return false;
    }
  };

  const downloadCardAsImage = async () => {
    try {
      // Find the card preview element
      const cardElement = document.querySelector('.card-preview') as HTMLElement;
      
      if (!cardElement) {
        toast.error('Card preview not found. Please make sure the card is visible.');
        return;
      }

      // Import html2canvas dynamically to match the pattern used in useCardExport
      const { default: html2canvas } = await import('html2canvas');
      
      // Capture the card element as canvas
      const canvas = await html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to generate image');
          return;
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cardData.title.replace(/\s+/g, '_')}_card.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('Card image downloaded successfully!');
      }, 'image/png');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download card image');
    }
  };

  return {
    cardData,
    updateField,
    saveCard,
    publishCard,
    downloadCardAsImage,
    isSaving,
    lastSaved
  };
};
