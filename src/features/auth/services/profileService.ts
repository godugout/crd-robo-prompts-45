
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export class ProfileService {
  async ensureProfile(user: User) {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: user.user_metadata?.username || user.email?.split('@')[0],
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url,
          });

        if (error) {
          console.error('Error creating profile:', error);
        }
      }
    } catch (error) {
      console.error('Error in ensureProfile:', error);
    }
  }

  async updateProfile(userId: string, updates: Record<string, any>) {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    return { error };
  }
}

export const profileService = new ProfileService();
