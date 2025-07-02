
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useCollectionRealtime = (collectionId?: string) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!collectionId) return;

    console.log('Setting up realtime for collection:', collectionId);

    const channel = supabase
      .channel(`collection-${collectionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collections',
          filter: `id=eq.${collectionId}`
        },
        (payload) => {
          console.log('Collection updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['collection', collectionId] });
          queryClient.invalidateQueries({ queryKey: ['collection-analytics', collectionId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collection_cards',
          filter: `collection_id=eq.${collectionId}`
        },
        (payload) => {
          console.log('Collection cards updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['collection-cards', collectionId] });
          queryClient.invalidateQueries({ queryKey: ['collection-analytics', collectionId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collection_activity',
          filter: `collection_id=eq.${collectionId}`
        },
        (payload) => {
          console.log('Collection activity:', payload);
          queryClient.invalidateQueries({ queryKey: ['collection-activity', collectionId] });
          
          // Optimistically update activity cache
          if (payload.eventType === 'INSERT') {
            queryClient.setQueryData(
              ['collection-activity', collectionId],
              (old: any[] = []) => [payload.new, ...old]
            );
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collection_comments',
          filter: `collection_id=eq.${collectionId}`
        },
        (payload) => {
          console.log('Collection comments updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['collection-comments', collectionId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collection_followers',
          filter: `collection_id=eq.${collectionId}`
        },
        (payload) => {
          console.log('Collection followers updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['collection-followers', collectionId] });
          queryClient.invalidateQueries({ queryKey: ['collection-analytics', collectionId] });
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [collectionId, queryClient]);

  return { isConnected };
};

export const useCollectionsRealtime = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('Setting up global collections realtime');

    const channel = supabase
      .channel('collections-global')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collections'
        },
        (payload) => {
          console.log('Global collections updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['collections'] });
          queryClient.invalidateQueries({ queryKey: ['user-collections'] });
          queryClient.invalidateQueries({ queryKey: ['public-collections'] });
          queryClient.invalidateQueries({ queryKey: ['featured-collections'] });
          
          // Update specific collection cache if it exists
          if (payload.eventType === 'UPDATE' && payload.new) {
            const collection = payload.new;
            queryClient.setQueryData(['collection', collection.id], collection);
          }
        }
      )
      .subscribe((status) => {
        console.log('Global collections subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      console.log('Cleaning up global collections subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { isConnected };
};
