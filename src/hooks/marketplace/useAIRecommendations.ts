
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AIRecommendation {
  card_id: string;
  type: 'trending' | 'similar' | 'investment' | 'collection_complete';
  score: number;
  reasoning: {
    [key: string]: any;
    reason: string;
  };
  card: {
    id: string;
    title: string;
    image_url?: string;
    rarity: string;
    price?: number;
  };
}

export const useAIRecommendations = (type?: string, enabled = true) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ai-recommendations', user?.id, type],
    queryFn: async (): Promise<AIRecommendation[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          recommendation_type: type || 'personalized',
          limit: 20
        }
      });

      if (error) throw error;
      return data.recommendations || [];
    },
    enabled: enabled && !!user?.id,
    refetchInterval: 300000, // Refresh every 5 minutes
  });
};
