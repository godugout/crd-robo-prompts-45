
import { supabase } from "@/lib/supabase-client";

export const CollectionRepository = {
  getHotCollections: async (limit = 3) => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*, profiles!collections_owner_id_fkey(full_name, avatar_url)')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching hot collections:', error);
      return [];
    }
  },
  
  getAllCollections: async (page = 1, limit = 8) => {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error, count } = await supabase
        .from('collections')
        .select('*, profiles!collections_owner_id_fkey(full_name, avatar_url)', { count: 'exact' })
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
        
      if (error) throw error;
      
      return {
        collections: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching all collections:', error);
      return {
        collections: [],
        total: 0
      };
    }
  }
};
