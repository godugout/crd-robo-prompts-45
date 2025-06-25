
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreatorProfile } from './useCreatorProfile';

export interface CreatorEarning {
  id: string;
  source_type: 'card_sale' | 'template_sale' | 'commission' | 'royalty' | 'subscription';
  amount: number;
  platform_fee: number;
  net_amount: number;
  transaction_date: string;
  payout_date?: string;
  payout_status: 'pending' | 'processing' | 'paid' | 'failed';
  card?: {
    id: string;
    title: string;
  };
  template?: {
    id: string;
    name: string;
  };
}

export const useCreatorEarnings = () => {
  const { profile } = useCreatorProfile();

  const { data: earnings, isLoading } = useQuery({
    queryKey: ['creator-earnings', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from('creator_earnings')
        .select(`
          *,
          card:cards(id, title),
          template:card_templates(id, name)
        `)
        .eq('creator_id', profile.id)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return data as CreatorEarning[];
    },
    enabled: !!profile?.id,
  });

  const { data: monthlyStats } = useQuery({
    queryKey: ['creator-monthly-stats', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;

      const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
      
      const { data, error } = await supabase
        .from('creator_earnings')
        .select('net_amount, source_type')
        .eq('creator_id', profile.id)
        .gte('transaction_date', currentMonth);

      if (error) throw error;

      const stats = data.reduce((acc, earning) => {
        acc.total += earning.net_amount;
        acc.bySource[earning.source_type] = (acc.bySource[earning.source_type] || 0) + earning.net_amount;
        return acc;
      }, { total: 0, bySource: {} as Record<string, number> });

      return stats;
    },
    enabled: !!profile?.id,
  });

  const { data: pendingPayouts } = useQuery({
    queryKey: ['creator-pending-payouts', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return 0;

      const { data, error } = await supabase
        .from('creator_earnings')
        .select('net_amount')
        .eq('creator_id', profile.id)
        .eq('payout_status', 'pending');

      if (error) throw error;
      return data.reduce((sum, earning) => sum + earning.net_amount, 0);
    },
    enabled: !!profile?.id,
  });

  return {
    earnings: earnings || [],
    monthlyStats,
    pendingPayouts,
    isLoading,
  };
};
