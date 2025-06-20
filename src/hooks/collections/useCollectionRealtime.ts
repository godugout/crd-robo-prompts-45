
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import type { Collection, CollectionActivity, CollectionComment } from '@/types/collections';

export const useCollectionRealtime = (collectionId?: string) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!collectionId) return;

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
          
          // Update activity cache optimistically
          queryClient.setQueryData(
            ['collection-activity', collectionId],
            (old: CollectionActivity[] = []) => {
              if (payload.eventType === 'INSERT') {
                return [payload.new as CollectionActivity, ...old];
              }
              return old;
            }
          );
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
          
          // Update comments cache optimistically
          queryClient.setQueryData(
            ['collection-comments', collectionId],
            (old: CollectionComment[] = []) => {
              if (payload.eventType === 'INSERT') {
                return [...old, payload.new as CollectionComment];
              } else if (payload.eventType === 'DELETE') {
                return old.filter(comment => comment.id !== (payload.old as CollectionComment).id);
              } else if (payload.eventType === 'UPDATE') {
                return old.map(comment => 
                  comment.id === (payload.new as CollectionComment).id 
                    ? payload.new as CollectionComment 
                    : comment
                );
              }
              return old;
            }
          );
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
      supabase.removeChannel(channel);
    };
  }, [collectionId, queryClient]);

  return { isConnected };
};

export const useCollectionsRealtime = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
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
          console.log('Collections updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['collections'] });
          queryClient.invalidateQueries({ queryKey: ['user-collections'] });
          queryClient.invalidateQueries({ queryKey: ['public-collections'] });
          
          // Update specific collection cache if it exists
          if (payload.eventType === 'UPDATE') {
            const collection = payload.new as Collection;
            queryClient.setQueryData(['collection', collection.id], collection);
          }
        }
      )
      .subscribe((status) => {
        console.log('Global collections subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { isConnected };
};
