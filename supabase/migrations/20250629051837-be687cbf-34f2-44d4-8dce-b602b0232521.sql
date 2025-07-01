
-- Create a table to store reconstructed PSD cards
CREATE TABLE IF NOT EXISTS public.psd_reconstructed_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_psd_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  reconstruction_data JSONB NOT NULL DEFAULT '{}',
  layer_count INTEGER NOT NULL DEFAULT 0,
  processing_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the reconstructed cards table
ALTER TABLE public.psd_reconstructed_cards ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own reconstructed cards
CREATE POLICY "Users can view their own PSD reconstructed cards"
  ON public.psd_reconstructed_cards
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own reconstructed cards  
CREATE POLICY "Users can insert their own PSD reconstructed cards"
  ON public.psd_reconstructed_cards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own reconstructed cards
CREATE POLICY "Users can update their own PSD reconstructed cards"
  ON public.psd_reconstructed_cards
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add cards to the main cards table when they're saved from PSD reconstruction
-- This ensures they appear in the CRD Catalog and user's collections
CREATE OR REPLACE FUNCTION public.create_card_from_psd_reconstruction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert the reconstructed card into the main cards table
  INSERT INTO public.cards (
    title,
    description,
    image_url,
    thumbnail_url,
    rarity,
    tags,
    creator_id,
    is_public,
    crd_catalog_inclusion,
    design_metadata,
    created_at,
    updated_at
  ) VALUES (
    NEW.title,
    COALESCE(NEW.description, 'Reconstructed from PSD layers'),
    NEW.image_url,
    COALESCE(NEW.thumbnail_url, NEW.image_url),
    'rare', -- Default rarity for PSD reconstructed cards
    ARRAY['psd-reconstructed', 'layered-design'],
    NEW.user_id,
    true, -- Make public by default for CRD Catalog
    true, -- Include in CRD Catalog
    jsonb_build_object(
      'source', 'psd-reconstruction',
      'original_psd', NEW.original_psd_name,
      'layer_count', NEW.layer_count,
      'reconstruction_data', NEW.reconstruction_data,
      'processing_metadata', NEW.processing_metadata
    ),
    NEW.created_at,
    NEW.updated_at
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create main card when PSD card is saved
CREATE TRIGGER trigger_create_card_from_psd_reconstruction
  AFTER INSERT ON public.psd_reconstructed_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.create_card_from_psd_reconstruction();

-- Create default "My Cards" collection for users if it doesn't exist
CREATE OR REPLACE FUNCTION public.ensure_user_default_collection()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  default_collection_id UUID;
BEGIN
  -- Check if user already has a "My Cards" collection
  SELECT id INTO default_collection_id
  FROM public.collections
  WHERE owner_id = NEW.creator_id 
    AND title = 'My Cards'
    AND visibility = 'private';
  
  -- Create default collection if it doesn't exist
  IF default_collection_id IS NULL THEN
    INSERT INTO public.collections (
      title,
      description,
      owner_id,
      visibility,
      design_metadata
    ) VALUES (
      'My Cards',
      'My personal card collection',
      NEW.creator_id,
      'private',
      jsonb_build_object('is_default', true, 'auto_created', true)
    ) RETURNING id INTO default_collection_id;
  END IF;
  
  -- Add the new card to the default collection
  INSERT INTO public.collection_cards (
    collection_id,
    card_id,
    added_by,
    notes
  ) VALUES (
    default_collection_id,
    NEW.id,
    NEW.creator_id,
    'Added from PSD reconstruction'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger to add cards to default collection
CREATE TRIGGER trigger_add_to_default_collection
  AFTER INSERT ON public.cards
  FOR EACH ROW
  WHEN (NEW.design_metadata->>'source' = 'psd-reconstruction')
  EXECUTE FUNCTION public.ensure_user_default_collection();
