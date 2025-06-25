
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreatorProfile } from './useCreatorProfile';
import { toast } from 'sonner';

export interface SEOProfile {
  id: string;
  creator_id: string;
  meta_title?: string;
  meta_description?: string;
  keywords: string[];
  custom_url_slug?: string;
  social_media_links: Record<string, string>;
  seo_score: number;
  last_optimized_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PerformanceMetric {
  id: string;
  creator_id?: string;
  card_id?: string;
  template_id?: string;
  metric_name: string;
  metric_value: number;
  metric_date: string;
  aggregation_period?: 'daily' | 'weekly' | 'monthly';
  metadata: Record<string, any>;
  created_at: string;
}

export const useMarketplaceOptimization = () => {
  const { profile } = useCreatorProfile();
  const queryClient = useQueryClient();

  const { data: seoProfile, isLoading: loadingSEO } = useQuery({
    queryKey: ['seo-profile', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;

      const { data, error } = await supabase
        .from('marketplace_seo_profiles')
        .select('*')
        .eq('creator_id', profile.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as SEOProfile | null;
    },
    enabled: !!profile?.id,
  });

  const { data: performanceMetrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['performance-metrics', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from('marketplace_performance_metrics')
        .select('*')
        .eq('creator_id', profile.id)
        .order('metric_date', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as PerformanceMetric[];
    },
    enabled: !!profile?.id,
  });

  const createOrUpdateSEO = useMutation({
    mutationFn: async (seoData: Partial<SEOProfile>) => {
      if (!profile?.id) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('marketplace_seo_profiles')
        .upsert({
          creator_id: profile.id,
          meta_title: seoData.meta_title,
          meta_description: seoData.meta_description,
          keywords: seoData.keywords || [],
          custom_url_slug: seoData.custom_url_slug,
          social_media_links: seoData.social_media_links || {},
          last_optimized_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-profile'] });
      toast.success('SEO profile updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update SEO profile: ${error.message}`);
    },
  });

  const calculateSEOScore = (profile: SEOProfile | null): number => {
    if (!profile) return 0;
    
    let score = 0;
    if (profile.meta_title) score += 20;
    if (profile.meta_description) score += 20;
    if (profile.keywords.length > 0) score += 20;
    if (profile.custom_url_slug) score += 20;
    if (Object.keys(profile.social_media_links).length > 0) score += 20;
    
    return score;
  };

  const getMetricsByType = (metricType: string) => {
    return performanceMetrics?.filter(metric => metric.metric_name === metricType) || [];
  };

  const getRecentTrend = (metricType: string) => {
    const metrics = getMetricsByType(metricType).slice(0, 7); // Last 7 data points
    if (metrics.length < 2) return 0;
    
    const recent = metrics[0].metric_value;
    const previous = metrics[1].metric_value;
    return ((recent - previous) / previous) * 100;
  };

  return {
    seoProfile,
    performanceMetrics: performanceMetrics || [],
    loadingSEO,
    loadingMetrics,
    createOrUpdateSEO,
    calculateSEOScore,
    getMetricsByType,
    getRecentTrend,
  };
};
