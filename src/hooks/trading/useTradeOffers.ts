
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TradeOffer, TradeCard, TradeOfferRow } from './types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useTradeOffers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's trade offers
  const { data: userTrades, isLoading: isLoadingTrades } = useQuery({
    queryKey: ['trade-offers', user?.id],
    queryFn: async (): Promise<TradeOffer[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('trade_offers')
        .select('*')
        .or(`initiator_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the raw database results to our typed interface
      return (data || []).map((row: TradeOfferRow): TradeOffer => ({
        ...row,
        status: row.status as TradeOffer['status'],
        offered_cards: Array.isArray(row.offered_cards) ? row.offered_cards : [],
        requested_cards: Array.isArray(row.requested_cards) ? row.requested_cards : []
      }));
    },
    enabled: !!user?.id
  });

  // Create new trade offer
  const createTradeOffer = useMutation({
    mutationFn: async (params: {
      recipientId: string;
      offeredCards: TradeCard[];
      requestedCards: TradeCard[];
      notes?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { recipientId, offeredCards, requestedCards, notes } = params;
      
      // Calculate trade value difference
      const offeredValue = offeredCards.reduce((sum, card) => sum + card.estimated_value, 0);
      const requestedValue = requestedCards.reduce((sum, card) => sum + card.estimated_value, 0);
      const valueDifference = requestedValue - offeredValue;

      const channelId = uuidv4();

      const insertData = {
        initiator_id: user.id,
        recipient_id: recipientId,
        offered_cards: offeredCards as any, // Cast to any to satisfy Json type
        requested_cards: requestedCards as any, // Cast to any to satisfy Json type
        trade_value_difference: valueDifference,
        messages_channel_id: channelId,
        notes,
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours
      };

      const { data, error } = await supabase
        .from('trade_offers')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Trade offer sent successfully!');
      queryClient.invalidateQueries({ queryKey: ['trade-offers'] });
    },
    onError: (error) => {
      console.error('Error creating trade offer:', error);
      toast.error('Failed to send trade offer');
    }
  });

  // Accept trade offer
  const acceptTradeOffer = useMutation({
    mutationFn: async (tradeId: string) => {
      const { data, error } = await supabase
        .from('trade_offers')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', tradeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Trade offer accepted!');
      queryClient.invalidateQueries({ queryKey: ['trade-offers'] });
    },
    onError: (error) => {
      console.error('Error accepting trade:', error);
      toast.error('Failed to accept trade offer');
    }
  });

  // Reject trade offer
  const rejectTradeOffer = useMutation({
    mutationFn: async (tradeId: string) => {
      const { data, error } = await supabase
        .from('trade_offers')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', tradeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Trade offer rejected');
      queryClient.invalidateQueries({ queryKey: ['trade-offers'] });
    },
    onError: (error) => {
      console.error('Error rejecting trade:', error);
      toast.error('Failed to reject trade offer');
    }
  });

  // Complete trade
  const completeTradeOffer = useMutation({
    mutationFn: async (tradeId: string) => {
      const { data, error } = await supabase
        .from('trade_offers')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', tradeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Trade completed successfully!');
      queryClient.invalidateQueries({ queryKey: ['trade-offers'] });
    },
    onError: (error) => {
      console.error('Error completing trade:', error);
      toast.error('Failed to complete trade');
    }
  });

  return {
    userTrades,
    isLoadingTrades,
    createTradeOffer,
    acceptTradeOffer,
    rejectTradeOffer,
    completeTradeOffer
  };
};
