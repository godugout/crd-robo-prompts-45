
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreatorProfile } from './useCreatorProfile';
import { toast } from 'sonner';

export interface DesignAsset {
  id: string;
  creator_id: string;
  asset_type: 'texture' | 'pattern' | 'shape' | 'icon' | 'font' | 'template_element' | '3d_model' | 'animation';
  title?: string;
  description?: string;
  file_url: string;
  thumbnail_url?: string;
  file_size?: number;
  mime_type?: string;
  usage_rights: 'free' | 'premium' | 'exclusive' | 'commercial';
  price: number;
  downloads_count: number;
  tags: string[];
  categories: string[];
  metadata: Record<string, any>;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const useDesignAssets = () => {
  const { profile } = useCreatorProfile();
  const queryClient = useQueryClient();

  const { data: myAssets, isLoading: loadingMyAssets } = useQuery({
    queryKey: ['my-design-assets', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from('design_assets_library')
        .select('*')
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DesignAsset[];
    },
    enabled: !!profile?.id,
  });

  const { data: publicAssets, isLoading: loadingPublicAssets } = useQuery({
    queryKey: ['public-design-assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('design_assets_library')
        .select('*')
        .eq('is_public', true)
        .order('downloads_count', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as DesignAsset[];
    },
  });

  const createAsset = useMutation({
    mutationFn: async (assetData: Partial<DesignAsset>) => {
      if (!profile?.id) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('design_assets_library')
        .insert({
          creator_id: profile.id,
          asset_type: assetData.asset_type!,
          title: assetData.title,
          description: assetData.description,
          file_url: assetData.file_url!,
          thumbnail_url: assetData.thumbnail_url,
          file_size: assetData.file_size,
          mime_type: assetData.mime_type,
          usage_rights: assetData.usage_rights!,
          price: assetData.price || 0,
          tags: assetData.tags || [],
          categories: assetData.categories || [],
          metadata: assetData.metadata || {},
          is_public: assetData.is_public ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-design-assets'] });
      toast.success('Design asset created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create asset: ${error.message}`);
    },
  });

  const updateAsset = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DesignAsset> & { id: string }) => {
      const { data, error } = await supabase
        .from('design_assets_library')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-design-assets'] });
      toast.success('Design asset updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update asset: ${error.message}`);
    },
  });

  const downloadAsset = useMutation({
    mutationFn: async (assetId: string) => {
      // First get current downloads count, then increment it
      const { data: currentAsset, error: fetchError } = await supabase
        .from('design_assets_library')
        .select('downloads_count')
        .eq('id', assetId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('design_assets_library')
        .update({ downloads_count: (currentAsset.downloads_count || 0) + 1 })
        .eq('id', assetId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-design-assets'] });
    },
  });

  return {
    myAssets: myAssets || [],
    publicAssets: publicAssets || [],
    loadingMyAssets,
    loadingPublicAssets,
    createAsset,
    updateAsset,
    downloadAsset,
  };
};
