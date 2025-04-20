
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';

interface AddReactionParams {
  targetId: string;
  targetType: 'memory' | 'comment' | 'collection';
  type: string;
  userId?: string;
}

export const addReaction = async (params: AddReactionParams): Promise<boolean> => {
  try {
    // Handle memory reactions
    if (params.targetType === 'memory') {
      // Try to use Supabase if available
      try {
        const { error } = await supabase
          .from('reactions')
          .insert({
            card_id: params.targetId, // Using card_id as in our DB schema, memories/cards are the same
            type: params.type,
            user_id: params.userId || 'demo-user' // In a real app, this would come from auth
          });

        if (error) throw error;
      } catch (e) {
        // Fallback to mock API
        const response = await fetch('/api/reactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            memoryId: params.targetId,
            type: params.type,
            userId: params.userId || 'demo-user'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to add reaction');
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error adding reaction:', error);
    toast({
      title: 'Error',
      description: 'Failed to add reaction',
      variant: 'destructive'
    });
    return false;
  }
};

export const removeReaction = async (reactionId: string): Promise<boolean> => {
  try {
    // Try to use Supabase if available
    try {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('id', reactionId);

      if (error) throw error;
    } catch (e) {
      // Fallback to mock API
      const response = await fetch(`/api/reactions/${reactionId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to remove reaction');
      }
    }

    return true;
  } catch (error) {
    console.error('Error removing reaction:', error);
    toast({
      title: 'Error',
      description: 'Failed to remove reaction',
      variant: 'destructive'
    });
    return false;
  }
};
