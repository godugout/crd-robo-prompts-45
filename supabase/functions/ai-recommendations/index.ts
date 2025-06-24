
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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

    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    const { recommendation_type, limit = 10 } = await req.json();

    let recommendations = [];

    switch (recommendation_type) {
      case 'trending':
        recommendations = await getTrendingRecommendations(supabase, limit);
        break;
      case 'similar':
        recommendations = await getSimilarRecommendations(supabase, user.id, limit);
        break;
      case 'investment':
        recommendations = await getInvestmentRecommendations(supabase, user.id, limit);
        break;
      case 'collection_complete':
        recommendations = await getCollectionCompletionRecommendations(supabase, user.id, limit);
        break;
      default:
        recommendations = await getPersonalizedRecommendations(supabase, user.id, limit);
    }

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI recommendations error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function getTrendingRecommendations(supabase: any, limit: number) {
  const { data } = await supabase
    .from('market_analytics')
    .select(`
      card_id,
      trending_score,
      price_change_24h,
      volume,
      cards (
        id,
        title,
        image_url,
        rarity,
        price
      )
    `)
    .gte('trending_score', 0.3)
    .order('trending_score', { ascending: false })
    .limit(limit);

  return data?.map((item: any) => ({
    card_id: item.card_id,
    type: 'trending',
    score: item.trending_score,
    reasoning: {
      trend_score: item.trending_score,
      price_change: item.price_change_24h,
      volume: item.volume,
      reason: 'High trending activity and positive market momentum'
    },
    card: item.cards
  })) || [];
}

async function getSimilarRecommendations(supabase: any, userId: string, limit: number) {
  // Get user's recent purchases/views
  const { data: userActivity } = await supabase
    .from('user_portfolios')
    .select(`
      card_id,
      cards (
        rarity,
        tags
      )
    `)
    .eq('user_id', userId)
    .limit(5);

  if (!userActivity?.length) return [];

  const userRarities = [...new Set(userActivity.map((item: any) => item.cards.rarity))];
  const userTags = [...new Set(userActivity.flatMap((item: any) => item.cards.tags || []))];

  const { data } = await supabase
    .from('cards')
    .select(`
      id,
      title,
      image_url,
      rarity,
      price,
      tags
    `)
    .in('rarity', userRarities)
    .neq('creator_id', userId)
    .eq('is_public', true)
    .limit(limit * 2);

  return data?.filter((card: any) => 
    card.tags?.some((tag: string) => userTags.includes(tag))
  ).slice(0, limit).map((card: any) => ({
    card_id: card.id,
    type: 'similar',
    score: 0.8,
    reasoning: {
      similarity_factors: ['rarity_match', 'tag_overlap'],
      reason: 'Similar to cards in your collection'
    },
    card
  })) || [];
}

async function getInvestmentRecommendations(supabase: any, userId: string, limit: number) {
  const { data } = await supabase
    .from('market_analytics')
    .select(`
      card_id,
      price_change_24h,
      volume,
      liquidity_score,
      cards (
        id,
        title,
        image_url,
        rarity,
        price
      )
    `)
    .gt('price_change_24h', 5)
    .gt('volume', 10)
    .gt('liquidity_score', 0.5)
    .order('price_change_24h', { ascending: false })
    .limit(limit);

  return data?.map((item: any) => ({
    card_id: item.card_id,
    type: 'investment',
    score: Math.min(item.price_change_24h / 50, 1),
    reasoning: {
      price_growth: item.price_change_24h,
      volume: item.volume,
      liquidity: item.liquidity_score,
      reason: 'Strong price momentum with good liquidity'
    },
    card: item.cards
  })) || [];
}

async function getCollectionCompletionRecommendations(supabase: any, userId: string, limit: number) {
  // Get user's collections
  const { data: collections } = await supabase
    .from('collections')
    .select(`
      id,
      title,
      design_metadata,
      collection_cards (
        card_id,
        cards (
          rarity,
          tags
        )
      )
    `)
    .eq('owner_id', userId)
    .lt('completion_rate', 100);

  if (!collections?.length) return [];

  const recommendations = [];
  
  for (const collection of collections) {
    const targetRarity = collection.design_metadata?.target_rarity;
    const targetTags = collection.design_metadata?.target_tags || [];
    
    if (targetRarity || targetTags.length) {
      const { data: suggestions } = await supabase
        .from('cards')
        .select('id, title, image_url, rarity, price, tags')
        .eq('rarity', targetRarity)
        .eq('is_public', true)
        .limit(3);

      suggestions?.forEach((card: any) => {
        recommendations.push({
          card_id: card.id,
          type: 'collection_complete',
          score: 0.9,
          reasoning: {
            collection_id: collection.id,
            collection_name: collection.title,
            reason: `Completes "${collection.title}" collection`
          },
          card
        });
      });
    }
  }

  return recommendations.slice(0, limit);
}

async function getPersonalizedRecommendations(supabase: any, userId: string, limit: number) {
  // Combine multiple recommendation types
  const trending = await getTrendingRecommendations(supabase, Math.ceil(limit * 0.4));
  const similar = await getSimilarRecommendations(supabase, userId, Math.ceil(limit * 0.3));
  const investment = await getInvestmentRecommendations(supabase, userId, Math.ceil(limit * 0.3));

  return [...trending, ...similar, ...investment]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
