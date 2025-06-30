
-- Create creator profiles table for managing creator accounts and verification
CREATE TABLE creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES crd_profiles(id) ON DELETE CASCADE,
  stripe_account_id TEXT UNIQUE,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'suspended')),
  portfolio_url TEXT,
  bio TEXT,
  bio_extended TEXT,
  specialties TEXT[] DEFAULT '{}',
  commission_rates JSONB DEFAULT '{"standard": 50, "premium": 100, "custom": 150}',
  total_earnings DECIMAL(12,2) DEFAULT 0,
  cards_created INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  payout_method TEXT DEFAULT 'stripe',
  tax_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create card templates table for marketplace templates
CREATE TABLE card_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  template_data JSONB NOT NULL DEFAULT '{}',
  preview_images TEXT[] DEFAULT '{}',
  sales_count INTEGER DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create creator earnings table for tracking all revenue
CREATE TABLE creator_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('card_sale', 'template_sale', 'commission', 'royalty', 'subscription')),
  amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  net_amount DECIMAL(10,2) NOT NULL,
  card_id UUID REFERENCES cards(id),
  template_id UUID REFERENCES card_templates(id),
  buyer_id UUID REFERENCES crd_profiles(id),
  transaction_id TEXT,
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  payout_date TIMESTAMPTZ,
  payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'paid', 'failed')),
  tax_document_id TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Create creator subscriptions table for recurring revenue
CREATE TABLE creator_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES crd_profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('basic', 'premium', 'enterprise')),
  monthly_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
  stripe_subscription_id TEXT UNIQUE,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create template purchases table for tracking template sales
CREATE TABLE template_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES card_templates(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES crd_profiles(id) ON DELETE CASCADE,
  purchase_price DECIMAL(10,2) NOT NULL,
  license_type TEXT DEFAULT 'standard' CHECK (license_type IN ('standard', 'extended', 'exclusive')),
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  stripe_payment_intent_id TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Create creator analytics events table
CREATE TABLE creator_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}',
  user_id UUID REFERENCES crd_profiles(id),
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_creator_profiles_user_id ON creator_profiles(user_id);
CREATE INDEX idx_creator_profiles_stripe_account ON creator_profiles(stripe_account_id);
CREATE INDEX idx_card_templates_creator_id ON card_templates(creator_id);
CREATE INDEX idx_card_templates_category ON card_templates(category);
CREATE INDEX idx_creator_earnings_creator_id ON creator_earnings(creator_id);
CREATE INDEX idx_creator_earnings_transaction_date ON creator_earnings(transaction_date);
CREATE INDEX idx_creator_subscriptions_creator_id ON creator_subscriptions(creator_id);
CREATE INDEX idx_template_purchases_template_id ON template_purchases(template_id);
CREATE INDEX idx_creator_analytics_creator_id ON creator_analytics_events(creator_id);

-- Add RLS policies
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_analytics_events ENABLE ROW LEVEL SECURITY;

-- Creator profiles policies
CREATE POLICY "Creators can view their own profiles" ON creator_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Creators can update their own profiles" ON creator_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Public can view verified creator profiles" ON creator_profiles
  FOR SELECT USING (verification_status = 'verified');

-- Card templates policies
CREATE POLICY "Creators can manage their templates" ON card_templates
  FOR ALL USING (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Public can view active templates" ON card_templates
  FOR SELECT USING (is_active = true);

-- Creator earnings policies
CREATE POLICY "Creators can view their earnings" ON creator_earnings
  FOR SELECT USING (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

-- Subscription policies
CREATE POLICY "Users can view their subscriptions" ON creator_subscriptions
  FOR SELECT USING (subscriber_id = auth.uid() OR creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

-- Template purchase policies
CREATE POLICY "Users can view their purchases" ON template_purchases
  FOR SELECT USING (buyer_id = auth.uid());

-- Analytics policies
CREATE POLICY "Creators can view their analytics" ON creator_analytics_events
  FOR SELECT USING (creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid()));

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_creator_profiles_updated_at BEFORE UPDATE ON creator_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_card_templates_updated_at BEFORE UPDATE ON card_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_subscriptions_updated_at BEFORE UPDATE ON creator_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
