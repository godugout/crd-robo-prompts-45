
-- Create enums for marketplace
CREATE TYPE listing_type AS ENUM ('fixed_price', 'auction', 'make_offer');
CREATE TYPE listing_status AS ENUM ('active', 'sold', 'cancelled', 'expired');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'cancelled', 'refunded');
CREATE TYPE card_condition AS ENUM ('mint', 'near_mint', 'excellent', 'good', 'fair', 'poor');

-- Create marketplace_listings table
CREATE TABLE public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  condition card_condition NOT NULL DEFAULT 'mint',
  quantity INTEGER NOT NULL DEFAULT 1,
  listing_type listing_type NOT NULL DEFAULT 'fixed_price',
  status listing_status NOT NULL DEFAULT 'active',
  featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  watchers_count INTEGER DEFAULT 0,
  shipping_cost DECIMAL(8,2),
  location TEXT,
  estimated_delivery_days INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[],
  auction_end_time TIMESTAMPTZ,
  starting_bid DECIMAL(10,2),
  current_bid DECIMAL(10,2),
  reserve_price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(8,2),
  total_amount DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_transfer_id TEXT,
  status transaction_status NOT NULL DEFAULT 'pending',
  shipping_address JSONB,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Create seller_profiles table for Stripe Connect
CREATE TABLE public.seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_account_id TEXT UNIQUE,
  verification_status TEXT DEFAULT 'pending',
  business_name TEXT,
  business_type TEXT,
  tax_id TEXT,
  address JSONB,
  phone TEXT,
  website TEXT,
  bank_account_verified BOOLEAN DEFAULT FALSE,
  identity_verified BOOLEAN DEFAULT FALSE,
  payouts_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create listing_watchers table
CREATE TABLE public.listing_watchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, user_id)
);

-- Create auction_bids table
CREATE TABLE public.auction_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  bidder_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create marketplace_fees table
CREATE TABLE public.marketplace_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_type TEXT NOT NULL,
  percentage DECIMAL(5,2),
  fixed_amount DECIMAL(8,2),
  min_amount DECIMAL(8,2),
  max_amount DECIMAL(8,2),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default marketplace fee (5% platform commission)
INSERT INTO public.marketplace_fees (fee_type, percentage) VALUES ('platform_commission', 5.00);

-- Enable RLS on all tables
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_watchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_fees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketplace_listings
CREATE POLICY "Users can view active listings" ON public.marketplace_listings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Sellers can manage their listings" ON public.marketplace_listings
  FOR ALL USING (auth.uid() = seller_id);

CREATE POLICY "Users can insert their own listings" ON public.marketplace_listings
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can insert transactions as buyers" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- RLS Policies for seller_profiles
CREATE POLICY "Users can view verified seller profiles" ON public.seller_profiles
  FOR SELECT USING (verification_status = 'verified' OR auth.uid() = user_id);

CREATE POLICY "Users can manage their seller profile" ON public.seller_profiles
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for listing_watchers
CREATE POLICY "Users can manage their watches" ON public.listing_watchers
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for auction_bids
CREATE POLICY "Users can view bids on listings" ON public.auction_bids
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can place their own bids" ON public.auction_bids
  FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- RLS Policies for marketplace_fees (admin only)
CREATE POLICY "Anyone can view active fees" ON public.marketplace_fees
  FOR SELECT USING (active = TRUE);

-- Create indexes for performance
CREATE INDEX idx_listings_seller_id ON public.marketplace_listings(seller_id);
CREATE INDEX idx_listings_card_id ON public.marketplace_listings(card_id);
CREATE INDEX idx_listings_status ON public.marketplace_listings(status);
CREATE INDEX idx_listings_price ON public.marketplace_listings(price);
CREATE INDEX idx_listings_created_at ON public.marketplace_listings(created_at);
CREATE INDEX idx_transactions_buyer_id ON public.transactions(buyer_id);
CREATE INDEX idx_transactions_seller_id ON public.transactions(seller_id);
CREATE INDEX idx_transactions_listing_id ON public.transactions(listing_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_auction_bids_listing_id ON public.auction_bids(listing_id);
CREATE INDEX idx_auction_bids_created_at ON public.auction_bids(created_at);

-- Create trigger to update marketplace_listings updated_at
CREATE OR REPLACE FUNCTION update_marketplace_listing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_marketplace_listings_updated_at
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION update_marketplace_listing_updated_at();

-- Create trigger to update seller_profiles updated_at
CREATE TRIGGER update_seller_profiles_updated_at
  BEFORE UPDATE ON public.seller_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for marketplace tables
ALTER TABLE public.marketplace_listings REPLICA IDENTITY FULL;
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER TABLE public.auction_bids REPLICA IDENTITY FULL;
ALTER TABLE public.listing_watchers REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.auction_bids;
ALTER PUBLICATION supabase_realtime ADD TABLE public.listing_watchers;
