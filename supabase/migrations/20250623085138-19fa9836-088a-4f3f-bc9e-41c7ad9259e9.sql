
-- Enhance auction_bids table with advanced bidding features
DROP TABLE IF EXISTS public.auction_bids;
CREATE TABLE public.auction_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  bidder_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  proxy_max_amount DECIMAL(10,2),
  bid_type TEXT NOT NULL DEFAULT 'manual' CHECK (bid_type IN ('manual', 'proxy', 'auto_increment')),
  is_winning_bid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create market_analytics table for comprehensive market data
CREATE TABLE public.market_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  avg_price DECIMAL(10,2),
  volume INTEGER DEFAULT 0,
  transactions INTEGER DEFAULT 0,
  price_change_24h DECIMAL(5,2),
  market_cap DECIMAL(15,2),
  liquidity_score DECIMAL(3,2),
  trending_score DECIMAL(5,2),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(card_id, date)
);

-- Create market_trends table for trend analysis
CREATE TABLE public.market_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_type TEXT NOT NULL, -- 'card', 'category', 'global'
  entity_id UUID, -- card_id, category, or null for global
  trend_name TEXT NOT NULL,
  trend_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  strength DECIMAL(3,2), -- 0.0 to 1.0
  duration_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create user_portfolios table for investment tracking
CREATE TABLE public.user_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  avg_purchase_price DECIMAL(10,2),
  total_invested DECIMAL(12,2),
  current_value DECIMAL(12,2),
  unrealized_pnl DECIMAL(12,2),
  realized_pnl DECIMAL(12,2),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, card_id)
);

-- Create market_alerts table for notifications
CREATE TABLE public.market_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- 'price_drop', 'new_listing', 'auction_ending', 'trend_alert'
  entity_id UUID, -- card_id, listing_id, etc.
  condition_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  triggered_count INTEGER DEFAULT 0,
  last_triggered TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create seller_analytics table for seller insights
CREATE TABLE public.seller_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_sales DECIMAL(12,2) DEFAULT 0,
  total_listings INTEGER DEFAULT 0,
  avg_sale_price DECIMAL(10,2),
  conversion_rate DECIMAL(5,2),
  total_views INTEGER DEFAULT 0,
  total_watchers INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2),
  rating_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(seller_id, date)
);

-- Create card_recommendations table for AI-powered suggestions
CREATE TABLE public.card_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL, -- 'trending', 'similar', 'investment', 'collection_complete'
  score DECIMAL(5,2) NOT NULL,
  reasoning JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create auction_extensions table for sniping protection
