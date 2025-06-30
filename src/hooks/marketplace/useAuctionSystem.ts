import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AuctionBid, AuctionExtension } from '@/types/marketplace';
import { toast } from 'sonner';
import { useEffect, useCallback } from 'react';

export const useAuctionSystem = (listingId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get auction bids for a listing
  const { data: bids = [], isLoading: bidsLoading } = useQuery({
    queryKey: ['auction-bids', listingId],
    queryFn: async (): Promise<AuctionBid[]> => {
      if (!listingId) return [];

      const { data, error } = await supabase
        .from('auction_bids')
        .select('*')
        .eq('listing_id', listingId)
        .order('amount', { ascending: false });

      if (error) throw error;
      
      // Type assertion to handle the database type conversion
      return (data || []).map(bid => ({
        ...bid,
        bid_type: bid.bid_type as 'manual' | 'proxy' | 'auto_increment',
        metadata: bid.metadata as Record<string, any>
      }));
    },
    enabled: !!listingId,
    refetchInterval: 2000 // Real-time updates every 2 seconds
  });

  // Get current winning bid
  const winningBid = bids.find(bid => bid.is_winning_bid);
  const currentPrice = winningBid?.amount || 0;

  // Enhanced place bid with mobile optimization
  const placeBid = useMutation({
    mutationFn: async (params: {
      amount: number;
      proxyMaxAmount?: number;
      bidType?: 'manual' | 'proxy' | 'auto_increment';
    }) => {
      if (!user?.id || !listingId) throw new Error('User not authenticated or listing not found');

      const { amount, proxyMaxAmount, bidType = 'manual' } = params;

      // Optimistic update for mobile responsiveness
      const optimisticBid = {
        id: `temp-${Date.now()}`,
        listing_id: listingId,
        bidder_id: user.id,
        amount,
        proxy_max_amount: proxyMaxAmount,
        bid_type: bidType,
        is_winning_bid: true,
        created_at: new Date().toISOString(),
        metadata: {}
      };

      // Update cache immediately for mobile UX
      queryClient.setQueryData(['auction-bids', listingId], (oldData: any) => {
        if (!oldData) return [optimisticBid];
        return [optimisticBid, ...oldData.map((bid: any) => ({ ...bid, is_winning_bid: false }))];
      });

      // First, update all existing bids to not be winning
      await supabase
        .from('auction_bids')
        .update({ is_winning_bid: false })
        .eq('listing_id', listingId);

      // Place the new bid
      const { data, error } = await supabase
        .from('auction_bids')
        .insert({
          listing_id: listingId,
          bidder_id: user.id,
          amount,
          proxy_max_amount: proxyMaxAmount,
          bid_type: bidType,
          is_winning_bid: true,
          metadata: {
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            mobile: window.innerWidth < 768
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Check if auction needs extension (sniping protection)
      await checkAuctionExtension(listingId, data.id);

      return data;
    },
    onSuccess: () => {
      // Mobile-friendly success feedback
      if (window.navigator.vibrate) {
        window.navigator.vibrate(200);
      }
      
      toast.success('Bid placed successfully!');
      queryClient.invalidateQueries({ queryKey: ['auction-bids', listingId] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
    },
    onError: (error) => {
      console.error('Error placing bid:', error);
      
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: ['auction-bids', listingId] });
      
      // Mobile-friendly error feedback
      if (window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 100]);
      }
    }
  });

  // Check for auction extension (anti-sniping)
  const checkAuctionExtension = async (listingId: string, bidId: string) => {
    try {
      // Get the listing end time
      const { data: listing } = await supabase
        .from('marketplace_listings')
        .select('auction_end_time')
        .eq('id', listingId)
        .single();

      if (!listing?.auction_end_time) return;

      const endTime = new Date(listing.auction_end_time);
      const now = new Date();
      const timeRemaining = endTime.getTime() - now.getTime();
      const fiveMinutes = 5 * 60 * 1000;

      // If bid placed within 5 minutes of auction end, extend by 5 minutes
      if (timeRemaining <= fiveMinutes) {
        const newEndTime = new Date(endTime.getTime() + fiveMinutes);

        // Update listing end time
        await supabase
          .from('marketplace_listings')
          .update({ auction_end_time: newEndTime.toISOString() })
          .eq('id', listingId);

        // Record the extension
        await supabase
          .from('auction_extensions')
          .insert({
            listing_id: listingId,
            original_end_time: listing.auction_end_time,
            new_end_time: newEndTime.toISOString(),
            extension_minutes: 5,
            trigger_bid_id: bidId
          });

        toast.info('Auction extended by 5 minutes due to last-minute bid');
      }
    } catch (error) {
      console.error('Error checking auction extension:', error);
    }
  };

  // Auto-bid functionality for proxy bids
  const processProxyBids = useCallback(async (newBid: AuctionBid) => {
    try {
      // Find all proxy bids for this listing that could outbid the current bid
      const { data: proxyBids } = await supabase
        .from('auction_bids')
        .select('*')
        .eq('listing_id', listingId)
        .eq('bid_type', 'proxy')
        .gte('proxy_max_amount', newBid.amount)
        .neq('bidder_id', newBid.bidder_id)
        .order('proxy_max_amount', { ascending: false });

      if (proxyBids && proxyBids.length > 0) {
        const highestProxy = proxyBids[0];
        const incrementAmount = 1.00; // $1 increment
        const newBidAmount = Math.min(
          newBid.amount + incrementAmount,
          highestProxy.proxy_max_amount || 0
        );

        if (newBidAmount <= (highestProxy.proxy_max_amount || 0)) {
          // Place automatic counter-bid
          await placeBid.mutateAsync({
            amount: newBidAmount,
            proxyMaxAmount: highestProxy.proxy_max_amount || undefined,
            bidType: 'auto_increment'
          });
        }
      }
    } catch (error) {
      console.error('Error processing proxy bids:', error);
    }
  }, [listingId, placeBid]);

  // Real-time subscription to bid updates
  useEffect(() => {
    if (!listingId) return;

    const channel = supabase
      .channel(`auction-${listingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'auction_bids',
          filter: `listing_id=eq.${listingId}`
        },
        (payload) => {
          const newBid = {
            ...payload.new,
            bid_type: payload.new.bid_type as 'manual' | 'proxy' | 'auto_increment',
            metadata: payload.new.metadata as Record<string, any>
          } as AuctionBid;
          
          queryClient.invalidateQueries({ queryKey: ['auction-bids', listingId] });

          // Process proxy bids if this is a manual bid
          if (newBid.bid_type === 'manual' && newBid.bidder_id !== user?.id) {
            processProxyBids(newBid);
          }

          // Show notification for outbid
          if (user?.id && newBid.bidder_id !== user.id) {
            const userHasBids = bids.some(bid => bid.bidder_id === user.id);
            if (userHasBids) {
              toast.info(`You've been outbid! New bid: $${newBid.amount}`);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listingId, user?.id, bids, processProxyBids, queryClient]);

  // Enhanced return with mobile-specific features
  return {
    bids,
    winningBid,
    currentPrice,
    bidsLoading,
    placeBid,
    isPlacingBid: placeBid.isPending,
    // Mobile-specific helpers
    isMobile: window.innerWidth < 768,
    supportsVibration: !!window.navigator.vibrate,
    lastBidTime: bids[0]?.created_at
  };
};
