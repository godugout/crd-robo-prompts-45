
import { useQuery } from '@tanstack/react-query';

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

export const useCollectionCards = (collectionId: string) => {
  return useQuery({
    queryKey: ['collection-cards', collectionId],
    queryFn: () => Promise.resolve(mockCollectionCards(collectionId)),
    enabled: !!collectionId
  });
};
