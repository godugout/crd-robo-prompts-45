
-- Create reactions table for likes and other reactions (if not exists)
CREATE TABLE IF NOT EXISTS public.reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE NOT NULL,
  reaction_type TEXT NOT NULL DEFAULT 'like',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_id, reaction_type)
);

-- Create bookmarks table (if not exists)
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_id)
);

-- Create downloads table for tracking (if not exists)
CREATE TABLE IF NOT EXISTS public.card_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE NOT NULL,
  download_type TEXT NOT NULL DEFAULT 'image',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_downloads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view all reactions" ON public.reactions;
DROP POLICY IF EXISTS "Users can manage their own reactions" ON public.reactions;
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can view their own downloads" ON public.card_downloads;
DROP POLICY IF EXISTS "Users can track their own downloads" ON public.card_downloads;

-- Create RLS Policies for reactions
CREATE POLICY "Users can view all reactions" ON public.reactions FOR SELECT USING (true);
CREATE POLICY "Users can manage their own reactions" ON public.reactions FOR ALL USING (auth.uid() = user_id);

-- Create RLS Policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- Create RLS Policies for downloads
CREATE POLICY "Users can view their own downloads" ON public.card_downloads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can track their own downloads" ON public.card_downloads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to get reaction counts for cards
CREATE OR REPLACE FUNCTION get_card_reaction_counts(card_uuid UUID)
RETURNS TABLE (
  like_count BIGINT,
  view_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE((SELECT COUNT(*) FROM public.reactions WHERE card_id = card_uuid AND reaction_type = 'like'), 0) as like_count,
    COALESCE((SELECT COUNT(*) FROM public.card_downloads WHERE card_id = card_uuid), 0) as view_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to check if user has liked/bookmarked a card
CREATE OR REPLACE FUNCTION get_user_card_status(card_uuid UUID, user_uuid UUID)
RETURNS TABLE (
  is_liked BOOLEAN,
  is_bookmarked BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXISTS(SELECT 1 FROM public.reactions WHERE card_id = card_uuid AND user_id = user_uuid AND reaction_type = 'like') as is_liked,
    EXISTS(SELECT 1 FROM public.bookmarks WHERE card_id = card_uuid AND user_id = user_uuid) as is_bookmarked;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
