
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserPortfolio } from '@/types/marketplace';
import { toast } from 'sonner';

export const usePortfolioTracking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's portfolio
  const { data: portfolio = [], isLoading: portfolioLoading } = useQuery({
    queryKey: ['user-portfolio', user?.id],
    queryFn: async (): Promise<UserPortfolio[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_portfolios')
        .select(`
          *,
          cards (
            id,
            title,
            image_url,
            rarity
          )
        `)
        .eq('user_id', user.id)
        .order('current_value', { ascending: false });

      if (error) throw error;
      
      // Type assertion to handle the database type conversion
      return (data || []).map(item => ({
        ...item,
        metadata: item.metadata as Record<string, any>
      }));
    },
    enabled: !!user?.id
  });

  // Calculate portfolio totals
  const portfolioSummary = {
    totalInvested: portfolio.reduce((sum, item) => sum + (item.total_invested || 0), 0),
    currentValue: portfolio.reduce((sum, item) => sum + (item.current_value || 0), 0),
    totalPnL: portfolio.reduce((sum, item) => sum + (item.unrealized_pnl || 0) + (item.realized_pnl || 0), 0),
    unrealizedPnL: portfolio.reduce((sum, item) => sum + (item.unrealized_pnl || 0), 0),
    realizedPnL: portfolio.reduce((sum, item) => sum + (item.realized_pnl || 0), 0),
    totalCards: portfolio.reduce((sum, item) => sum + item.quantity, 0)
  };

  // Add card to portfolio (when purchasing)
  const addToPortfolio = useMutation({
    mutationFn: async (params: {
      cardId: string;
      quantity: number;
      purchasePrice: number;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { cardId, quantity, purchasePrice } = params;
      const totalCost = quantity * purchasePrice;

      // Check if card already exists in portfolio
      const { data: existing } = await supabase
        .from('user_portfolios')
        .select('*')
        .eq('user_id', user.id)
        .eq('card_id', cardId)
        .single();

      if (existing) {
        // Update existing position
        const newQuantity = existing.quantity + quantity;
        const newTotalInvested = (existing.total_invested || 0) + totalCost;
        const newAvgPrice = newTotalInvested / newQuantity;

        const { data, error } = await supabase
          .from('user_portfolios')
          .update({
            quantity: newQuantity,
            avg_purchase_price: newAvgPrice,
            total_invested: newTotalInvested,
            last_updated: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new position
        const { data, error } = await supabase
          .from('user_portfolios')
          .insert({
            user_id: user.id,
            card_id: cardId,
            quantity,
            avg_purchase_price: purchasePrice,
            total_invested: totalCost,
            current_value: totalCost, // Initial value equals purchase price
            unrealized_pnl: 0,
            realized_pnl: 0
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-portfolio', user?.id] });
      toast.success('Portfolio updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating portfolio:', error);
      toast.error('Failed to update portfolio');
    }
  });

  // Update portfolio values (called when market prices change)
  const updatePortfolioValues = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Call the database function to update portfolio values
      const { error } = await supabase.rpc('update_portfolio_value', {
        p_user_id: user.id,
        p_card_id: null // Update all cards for this user
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-portfolio', user?.id] });
    }
  });

  // Get portfolio performance over time
  const { data: performanceHistory = [] } = useQuery({
    queryKey: ['portfolio-performance', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // This would require additional tracking table for historical portfolio values
      // For now, return mock data structure
      return [];
    },
    enabled: !!user?.id
  });

  return {
    portfolio,
    portfolioLoading,
    portfolioSummary,
    addToPortfolio,
    updatePortfolioValues,
    performanceHistory,
    isUpdatingPortfolio: addToPortfolio.isPending || updatePortfolioValues.isPending
  };
};
