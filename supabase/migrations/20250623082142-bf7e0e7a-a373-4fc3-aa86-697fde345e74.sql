
-- Create trade_offers table
CREATE TABLE public.trade_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'expired', 'completed')),
  offered_cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  requested_cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  trade_value_difference NUMERIC DEFAULT 0,
  cash_included NUMERIC DEFAULT 0,
  messages_channel_id TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  trade_rating INTEGER CHECK (trade_rating >= 1 AND trade_rating <= 5)
);

-- Create trade_messages table
CREATE TABLE public.trade_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID NOT NULL REFERENCES public.trade_offers(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'offer', 'image', 'emoji')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  read_status BOOLEAN NOT NULL DEFAULT FALSE,
  attachment_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create trade_disputes table
CREATE TABLE public.trade_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID NOT NULL REFERENCES public.trade_offers(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dispute_reason TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  resolution TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create trade_feedback table
CREATE TABLE public.trade_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID NOT NULL REFERENCES public.trade_offers(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(trade_id, reviewer_id)
);

-- Create user_trade_preferences table
CREATE TABLE public.user_trade_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  auto_accept_equal_trades BOOLEAN DEFAULT FALSE,
  max_trade_value NUMERIC DEFAULT 1000,
  preferred_trade_types TEXT[] DEFAULT ARRAY['equal', 'upgrade', 'downgrade'],
  blocked_users UUID[] DEFAULT ARRAY[]::UUID[],
  notification_preferences JSONB DEFAULT '{
    "trade_offers": true,
    "trade_updates": true,
    "trade_messages": true,
    "trade_completed": true
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.trade_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trade_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trade_offers
CREATE POLICY "Users can view their own trade offers" ON public.trade_offers
  FOR SELECT USING (auth.uid() = initiator_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create trade offers" ON public.trade_offers
  FOR INSERT WITH CHECK (auth.uid() = initiator_id);

CREATE POLICY "Users can update their own trade offers" ON public.trade_offers
  FOR UPDATE USING (auth.uid() = initiator_id OR auth.uid() = recipient_id);

-- RLS Policies for trade_messages
CREATE POLICY "Users can view messages for their trades" ON public.trade_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trade_offers 
      WHERE id = trade_messages.trade_id 
      AND (initiator_id = auth.uid() OR recipient_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages to their trades" ON public.trade_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.trade_offers 
      WHERE id = trade_messages.trade_id 
      AND (initiator_id = auth.uid() OR recipient_id = auth.uid())
    )
  );

-- RLS Policies for trade_disputes
CREATE POLICY "Users can view their own disputes" ON public.trade_disputes
  FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create disputes for their trades" ON public.trade_disputes
  FOR INSERT WITH CHECK (
    auth.uid() = reporter_id AND
    EXISTS (
      SELECT 1 FROM public.trade_offers 
      WHERE id = trade_disputes.trade_id 
      AND (initiator_id = auth.uid() OR recipient_id = auth.uid())
    )
  );

-- RLS Policies for trade_feedback
CREATE POLICY "Users can view feedback for their trades" ON public.trade_feedback
  FOR SELECT USING (auth.uid() = reviewer_id OR auth.uid() = reviewee_id);

CREATE POLICY "Users can create feedback for their trades" ON public.trade_feedback
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM public.trade_offers 
      WHERE id = trade_feedback.trade_id 
      AND (initiator_id = auth.uid() OR recipient_id = auth.uid())
      AND status = 'completed'
    )
  );

-- RLS Policies for user_trade_preferences
CREATE POLICY "Users can manage their own trade preferences" ON public.user_trade_preferences
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_trade_offers_initiator ON public.trade_offers(initiator_id);
CREATE INDEX idx_trade_offers_recipient ON public.trade_offers(recipient_id);
CREATE INDEX idx_trade_offers_status ON public.trade_offers(status);
CREATE INDEX idx_trade_offers_expires_at ON public.trade_offers(expires_at);
CREATE INDEX idx_trade_messages_trade_id ON public.trade_messages(trade_id);
CREATE INDEX idx_trade_messages_timestamp ON public.trade_messages(timestamp);

-- Create function to update trade offer timestamps
CREATE OR REPLACE FUNCTION update_trade_offer_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for trade offers
CREATE TRIGGER update_trade_offers_updated_at
  BEFORE UPDATE ON public.trade_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_trade_offer_timestamp();

-- Create function to auto-expire trades
CREATE OR REPLACE FUNCTION expire_old_trades()
RETURNS void AS $$
BEGIN
  UPDATE public.trade_offers 
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'pending' AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for trade tables
ALTER TABLE public.trade_offers REPLICA IDENTITY FULL;
ALTER TABLE public.trade_messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.trade_offers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trade_messages;
