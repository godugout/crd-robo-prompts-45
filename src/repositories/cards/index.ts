
import { supabase } from "@/lib/supabase-client";

export const CardRepository = {
  getFeaturedCards: async (limit = 4) => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching featured cards:', error);
      return [];
    }
  },
  
  getTrendingCards: async (limit = 4) => {
    try {
      // In a real app, we might use metrics like view count or reactions
      // For now, we're just getting the most recent to simulate "trending"
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching trending cards:', error);
      return [];
    }
  }
};
