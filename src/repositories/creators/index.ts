
import { supabase } from "@/lib/supabase-client";

export const CreatorRepository = {
  getPopularCreators: async (limit = 4) => {
    try {
      // In a real app, we might use metrics like followers or card count
      // For now, we're just getting profiles to simulate "popular creators"
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(limit);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching popular creators:', error);
      return [];
    }
  }
};
