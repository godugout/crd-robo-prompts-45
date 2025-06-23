
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { MarketplaceListing } from '@/types/marketplace';

export const useMarketplace = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = async (filters?: any) => {
    try {
      setLoading(true);
      let query = supabase
        .from('marketplace_listings')
        .select(`
          *,
          card:cards(*),
          seller:crd_profiles(username, avatar_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.priceMin) {
        query = query.gte('price', filters.priceMin);
      }
      if (filters?.priceMax) {
        query = query.lte('price', filters.priceMax);
      }
      if (filters?.condition) {
        query = query.eq('condition', filters.condition);
      }
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Type assertion to handle the database type conversion
      const typedListings = (data || []).map(listing => ({
        ...listing,
        listing_type: listing.listing_type as 'fixed_price' | 'auction' | 'make_offer',
        condition: listing.condition as 'mint' | 'near_mint' | 'excellent' | 'good' | 'fair' | 'poor',
        status: listing.status as 'active' | 'sold' | 'cancelled' | 'expired'
      })) as MarketplaceListing[];
      
      setListings(typedListings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('marketplace-listings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'marketplace_listings'
        },
        () => {
          fetchListings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    listings,
    loading,
    error,
    refetch: fetchListings
  };
};
