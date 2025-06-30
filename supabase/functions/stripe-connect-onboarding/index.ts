
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabase.auth.getUser(token);
    const user = data.user;

    if (!user?.id) throw new Error('User not authenticated');

    const { action, ...body } = await req.json();
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', { apiVersion: '2023-10-16' });

    switch (action) {
      case 'create_account': {
        const account = await stripe.accounts.create({
          type: 'express',
          country: body.country || 'US',
          email: user.email,
          business_type: body.business_type || 'individual',
          metadata: {
            user_id: user.id,
          },
        });

        // Create or update creator profile
        await supabase
          .from('creator_profiles')
          .upsert({
            user_id: user.id,
            stripe_account_id: account.id,
            verification_status: 'pending',
            bio: body.bio,
            portfolio_url: body.portfolio_url,
            specialties: body.specialties || [],
          });

        return new Response(JSON.stringify({ account_id: account.id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'create_account_link': {
        const { account_id } = body;
        const accountLink = await stripe.accountLinks.create({
          account: account_id,
          refresh_url: `${req.headers.get('origin')}/creator/onboarding?refresh=true`,
          return_url: `${req.headers.get('origin')}/creator/dashboard`,
          type: 'account_onboarding',
        });

        return new Response(JSON.stringify({ url: accountLink.url }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_account_status': {
        const { account_id } = body;
        const account = await stripe.accounts.retrieve(account_id);
        
        return new Response(JSON.stringify({
          charges_enabled: account.charges_enabled,
          details_submitted: account.details_submitted,
          payouts_enabled: account.payouts_enabled,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
