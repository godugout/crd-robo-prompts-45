
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreatorProfile } from './useCreatorProfile';
import { toast } from 'sonner';

export interface CardTemplate {
  id: string;
  creator_id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  tags: string[];
  template_data: any;
  preview_images: string[];
  sales_count: number;
  revenue_generated: number;
  rating_average: number;
  rating_count: number;
  is_premium: boolean;
  is_active: boolean;
  created_at: string;
}

export const useCardTemplates = () => {
  const { profile } = useCreatorProfile();
  const queryClient = useQueryClient();

  // Get all public templates
  const { data: publicTemplates, isLoading: loadingPublic } = useQuery({
    queryKey: ['public-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('card_templates')
        .select('*')
        .eq('is_active', true)
        .order('rating_average', { ascending: false });

      if (error) throw error;
      return data as CardTemplate[];
    },
  });

  // Get creator's own templates
  const { data: myTemplates, isLoading: loadingMy } = useQuery({
    queryKey: ['my-templates', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from('card_templates')
        .select('*')
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CardTemplate[];
    },
    enabled: !!profile?.id,
  });

  const createTemplate = useMutation({
    mutationFn: async (templateData: Partial<CardTemplate> & { name: string; category: string }) => {
      if (!profile?.id) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('card_templates')
        .insert({
          creator_id: profile.id,
          name: templateData.name,
          category: templateData.category,
          description: templateData.description || '',
          price: templateData.price || 0,
          tags: templateData.tags || [],
          template_data: templateData.template_data || {},
          preview_images: templateData.preview_images || [],
          is_premium: templateData.is_premium || false,
          is_active: templateData.is_active !== false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-templates'] });
      toast.success('Template created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create template: ${error.message}`);
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CardTemplate> }) => {
      const { data, error } = await supabase
        .from('card_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-templates'] });
      toast.success('Template updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update template: ${error.message}`);
    },
  });

  const purchaseTemplate = useMutation({
    mutationFn: async ({ templateId, licenseType = 'standard' }: { templateId: string; licenseType?: string }) => {
      const template = publicTemplates?.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      // Record purchase
      const { error: purchaseError } = await supabase
        .from('template_purchases')
        .insert({
          template_id: templateId,
          buyer_id: profile?.user_id,
          purchase_price: template.price,
          license_type: licenseType,
        });

      if (purchaseError) throw purchaseError;

      // Record creator earning
      await supabase.functions.invoke('creator-payouts', {
        body: {
          action: 'record_sale',
          creator_id: template.creator_id,
          template_id: templateId,
          buyer_id: profile?.user_id,
          sale_amount: template.price,
          source_type: 'template_sale',
        },
      });

      return template;
    },
    onSuccess: () => {
      toast.success('Template purchased successfully!');
      queryClient.invalidateQueries({ queryKey: ['public-templates'] });
    },
    onError: (error) => {
      toast.error(`Purchase failed: ${error.message}`);
    },
  });

  return {
    publicTemplates: publicTemplates || [],
    myTemplates: myTemplates || [],
    isLoading: loadingPublic || loadingMy,
    createTemplate,
    updateTemplate,
    purchaseTemplate,
  };
};
