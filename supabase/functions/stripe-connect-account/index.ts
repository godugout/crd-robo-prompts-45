
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { type, business_info, account_id } = await req.json();

    switch (type) {
      case 'create_account': {
        const account = await stripe.accounts.create({
          type: 'express',
          country: business_info.country || 'US',
          email: business_info.email,
          business_type: business_info.business_type || 'individual',
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
        });

        return new Response(
          JSON.stringify({ account_id: account.id }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create_account_link': {
        const accountLink = await stripe.accountLinks.create({
          account: account_id,
          refresh_url: `${req.headers.get('origin')}/marketplace/seller/refresh`,
          return_url: `${req.headers.get('origin')}/marketplace/seller/dashboard`,
          type: 'account_onboarding',
        });

        return new Response(
          JSON.stringify({ url: accountLink.url }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_account_status': {
        const account = await stripe.accounts.retrieve(account_id);
        
        return new Response(
          JSON.stringify({
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
            details_submitted: account.details_submitted,
            requirements: account.requirements
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid request type');
    }

  } catch (error) {
    console.error('Stripe Connect error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