CREATE TABLE public.auction_extensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  original_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  new_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  extension_minutes INTEGER NOT NULL,
  trigger_bid_id UUID REFERENCES public.auction_bids(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_auction_bids_listing_id ON public.auction_bids(listing_id);
CREATE INDEX idx_auction_bids_bidder_id ON public.auction_bids(bidder_id);
CREATE INDEX idx_auction_bids_amount ON public.auction_bids(amount DESC);
CREATE INDEX idx_auction_bids_created_at ON public.auction_bids(created_at DESC);

CREATE INDEX idx_market_analytics_card_id ON public.market_analytics(card_id);
CREATE INDEX idx_market_analytics_date ON public.market_analytics(date DESC);
CREATE INDEX idx_market_analytics_trending ON public.market_analytics(trending_score DESC);

CREATE INDEX idx_market_trends_type_entity ON public.market_trends(trend_type, entity_id);
CREATE INDEX idx_market_trends_strength ON public.market_trends(strength DESC);
CREATE INDEX idx_market_trends_expires ON public.market_trends(expires_at);

CREATE INDEX idx_user_portfolios_user_id ON public.user_portfolios(user_id);
CREATE INDEX idx_user_portfolios_value ON public.user_portfolios(current_value DESC);
CREATE INDEX idx_user_portfolios_pnl ON public.user_portfolios(unrealized_pnl DESC);

CREATE INDEX idx_market_alerts_user_id ON public.market_alerts(user_id);
CREATE INDEX idx_market_alerts_type ON public.market_alerts(alert_type);
CREATE INDEX idx_market_alerts_active ON public.market_alerts(is_active);

CREATE INDEX idx_seller_analytics_seller_date ON public.seller_analytics(seller_id, date DESC);
CREATE INDEX idx_seller_analytics_sales ON public.seller_analytics(total_sales DESC);

CREATE INDEX idx_card_recommendations_user_type_score ON public.card_recommendations(user_id, recommendation_type, score DESC);

-- Enable RLS on all new tables
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_extensions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for auction_bids
CREATE POLICY "Users can view auction bids" ON public.auction_bids
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can place their own bids" ON public.auction_bids
  FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- RLS Policies for market_analytics (public read)
CREATE POLICY "Anyone can view market analytics" ON public.market_analytics
  FOR SELECT USING (TRUE);

-- RLS Policies for market_trends (public read)
CREATE POLICY "Anyone can view market trends" ON public.market_trends
  FOR SELECT USING (TRUE);

-- RLS Policies for user_portfolios
CREATE POLICY "Users can view their own portfolio" ON public.user_portfolios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own portfolio" ON public.user_portfolios
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for market_alerts
CREATE POLICY "Users can manage their own alerts" ON public.market_alerts
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for seller_analytics
CREATE POLICY "Sellers can view their own analytics" ON public.seller_analytics
  FOR SELECT USING (auth.uid() = seller_id);

-- RLS Policies for card_recommendations
CREATE POLICY "Users can view their own recommendations" ON public.card_recommendations
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for auction_extensions (public read)
CREATE POLICY "Anyone can view auction extensions" ON public.auction_extensions
  FOR SELECT USING (TRUE);

-- Enable realtime for auction and market data
ALTER TABLE public.auction_bids REPLICA IDENTITY FULL;
ALTER TABLE public.market_analytics REPLICA IDENTITY FULL;
ALTER TABLE public.market_trends REPLICA IDENTITY FULL;
ALTER TABLE public.user_portfolios REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.auction_bids;
ALTER PUBLICATION supabase_realtime ADD TABLE public.market_analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.market_trends;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_portfolios;

-- Create functions for market calculations
CREATE OR REPLACE FUNCTION update_portfolio_value(p_user_id UUID, p_card_id UUID)
RETURNS void AS $$
DECLARE
  current_market_price DECIMAL(10,2);
  portfolio_quantity INTEGER;
BEGIN
  -- Get current market price (latest avg from analytics or listing price)
  SELECT COALESCE(
    (SELECT avg_price FROM market_analytics WHERE card_id = p_card_id ORDER BY date DESC LIMIT 1),
    (SELECT AVG(price) FROM marketplace_listings WHERE card_id = p_card_id AND status = 'active')
  ) INTO current_market_price;
  
  -- Get portfolio quantity
  SELECT quantity INTO portfolio_quantity 
  FROM user_portfolios 
  WHERE user_id = p_user_id AND card_id = p_card_id;
  
  -- Update portfolio values
  UPDATE user_portfolios 
  SET 
    current_value = current_market_price * portfolio_quantity,
    unrealized_pnl = (current_market_price * portfolio_quantity) - total_invested,
    last_updated = NOW()
  WHERE user_id = p_user_id AND card_id = p_card_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate trending scores
CREATE OR REPLACE FUNCTION calculate_trending_score(p_card_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  volume_score DECIMAL(3,2);
  price_change_score DECIMAL(3,2);
  transaction_score DECIMAL(3,2);
  final_score DECIMAL(5,2);
BEGIN
  -- Calculate volume score (0-1 based on recent volume)
  SELECT COALESCE(
    LEAST(1.0, volume / 100.0), 0
  ) INTO volume_score
  FROM market_analytics 
  WHERE card_id = p_card_id AND date >= CURRENT_DATE - INTERVAL '7 days'
  ORDER BY date DESC LIMIT 1;
  
  -- Calculate price change score (0-1 based on positive price movement)
  SELECT COALESCE(
    GREATEST(0, LEAST(1.0, price_change_24h / 50.0)), 0
  ) INTO price_change_score
  FROM market_analytics 
  WHERE card_id = p_card_id 
  ORDER BY date DESC LIMIT 1;
  
  -- Calculate transaction score (0-1 based on transaction frequency)
  SELECT COALESCE(
    LEAST(1.0, transactions / 10.0), 0
  ) INTO transaction_score
  FROM market_analytics 
  WHERE card_id = p_card_id AND date >= CURRENT_DATE - INTERVAL '24 hours'
  ORDER BY date DESC LIMIT 1;
  
  -- Weighted final score
  final_score := (volume_score * 0.4) + (price_change_score * 0.4) + (transaction_score * 0.2);
  
  RETURN final_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
