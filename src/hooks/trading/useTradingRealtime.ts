
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TradeOffer, TradeMessage } from './types';
import { toast } from 'sonner';

export const useTradingRealtime = (tradeId?: string) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Subscribe to trade offer updates
  const subscribeToTrade = useCallback((id: string) => {
    const channel = supabase
      .channel(`trade-${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trade_offers',
          filter: `id=eq.${id}`
        },
        (payload) => {
          console.log('Trade offer update:', payload);
          if (payload.eventType === 'UPDATE') {
            // Handle trade status updates
            const newStatus = payload.new.status;
            if (newStatus === 'accepted') {
              toast.success('Trade offer accepted!');
            } else if (newStatus === 'rejected') {
              toast.error('Trade offer rejected');
            } else if (newStatus === 'completed') {
              toast.success('Trade completed successfully!');
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trade_messages',
          filter: `trade_id=eq.${id}`
        },
        (payload) => {
          console.log('New trade message:', payload);
          const message = payload.new as any;
          if (message.sender_id !== user?.id) {
            // Show notification for new message from other user
            toast.info('New message in trade chat');
          }
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users = Object.keys(presenceState);
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setOnlineUsers(prev => [...prev, key]);
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setOnlineUsers(prev => prev.filter(user => user !== key));
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        const { user_id, is_typing } = payload;
        if (user_id !== user?.id) {
          setTypingUsers(prev => 
            is_typing 
              ? [...prev.filter(u => u !== user_id), user_id]
              : prev.filter(u => u !== user_id)
          );
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          // Track presence for this user
          if (user?.id) {
            await channel.track({
              user_id: user.id,
              online_at: new Date().toISOString()
            });
          }
        } else {
          setIsConnected(false);
        }
      });

    return channel;
  }, [user?.id]);

  // Subscribe to all user's trades
  const subscribeToUserTrades = useCallback(() => {
    if (!user?.id) return null;

    const channel = supabase
      .channel(`user-trades-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trade_offers',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New trade offer received:', payload);
          toast.info('You received a new trade offer!');
        }
      )
      .subscribe();

    return channel;
  }, [user?.id]);

  // Broadcast typing status
  const broadcastTyping = useCallback((tradeChannelId: string, isTyping: boolean) => {
    if (!user?.id) return;

    const channel = supabase.channel(`trade-${tradeChannelId}`);
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        user_id: user.id,
        is_typing: isTyping
      }
    });
  }, [user?.id]);

  // Send trade message
  const sendMessage = async (tradeId: string, message: string, messageType: TradeMessage['message_type'] = 'text') => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('trade_messages')
        .insert({
          trade_id: tradeId,
          sender_id: user.id,
          message,
          message_type: messageType,
          read_status: false
        })
        .select()
        .single();

      if (error) throw error;
      
      // Cast to our interface type
      return {
        ...data,
        message_type: data.message_type as TradeMessage['message_type'],
        metadata: data.metadata || {}
      } as TradeMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return null;
    }
  };

  useEffect(() => {
    let tradeChannel: any = null;
    let userTradesChannel: any = null;

    if (tradeId) {
      tradeChannel = subscribeToTrade(tradeId);
    }

    userTradesChannel = subscribeToUserTrades();

    return () => {
      if (tradeChannel) {
        supabase.removeChannel(tradeChannel);
      }
      if (userTradesChannel) {
        supabase.removeChannel(userTradesChannel);
      }
    };
  }, [tradeId, subscribeToTrade, subscribeToUserTrades]);

  return {
    isConnected,
    typingUsers,
    onlineUsers,
    broadcastTyping,
    sendMessage
  };
};
