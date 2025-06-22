
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

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabase.auth.getUser(token);
    const user = data.user;

    if (!user?.email) {
      throw new Error('User not authenticated');
    }

    const { listing_id, shipping_address, return_url, cancel_url } = await req.json();

    // Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('marketplace_listings')
      .select(`
        *,
        card:cards(*),
        seller:seller_profiles(*)
      `)
      .eq('id', listing_id)
      .single();

    if (listingError || !listing) {
      throw new Error('Listing not found');
    }

    // Calculate amounts
    const itemAmount = Math.round(listing.price * 100); // Convert to cents
    const shippingAmount = listing.shipping_cost ? Math.round(listing.shipping_cost * 100) : 0;
    const platformFeeAmount = Math.round(itemAmount * 0.05); // 5% platform fee
    const totalAmount = itemAmount + shippingAmount + platformFeeAmount;
    const sellerAmount = itemAmount + shippingAmount - platformFeeAmount;

    // Create payment intent with application fee
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      application_fee_amount: platformFeeAmount,
      transfer_data: {
        destination: listing.seller.stripe_account_id,
      },
      metadata: {
        listing_id: listing.id,
        buyer_id: user.id,
        seller_id: listing.seller_id,
      },
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_intent_data: {
        application_fee_amount: platformFeeAmount,
        transfer_data: {
          destination: listing.seller.stripe_account_id,
        },
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: listing.title,
              description: `Condition: ${listing.condition}`,
              images: listing.images || [],
            },
            unit_amount: itemAmount,
          },
          quantity: 1,
        },
      ],
      shipping_options: listing.shipping_cost ? [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: shippingAmount,
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ] : undefined,
      mode: 'payment',
      success_url: return_url,
      cancel_url: cancel_url,
      customer_email: user.email,
      metadata: {
        listing_id: listing.id,
        buyer_id: user.id,
      },
    });

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        buyer_id: user.id,
        seller_id: listing.seller_id,
        listing_id: listing.id,
        amount: listing.price,
        platform_fee: listing.price * 0.05,
        shipping_cost: listing.shipping_cost,
        total_amount: (itemAmount + shippingAmount + platformFeeAmount) / 100,
        stripe_payment_intent_id: paymentIntent.id,
        status: 'pending',
        shipping_address: shipping_address,
      });

    if (transactionError) {
      console.error('Transaction insert error:', transactionError);
    }

    return new Response(
      JSON.stringify({ checkout_url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Marketplace checkout error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
