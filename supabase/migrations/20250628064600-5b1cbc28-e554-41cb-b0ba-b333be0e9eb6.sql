
-- Add sports card metadata fields to the cards table
ALTER TABLE cards ADD COLUMN IF NOT EXISTS sports_metadata jsonb DEFAULT '{}'::jsonb;

-- Create lookup table for sports card brands
CREATE TABLE IF NOT EXISTS card_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  logo_url text,
  founded_year integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create lookup table for sports teams
CREATE TABLE IF NOT EXISTS sports_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sport text NOT NULL,
  league text,
  city text,
  colors jsonb DEFAULT '{}'::jsonb,
  logo_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(name, sport, league)
);

-- Create lookup table for players
CREATE TABLE IF NOT EXISTS sports_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sport text NOT NULL,
  position text,
  team_id uuid REFERENCES sports_teams(id),
  birth_year integer,
  career_stats jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create card analysis results table
CREATE TABLE IF NOT EXISTS card_analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid REFERENCES cards(id) ON DELETE CASCADE,
  analysis_type text NOT NULL, -- 'ocr', 'ai_vision', 'pattern_match'
  confidence_score numeric DEFAULT 0.0,
  extracted_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  processing_time_ms integer,
  created_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies for new tables
ALTER TABLE card_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE sports_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE sports_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_analysis_results ENABLE ROW LEVEL SECURITY;

-- Public read access for lookup tables
CREATE POLICY "Public read access for card brands" ON card_brands FOR SELECT USING (true);
CREATE POLICY "Public read access for sports teams" ON sports_teams FOR SELECT USING (true);
CREATE POLICY "Public read access for sports players" ON sports_players FOR SELECT USING (true);

-- Users can view their own card analysis results
CREATE POLICY "Users can view their card analysis" ON card_analysis_results 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cards 
      WHERE cards.id = card_analysis_results.card_id 
      AND cards.creator_id = auth.uid()
    )
  );

-- Users can insert analysis results for their own cards
CREATE POLICY "Users can create card analysis" ON card_analysis_results 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM cards 
      WHERE cards.id = card_analysis_results.card_id 
      AND cards.creator_id = auth.uid()
    )
  );

-- Insert some sample brand data
INSERT INTO card_brands (name, founded_year) VALUES 
  ('Topps', 1938),
  ('Panini', 1961),
  ('Upper Deck', 1988),
  ('Bowman', 1948),
  ('Fleer', 1885),
  ('Donruss', 1981)
ON CONFLICT (name) DO NOTHING;

-- Insert some sample team data
INSERT INTO sports_teams (name, sport, league, city, colors) VALUES 
  ('Los Angeles Lakers', 'Basketball', 'NBA', 'Los Angeles', '["purple", "gold"]'),
  ('New York Yankees', 'Baseball', 'MLB', 'New York', '["navy", "white"]'),
  ('Dallas Cowboys', 'Football', 'NFL', 'Dallas', '["navy", "silver"]'),
  ('Boston Celtics', 'Basketball', 'NBA', 'Boston', '["green", "white"]'),
  ('Chicago Bulls', 'Basketball', 'NBA', 'Chicago', '["red", "black"]')
ON CONFLICT (name, sport, league) DO NOTHING;
