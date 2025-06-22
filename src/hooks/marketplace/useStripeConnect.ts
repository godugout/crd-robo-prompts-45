
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useStripeConnect = () => {
  const [loading, setLoading] = useState(false);

  const createSellerAccount = async (businessInfo: any) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('stripe-connect-account', {
        body: { 
          type: 'create_account',
          business_info: businessInfo 
        }
      });

      if (error) throw error;

      // Update seller profile with Stripe account ID
      const { error: profileError } = await supabase
        .from('seller_profiles')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          stripe_account_id: data.account_id,
          business_name: businessInfo.business_name,
          business_type: businessInfo.business_type,
          verification_status: 'pending'
        });

      if (profileError) throw profileError;

      toast.success('Seller account created! Please complete verification.');
      return data;
    } catch (error) {
      toast.error('Failed to create seller account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAccountLink = async (accountId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-connect-account', {
        body: { 
          type: 'create_account_link',
          account_id: accountId 
        }
      });

      if (error) throw error;
      return data.url;
    } catch (error) {
      toast.error('Failed to get verification link');
      throw error;
    }
  };

  return {
    createSellerAccount,
    getAccountLink,
    loading
  };
};
