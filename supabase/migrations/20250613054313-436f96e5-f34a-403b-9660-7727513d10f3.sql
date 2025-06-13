
-- Create storage buckets for organized media management
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('static-assets', 'static-assets', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
  ('user-content', 'user-content', false, 104857600, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']),
  ('card-assets', 'card-assets', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for static-assets bucket (public read, admin write)
CREATE POLICY "Public can view static assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'static-assets');

CREATE POLICY "Authenticated users can upload static assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'static-assets' AND auth.role() = 'authenticated');

-- Create RLS policies for user-content bucket (user-specific access)
CREATE POLICY "Users can view their own content" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own content" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'user-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own content" ON storage.objects
  FOR UPDATE USING (bucket_id = 'user-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own content" ON storage.objects
  FOR DELETE USING (bucket_id = 'user-content' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create RLS policies for card-assets bucket (public read, user write)
CREATE POLICY "Public can view card assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'card-assets');

CREATE POLICY "Authenticated users can upload card assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'card-assets' AND auth.role() = 'authenticated');

-- Create media_files table for better file management
CREATE TABLE IF NOT EXISTS public.media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  bucket_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  duration FLOAT,
  thumbnail_path TEXT,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_optimized BOOLEAN DEFAULT false,
  optimization_variants JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bucket_id, file_path)
);

-- Enable RLS on media_files table
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for media_files table
CREATE POLICY "Users can view their own media files" ON public.media_files
  FOR SELECT USING (user_id = auth.uid() OR bucket_id = 'static-assets' OR bucket_id = 'card-assets');

CREATE POLICY "Users can create their own media files" ON public.media_files
  FOR INSERT WITH CHECK (user_id = auth.uid() OR auth.role() = 'authenticated');

CREATE POLICY "Users can update their own media files" ON public.media_files
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own media files" ON public.media_files
  FOR DELETE USING (user_id = auth.uid());

-- Create function to handle file cleanup
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_files()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function can be called periodically to clean up orphaned files
  DELETE FROM storage.objects 
  WHERE bucket_id IN ('user-content', 'card-assets')
  AND created_at < NOW() - INTERVAL '7 days'
  AND id NOT IN (
    SELECT DISTINCT unnest(string_to_array(file_path, '/')) 
    FROM public.media_files 
    WHERE bucket_id = storage.objects.bucket_id
  );
END;
$$;

-- Create updated_at trigger for media_files
CREATE OR REPLACE FUNCTION public.update_media_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_media_files_updated_at
  BEFORE UPDATE ON public.media_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_media_files_updated_at();
