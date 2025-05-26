
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { localCardStorage } from '@/lib/localCardStorage';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { supabase } from '@/lib/supabase-client';
import type { CardData } from './types';

export const useLocalAutoSave = (
  cardData: CardData,
  isDirty: boolean,
  updateCardData: (data: Partial<CardData>) => void,
  autoSaveInterval: number = 5000, // Save locally every 5 seconds
  syncDelay: number = 30000 // Sync to server after 30 seconds of inactivity
) => {
  const { user } = useCustomAuth();
  const lastSaveTime = useRef<number>(0);
  const syncTimeoutRef = useRef<NodeJS.Timeout>();

  // Local auto-save
  useEffect(() => {
    if (!isDirty) return;
    
    const timer = setTimeout(() => {
      if (isDirty) {
        const cardId = localCardStorage.saveCard(cardData);
        
        // If card doesn't have an ID yet, update it
        if (!cardData.id) {
          updateCardData({ id: cardId });
        }
        
        lastSaveTime.current = Date.now();
        console.log('Card saved locally:', cardId);
        
        // Clear any existing sync timeout
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
        
        // Schedule server sync after delay (only if user is authenticated)
        if (user) {
          syncTimeoutRef.current = setTimeout(() => {
            syncToServer(cardId);
          }, syncDelay);
        }
      }
    }, autoSaveInterval);
    
    return () => clearTimeout(timer);
  }, [cardData, isDirty, autoSaveInterval, syncDelay, updateCardData, user]);

  const syncToServer = async (cardId: string) => {
    if (!user) {
      console.log('User not authenticated, skipping server sync');
      return;
    }

    const localCard = localCardStorage.getCard(cardId);
    if (!localCard || !localCard.needsSync) {
      return;
    }

    try {
      console.log('Syncing card to server:', cardId);
      
      // Check if card exists in database
      const { data: existingCard } = await supabase
        .from('cards')
        .select('id')
        .eq('id', cardId)
        .single();

      if (existingCard) {
        // Update existing card
        const { error } = await supabase
          .from('cards')
          .update({
            title: localCard.title,
            description: localCard.description,
            design_metadata: localCard.design_metadata,
            image_url: localCard.image_url,
            thumbnail_url: localCard.thumbnail_url,
            rarity: localCard.rarity,
            tags: localCard.tags,
            is_public: localCard.is_public || false,
            template_id: localCard.template_id && localCard.template_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? localCard.template_id : null,
            creator_attribution: localCard.creator_attribution,
            publishing_options: localCard.publishing_options,
            print_metadata: localCard.print_metadata,
            updated_at: new Date().toISOString(),
          })
          .eq('id', cardId);
        
        if (error) throw error;
      } else {
        // Create new card (allow null creator_id for anonymous users initially)
        const { error } = await supabase
          .from('cards')
          .insert({
            id: cardId,
            title: localCard.title,
            description: localCard.description,
            creator_id: user.id, // Now we have the user id
            design_metadata: localCard.design_metadata,
            image_url: localCard.image_url,
            thumbnail_url: localCard.thumbnail_url,
            rarity: localCard.rarity,
            tags: localCard.tags,
            is_public: localCard.is_public || false,
            template_id: localCard.template_id && localCard.template_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? localCard.template_id : null,
            creator_attribution: localCard.creator_attribution,
            publishing_options: localCard.publishing_options,
            verification_status: 'pending',
            print_metadata: localCard.print_metadata
          });
        
        if (error) throw error;
      }

      // Mark as synced
      localCardStorage.markAsSynced(cardId);
      toast.success('Card synced to cloud', { duration: 2000 });
      
    } catch (error) {
      console.error('Error syncing card to server:', error);
      toast.error('Failed to sync to cloud - saved locally', { duration: 3000 });
    }
  };

  return {
    lastSaveTime: lastSaveTime.current,
    forceSyncToServer: () => {
      if (cardData.id) {
        syncToServer(cardData.id);
      }
    }
  };
};
