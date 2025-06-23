
export interface MarketplaceListing {
  id: string;
  seller_id: string;
  card_id: string;
  title: string;
  description?: string;
  price: number;
  listing_type: 'fixed_price' | 'auction' | 'make_offer'; // Updated to match database enum
  condition: 'mint' | 'near_mint' | 'excellent' | 'good' | 'fair' | 'poor';
  quantity: number;
  images?: string[];
  location?: string;
  shipping_cost?: number;
  estimated_delivery_days?: number;
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  views_count: number;
  watchers_count: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  
  // Auction specific fields
  starting_bid?: number;
  current_bid?: number;
  reserve_price?: number;
  auction_end_time?: string;
  
  // Related data
  card?: {
    id: string;
    title: string;
    image_url?: string;
    rarity: string;
  };
  seller?: {
    username: string;
    avatar_url?: string;
  };
}

export interface AuctionBid {
  id: string;
  listing_id: string;
  bidder_id: string;
  amount: number;
  proxy_max_amount?: number;
  bid_type: 'manual' | 'proxy' | 'auto_increment';
  is_winning_bid: boolean;
  created_at: string;
  metadata: Record<string, any>;
}

export interface MarketAnalytics {
  id: string;
  card_id: string;
  date: string;
  avg_price?: number;
  volume: number;
  transactions: number;
  price_change_24h?: number;
  market_cap?: number;
  liquidity_score?: number;
  trending_score?: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface MarketTrend {
  id: string;
  trend_type: 'card' | 'category' | 'global';
  entity_id?: string;
  trend_name: string;
  trend_data: Record<string, any>;
  strength?: number;
  duration_days?: number;
  created_at: string;
  expires_at?: string;
}

export interface UserPortfolio {
  id: string;
  user_id: string;
  card_id: string;
  quantity: number;
  avg_purchase_price?: number;
  total_invested?: number;
  current_value?: number;
  unrealized_pnl?: number;
  realized_pnl?: number;
  last_updated: string;
  metadata: Record<string, any>;
}

export interface MarketAlert {
  id: string;
  user_id: string;
  alert_type: 'price_drop' | 'new_listing' | 'auction_ending' | 'trend_alert';
  entity_id?: string;
  condition_data: Record<string, any>;
  is_active: boolean;
  triggered_count: number;
  last_triggered?: string;
  created_at: string;
}

export interface SellerAnalytics {
  id: string;
  seller_id: string;
  date: string;
  total_sales: number;
  total_listings: number;
  avg_sale_price?: number;
  conversion_rate?: number;
  total_views: number;
  total_watchers: number;
  rating_average?: number;
  rating_count: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface CardRecommendation {
  id: string;
  user_id: string;
  card_id: string;
  recommendation_type: 'trending' | 'similar' | 'investment' | 'collection_complete';
  score: number;
  reasoning: Record<string, any>;
  created_at: string;
  expires_at?: string;
}

export interface AuctionExtension {
  id: string;
  listing_id: string;
  original_end_time: string;
  new_end_time: string;
  extension_minutes: number;
  trigger_bid_id?: string;
  created_at: string;
}

export interface MarketplaceMetrics {
  totalVolume: number;
  totalTransactions: number;
  averagePrice: number;
  priceChange24h: number;
  topTrendingCards: Array<{
    card_id: string;
    title: string;
    trending_score: number;
    price_change: number;
  }>;
  marketCap: number;
}
