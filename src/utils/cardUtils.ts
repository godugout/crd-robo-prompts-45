
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

export const makeUserCardsPublic = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cards')
      .update({ is_public: true })
      .eq('creator_id', userId)
      .eq('is_public', false);

    if (error) {
      console.error('Error making cards public:', error);
      toast.error('Failed to make cards public');
      return false;
    }

    toast.success('Your cards have been made public and will now appear in the gallery!');
    return true;
  } catch (error) {
    console.error('Error making cards public:', error);
    toast.error('Failed to make cards public');
    return false;
  }
};
