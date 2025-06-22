
export type ListingType = 'fixed_price' | 'auction' | 'make_offer';
export type ListingStatus = 'active' | 'sold' | 'cancelled' | 'expired';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type CardCondition = 'mint' | 'near_mint' | 'excellent' | 'good' | 'fair' | 'poor';

export interface MarketplaceListing {
  id: string;
  seller_id: string;
  card_id: string;
  price: number;
  condition: CardCondition;
  quantity: number;
  listing_type: ListingType;
  status: ListingStatus;
  featured: boolean;
  views_count: number;
  watchers_count: number;
  shipping_cost?: number;
  location?: string;
  estimated_delivery_days?: number;
  title: string;
  description?: string;
  images?: string[];
  auction_end_time?: string;
  starting_bid?: number;
  current_bid?: number;
  reserve_price?: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  card?: any; // Card data when joined
  seller?: any; // Seller profile when joined
}

export interface Transaction {
  id: string;
  buyer_id?: string;
  seller_id?: string;
  listing_id?: string;
  amount: number;
  platform_fee: number;
  shipping_cost?: number;
  total_amount: number;
  stripe_payment_intent_id?: string;
  stripe_transfer_id?: string;
  status: TransactionStatus;
  shipping_address?: any;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  completed_at?: string;
  cancelled_at?: string;
  listing?: MarketplaceListing;
}

export interface SellerProfile {
  id: string;
  user_id: string;
  stripe_account_id?: string;
  verification_status: string;
  business_name?: string;
  business_type?: string;
  tax_id?: string;
  address?: any;
  phone?: string;
  website?: string;
  bank_account_verified: boolean;
  identity_verified: boolean;
  payouts_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuctionBid {
  id: string;
  listing_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  bidder?: any; // User profile when joined
}

export interface ListingWatcher {
  id: string;
  listing_id: string;
  user_id: string;
  created_at: string;
}

export interface MarketplaceFee {
  id: string;
  fee_type: string;
  percentage?: number;
  fixed_amount?: number;
  min_amount?: number;
  max_amount?: number;
  active: boolean;
  created_at: string;
}
