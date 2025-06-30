
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreatorProfile } from './useCreatorProfile';
import { toast } from 'sonner';

export interface AutomationRule {
  id: string;
  creator_id: string;
  rule_type: 'pricing_optimization' | 'quality_assurance' | 'content_moderation' | 'social_promotion' | 'bulk_processing';
  conditions: Record<string, any>;
  actions: Record<string, any>;
  is_active: boolean;
  execution_count: number;
  success_rate: number;
  last_executed_at?: string;
  created_at: string;
  updated_at: string;
}

export const useCreatorAutomation = () => {
  const { profile } = useCreatorProfile();
  const queryClient = useQueryClient();

  const { data: automationRules, isLoading } = useQuery({
    queryKey: ['automation-rules', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from('creator_automation_rules')
        .select('*')
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AutomationRule[];
    },
    enabled: !!profile?.id,
  });

  const createRule = useMutation({
    mutationFn: async (ruleData: Partial<AutomationRule>) => {
      if (!profile?.id) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('creator_automation_rules')
        .insert({
          creator_id: profile.id,
          rule_type: ruleData.rule_type!,
          conditions: ruleData.conditions || {},
          actions: ruleData.actions || {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      toast.success('Automation rule created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create rule: ${error.message}`);
    },
  });

  const updateRule = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AutomationRule> & { id: string }) => {
      const { data, error } = await supabase
        .from('creator_automation_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      toast.success('Automation rule updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update rule: ${error.message}`);
    },
  });

  const deleteRule = useMutation({
    mutationFn: async (ruleId: string) => {
      const { error } = await supabase
        .from('creator_automation_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      toast.success('Automation rule deleted successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to delete rule: ${error.message}`);
    },
  });

  return {
    automationRules: automationRules || [],
    isLoading,
    createRule,
    updateRule,
    deleteRule,
  };
};
