
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MarketAnalytics, MarketTrend, MarketplaceMetrics } from '@/types/marketplace';

export const useMarketAnalytics = () => {
  // Get overall market metrics
  const { data: marketMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['market-metrics'],
    queryFn: async (): Promise<MarketplaceMetrics> => {
      // Get current date analytics
      const today = new Date().toISOString().split('T')[0];
      
      const { data: todayAnalytics, error } = await supabase
        .from('market_analytics')
        .select('*')
        .eq('date', today);

      if (error) throw error;

      const totalVolume = todayAnalytics?.reduce((sum, item) => sum + (item.volume || 0), 0) || 0;
      const totalTransactions = todayAnalytics?.reduce((sum, item) => sum + (item.transactions || 0), 0) || 0;
      const averagePrice = todayAnalytics?.reduce((sum, item) => sum + (item.avg_price || 0), 0) / Math.max(todayAnalytics?.length || 1, 1);
      const priceChange24h = todayAnalytics?.reduce((sum, item) => sum + (item.price_change_24h || 0), 0) / Math.max(todayAnalytics?.length || 1, 1);
      const marketCap = todayAnalytics?.reduce((sum, item) => sum + (item.market_cap || 0), 0) || 0;

      // Get top trending cards
      const topTrendingCards = todayAnalytics
        ?.filter(item => item.trending_score && item.trending_score > 0)
        .sort((a, b) => (b.trending_score || 0) - (a.trending_score || 0))
        .slice(0, 10)
        .map(item => ({
          card_id: item.card_id,
          title: 'Card Title', // Would need to join with cards table
          trending_score: item.trending_score || 0,
          price_change: item.price_change_24h || 0
        })) || [];

      return {
        totalVolume,
        totalTransactions,
        averagePrice,
        priceChange24h,
        topTrendingCards,
        marketCap
      };
    },
    refetchInterval: 60000 // Update every minute
  });

  // Get trending cards
  const { data: trendingCards = [], isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analytics')
        .select(`
          card_id,
          trending_score,
          price_change_24h,
          volume,
          cards (
            id,
            title,
            image_url,
            rarity
          )
        `)
        .gte('trending_score', 0.1)
        .order('trending_score', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 300000 // Update every 5 minutes
  });

  // Get market trends
  const { data: marketTrends = [], isLoading: trendsLoading } = useQuery({
    queryKey: ['market-trends'],
    queryFn: async (): Promise<MarketTrend[]> => {
      const { data, error } = await supabase
        .from('market_trends')
        .select('*')
        .gte('strength', 0.3)
        .order('strength', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Type assertion to handle the database type conversion
      return (data || []).map(trend => ({
        ...trend,
        trend_type: trend.trend_type as 'card' | 'category' | 'global',
        trend_data: trend.trend_data as Record<string, any>
      }));
    },
    refetchInterval: 600000 // Update every 10 minutes
  });

  // Get card analytics for specific card
  const getCardAnalytics = async (cardId: string, days: number = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('market_analytics')
      .select('*')
      .eq('card_id', cardId)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  };

  return {
    marketMetrics,
    metricsLoading,
    trendingCards,
    trendingLoading,
    marketTrends,
    trendsLoading,
    getCardAnalytics
  };
};
