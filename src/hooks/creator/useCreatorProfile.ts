
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CreatorProfile {
  id: string;
  user_id: string;
  stripe_account_id?: string;
  verification_status: 'pending' | 'verified' | 'rejected' | 'suspended';
  portfolio_url?: string;
  bio?: string;
  bio_extended?: string;
  specialties: string[];
  commission_rates: {
    standard: number;
    premium: number;
    custom: number;
  };
  total_earnings: number;
  cards_created: number;
  avg_rating: number;
  rating_count: number;
}

export const useCreatorProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['creator-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) return null;
      
      // Type assertion with proper commission_rates handling
      return {
        ...data,
        commission_rates: data.commission_rates as {
          standard: number;
          premium: number;
          custom: number;
        },
        specialties: data.specialties || [],
      } as CreatorProfile;
    },
    enabled: !!user?.id,
  });

  const createProfile = useMutation({
    mutationFn: async (profileData: Partial<CreatorProfile>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('creator_profiles')
        .insert({
          user_id: user.id,
          ...profileData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-profile'] });
      toast.success('Creator profile created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create profile: ${error.message}`);
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<CreatorProfile>) => {
      if (!profile?.id) throw new Error('No profile to update');

      const { data, error } = await supabase
        .from('creator_profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  const setupStripeAccount = useMutation({
    mutationFn: async (accountData: any) => {
      const { data, error } = await supabase.functions.invoke('stripe-connect-onboarding', {
        body: { action: 'create_account', ...accountData },
      });

      if (error) throw error;

      // Create account link for onboarding
      const linkResponse = await supabase.functions.invoke('stripe-connect-onboarding', {
        body: { action: 'create_account_link', account_id: data.account_id },
      });

      if (linkResponse.error) throw linkResponse.error;
      return linkResponse.data;
    },
    onSuccess: (data) => {
      window.open(data.url, '_blank');
      toast.success('Stripe account setup initiated!');
    },
    onError: (error) => {
      toast.error(`Stripe setup failed: ${error.message}`);
    },
  });

  return {
    profile,
    isLoading,
    createProfile,
    updateProfile,
    setupStripeAccount,
    isCreator: !!profile,
    isVerified: profile?.verification_status === 'verified',
  };
};
