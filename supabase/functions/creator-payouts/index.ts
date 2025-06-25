
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

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', { apiVersion: '2023-10-16' });
    const { action, creator_id, amount } = await req.json();

    switch (action) {
      case 'process_monthly_payouts': {
        // Get all creators with pending earnings
        const { data: pendingEarnings } = await supabase
          .from('creator_earnings')
          .select(`
            creator_id,
            creator_profiles!inner(stripe_account_id),
            sum(net_amount) as total_amount
          `)
          .eq('payout_status', 'pending')
          .gte('transaction_date', new Date(new Date().setDate(1)).toISOString()) // This month
          .group('creator_id, creator_profiles.stripe_account_id')
          .having('sum(net_amount)', 'gte', 25); // Minimum $25 payout

        for (const earning of pendingEarnings || []) {
          try {
            // Create transfer to creator's Stripe account
            const transfer = await stripe.transfers.create({
              amount: Math.round(earning.total_amount * 100), // Convert to cents
              currency: 'usd',
              destination: earning.creator_profiles.stripe_account_id,
              metadata: {
                creator_id: earning.creator_id,
                payout_month: new Date().toISOString().slice(0, 7),
              },
            });

            // Update earnings status
            await supabase
              .from('creator_earnings')
              .update({
                payout_status: 'paid',
                payout_date: new Date().toISOString(),
                transaction_id: transfer.id,
              })
              .eq('creator_id', earning.creator_id)
              .eq('payout_status', 'pending');

          } catch (error) {
            console.error(`Payout failed for creator ${earning.creator_id}:`, error);
            await supabase
              .from('creator_earnings')
              .update({ payout_status: 'failed' })
              .eq('creator_id', earning.creator_id)
              .eq('payout_status', 'pending');
          }
        }

        return new Response(JSON.stringify({ processed: pendingEarnings?.length || 0 }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'record_sale': {
        const { card_id, template_id, buyer_id, sale_amount, source_type } = await req.json();
        
        // Calculate platform fee (30%)
        const platformFee = sale_amount * 0.3;
        const creatorAmount = sale_amount * 0.7;

        // Record the earning
        await supabase
          .from('creator_earnings')
          .insert({
            creator_id,
            source_type,
            amount: sale_amount,
            platform_fee: platformFee,
            net_amount: creatorAmount,
            card_id,
            template_id,
            buyer_id,
          });

        // Update creator profile totals
        await supabase
          .from('creator_profiles')
          .update({
            total_earnings: supabase.raw('total_earnings + ?', [creatorAmount]),
          })
          .eq('id', creator_id);

        return new Response(JSON.stringify({ success: true }), {
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
