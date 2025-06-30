
-- Phase 1: Enhanced Collections Database Schema

-- Add missing columns to existing collections table
ALTER TABLE collections ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS completion_rate DECIMAL(5,2) DEFAULT 0.00;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT FALSE;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS template_category TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE collections ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create collection_followers table for social features
CREATE TABLE IF NOT EXISTS collection_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  UNIQUE(collection_id, follower_id)
);

-- Create collection_activity table for change tracking
CREATE TABLE IF NOT EXISTS collection_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'card_added', 'card_removed', 'shared', 'updated', etc.
  activity_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collection_comments table
CREATE TABLE IF NOT EXISTS collection_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES collection_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collection_ratings table
CREATE TABLE IF NOT EXISTS collection_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, user_id)
);

-- Create collection_permissions table for granular sharing
CREATE TABLE IF NOT EXISTS collection_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_type TEXT NOT NULL, -- 'view', 'comment', 'collaborate', 'admin'
  granted_by UUID NOT NULL REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(collection_id, user_id, permission_type)
);

-- Create collection_templates table
CREATE TABLE IF NOT EXISTS collection_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  template_data JSONB NOT NULL DEFAULT '{}',
  preview_image_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  is_official BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add quantity and metadata to collection_cards
ALTER TABLE collection_cards ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE collection_cards ADD COLUMN IF NOT EXISTS added_by UUID REFERENCES auth.users(id);
ALTER TABLE collection_cards ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE collection_cards ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Enable Row Level Security on all new tables
ALTER TABLE collection_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for collection_followers
CREATE POLICY "Users can view collection followers if they can view the collection" 
  ON collection_followers FOR SELECT 
  USING (
    collection_id IN (
      SELECT id FROM collections 
      WHERE visibility = 'public' OR owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can follow collections they can view" 
  ON collection_followers FOR INSERT 
  WITH CHECK (
    follower_id = auth.uid() AND
    collection_id IN (
      SELECT id FROM collections 
      WHERE visibility = 'public' OR owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can unfollow collections they follow" 
  ON collection_followers FOR DELETE 
  USING (follower_id = auth.uid());

-- RLS Policies for collection_activity
CREATE POLICY "Users can view activity for collections they can access" 
  ON collection_activity FOR SELECT 
  USING (
    collection_id IN (
      SELECT id FROM collections 
      WHERE visibility = 'public' OR owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create activity for collections they can modify" 
  ON collection_activity FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND
    collection_id IN (
      SELECT id FROM collections 
      WHERE owner_id = auth.uid()
    )
  );

-- RLS Policies for collection_comments
CREATE POLICY "Users can view comments on accessible collections" 
  ON collection_comments FOR SELECT 
  USING (
    collection_id IN (
      SELECT id FROM collections 
      WHERE visibility = 'public' OR owner_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can comment on public collections" 
  ON collection_comments FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND
    collection_id IN (
      SELECT id FROM collections 
      WHERE visibility = 'public' OR owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own comments" 
  ON collection_comments FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments" 
  ON collection_comments FOR DELETE 
  USING (user_id = auth.uid());

-- RLS Policies for collection_ratings
CREATE POLICY "Users can view ratings on accessible collections" 
  ON collection_ratings FOR SELECT 
  USING (
    collection_id IN (
      SELECT id FROM collections 
      WHERE visibility = 'public' OR owner_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can rate public collections" 
  ON collection_ratings FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND
    collection_id IN (
      SELECT id FROM collections 
      WHERE visibility = 'public'
    )
  );

CREATE POLICY "Users can update their own ratings" 
  ON collection_ratings FOR UPDATE 
  USING (user_id = auth.uid());

-- RLS Policies for collection_permissions
CREATE POLICY "Users can view permissions for their collections" 
  ON collection_permissions FOR SELECT 
  USING (
    collection_id IN (
      SELECT id FROM collections WHERE owner_id = auth.uid()
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Collection owners can manage permissions" 
  ON collection_permissions FOR ALL 
  USING (
    collection_id IN (
      SELECT id FROM collections WHERE owner_id = auth.uid()
    )
  );

-- RLS Policies for collection_templates
CREATE POLICY "Anyone can view public templates" 
  ON collection_templates FOR SELECT 
  USING (TRUE);

CREATE POLICY "Authenticated users can create templates" 
  ON collection_templates FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates" 
  ON collection_templates FOR UPDATE 
  USING (created_by = auth.uid());

-- Enable realtime for all collection tables
ALTER PUBLICATION supabase_realtime ADD TABLE collections;
ALTER PUBLICATION supabase_realtime ADD TABLE collection_cards;
ALTER PUBLICATION supabase_realtime ADD TABLE collection_followers;
ALTER PUBLICATION supabase_realtime ADD TABLE collection_activity;
ALTER PUBLICATION supabase_realtime ADD TABLE collection_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE collection_ratings;
ALTER PUBLICATION supabase_realtime ADD TABLE collection_permissions;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_collection_followers_collection_id ON collection_followers(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_followers_follower_id ON collection_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_collection_activity_collection_id ON collection_activity(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_activity_created_at ON collection_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collection_comments_collection_id ON collection_comments(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_ratings_collection_id ON collection_ratings(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_permissions_collection_id ON collection_permissions(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_permissions_user_id ON collection_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_featured_until ON collections(featured_until) WHERE featured_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_collections_last_activity_at ON collections(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_collection_cards_display_order ON collection_cards(collection_id, display_order);

-- Create functions for collection statistics
CREATE OR REPLACE FUNCTION update_collection_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update completion rate and last activity when cards are added
    UPDATE collections 
    SET last_activity_at = NOW(),
        completion_rate = (
          SELECT COUNT(*)::DECIMAL / GREATEST(1, 
            COALESCE((design_metadata->>'target_size')::INTEGER, 100)
          ) * 100
          FROM collection_cards 
          WHERE collection_id = NEW.collection_id
        )
    WHERE id = NEW.collection_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update stats when cards are removed
    UPDATE collections 
    SET last_activity_at = NOW(),
        completion_rate = (
          SELECT COUNT(*)::DECIMAL / GREATEST(1, 
            COALESCE((design_metadata->>'target_size')::INTEGER, 100)
          ) * 100
          FROM collection_cards 
          WHERE collection_id = OLD.collection_id
        )
    WHERE id = OLD.collection_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for collection stats
DROP TRIGGER IF EXISTS update_collection_stats_trigger ON collection_cards;
CREATE TRIGGER update_collection_stats_trigger
  AFTER INSERT OR DELETE ON collection_cards
  FOR EACH ROW EXECUTE FUNCTION update_collection_stats();

-- Function to get collection analytics
CREATE OR REPLACE FUNCTION get_collection_analytics(collection_uuid UUID)
RETURNS TABLE(
  total_cards BIGINT,
  unique_rarities BIGINT,
  completion_rate DECIMAL,
  total_views BIGINT,
  total_likes BIGINT,
  total_followers BIGINT,
  recent_activity BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM collection_cards WHERE collection_id = collection_uuid),
    (SELECT COUNT(DISTINCT c.rarity) FROM collection_cards cc 
     JOIN cards c ON cc.card_id = c.id 
     WHERE cc.collection_id = collection_uuid),
    (SELECT collections.completion_rate FROM collections WHERE id = collection_uuid),
    (SELECT collections.views_count FROM collections WHERE id = collection_uuid),
    (SELECT collections.likes_count FROM collections WHERE id = collection_uuid),
    (SELECT COUNT(*) FROM collection_followers WHERE collection_id = collection_uuid),
    (SELECT COUNT(*) FROM collection_activity 
     WHERE collection_id = collection_uuid 
     AND created_at > NOW() - INTERVAL '7 days');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
