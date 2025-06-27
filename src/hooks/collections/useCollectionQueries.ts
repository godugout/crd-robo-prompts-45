
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock data for now - in real app would connect to Supabase
const mockCollectionCards = (collectionId: string) => [
  {
    id: '1',
    card: {
      id: '1',
      title: 'Sample Card 1',
      description: 'A beautiful sample card',
      image_url: '/lovable-uploads/sample.png',
      rarity: 'rare',
      tags: ['sample', 'demo'],
      creator_name: 'Demo Creator',
      created_at: new Date().toISOString()
    }
  },
  {
    id: '2', 
    card: {
      id: '2',
      title: 'Sample Card 2',
      description: 'Another sample card',
      image_url: '/lovable-uploads/sample2.png',
      rarity: 'epic',
      tags: ['sample', 'premium'],
      creator_name: 'Pro Creator',
      created_at: new Date().toISOString()
    }
  }
];

const mockCollections = [
  {
    id: '1',
    title: 'My Sample Collection',
    description: 'A demonstration collection',
    visibility: 'public' as const,
    views_count: 42,
    likes_count: 8,
    completion_rate: 75,
    created_at: new Date().toISOString(),
    cover_image_url: '/lovable-uploads/sample.png',
    tags: ['demo', 'sample'],
    is_template: false
  }
];

const mockActivities = [
  {
    id: '1',
    activity_type: 'card_added',
    activity_data: { card_id: '1', quantity: 1 },
    created_at: new Date().toISOString(),
    user: { username: 'demo_user' }
  }
];

const mockComments = [
  {
    id: '1',
    content: 'Great collection!',
    created_at: new Date().toISOString(),
    user: { username: 'commenter' }
  }
];

export const useCollectionCards = (collectionId: string) => {
  return useQuery({
    queryKey: ['collection-cards', collectionId],
    queryFn: () => Promise.resolve(mockCollectionCards(collectionId)),
    enabled: !!collectionId
  });
};

export const useUserCollections = (userId: string) => {
  return useQuery({
    queryKey: ['user-collections', userId],
    queryFn: () => Promise.resolve(mockCollections),
    enabled: !!userId
  });
};

export const usePublicCollections = (limit: number = 20) => {
  return useQuery({
    queryKey: ['public-collections', limit],
    queryFn: () => Promise.resolve(mockCollections),
  });
};

export const useCollection = (collectionId: string) => {
  return useQuery({
    queryKey: ['collection', collectionId],
    queryFn: () => Promise.resolve(mockCollections[0]),
    enabled: !!collectionId
  });
};

export const useCollections = (filters: any = {}) => {
  return useQuery({
    queryKey: ['collections', filters],
    queryFn: () => Promise.resolve({ collections: mockCollections, total: mockCollections.length }),
  });
};

export const useCollectionActivity = (collectionId: string, limit: number = 50) => {
  return useQuery({
    queryKey: ['collection-activity', collectionId, limit],
    queryFn: () => Promise.resolve(mockActivities),
    enabled: !!collectionId
  });
};

export const useCollectionComments = (collectionId: string) => {
  return useQuery({
    queryKey: ['collection-comments', collectionId],
    queryFn: () => Promise.resolve(mockComments),
    enabled: !!collectionId
  });
};

export const useCollectionAnalytics = (collectionId: string) => {
  return useQuery({
    queryKey: ['collection-analytics', collectionId],
    queryFn: () => Promise.resolve({
      total_cards: 12,
      total_followers: 45,
      engagement_rate: 0.85
    }),
    enabled: !!collectionId
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // Mock creation
      return { id: Date.now().toString(), ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    }
  });
};

export const useAddCardToCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ collectionId, cardId, quantity }: any) => {
      // Mock addition
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-cards'] });
    }
  });
};

export const useRemoveCardFromCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ collectionId, cardId }: any) => {
      // Mock removal
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-cards'] });
    }
  });
};

export const useCollectionsRealtime = () => {
  // Mock realtime hook
  return null;
};
