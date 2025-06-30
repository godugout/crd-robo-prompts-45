
export interface TradeOffer {
  id: string;
  initiator_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired' | 'completed';
  offered_cards: TradeCard[];
  requested_cards: TradeCard[];
  trade_value_difference: number;
  cash_included: number;
  messages_channel_id: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  notes?: string;
  trade_rating?: number;
}

export interface TradeCard {
  id: string;
  title: string;
  image_url?: string;
  rarity: string;
  estimated_value: number;
}

export interface TradeMessage {
  id: string;
  trade_id: string;
  sender_id: string;
  message: string;
  message_type: 'text' | 'system' | 'offer' | 'image' | 'emoji';
  timestamp: string;
  read_status: boolean;
  attachment_url?: string;
  metadata: Record<string, any>;
}

export interface TradeDispute {
  id: string;
  trade_id: string;
  reporter_id: string;
  dispute_reason: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  resolution?: string;
  admin_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface TradeFeedback {
  id: string;
  trade_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  feedback?: string;
  created_at: string;
}

export interface UserTradePreferences {
  id: string;
  user_id: string;
  auto_accept_equal_trades: boolean;
  max_trade_value: number;
  preferred_trade_types: string[];
  blocked_users: string[];
  notification_preferences: {
    trade_offers: boolean;
    trade_updates: boolean;
    trade_messages: boolean;
    trade_completed: boolean;
  };
  created_at: string;
  updated_at: string;
}

// Database row types for proper casting
export interface TradeOfferRow {
  id: string;
  initiator_id: string;
  recipient_id: string;
  status: string;
  offered_cards: any;
  requested_cards: any;
  trade_value_difference: number;
  cash_included: number;
  messages_channel_id: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  notes?: string;
  trade_rating?: number;
}

export interface TradeMessageRow {
  id: string;
  trade_id: string;
  sender_id: string;
  message: string;
  message_type: string;
  timestamp: string;
  read_status: boolean;
  attachment_url?: string;
  metadata: any;
}
