
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CardActionService {
  likeCard: (cardId: string) => Promise<boolean>;
  unlikeCard: (cardId: string) => Promise<boolean>;
  bookmarkCard: (cardId: string) => Promise<boolean>;
  removeBookmark: (cardId: string) => Promise<boolean>;
  downloadCard: (cardId: string, downloadType?: string) => Promise<boolean>;
  getCardStats: (cardId: string) => Promise<{
    likeCount: number;
    viewCount: number;
    isLiked: boolean;
    isBookmarked: boolean;
  }>;
}

class CardActionServiceImpl implements CardActionService {
  async likeCard(cardId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to like cards');
        return false;
      }

      const { error } = await supabase
        .from('reactions')
        .insert({
          card_id: cardId,
          user_id: user.id,
          reaction_type: 'like'
        });

      if (error) {
        console.error('Error liking card:', error);
        toast.error('Failed to like card');
        return false;
      }

      toast.success('Card liked!');
      return true;
    } catch (error) {
      console.error('Error liking card:', error);
      toast.error('Failed to like card');
      return false;
    }
  }

  async unlikeCard(cardId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to manage likes');
        return false;
      }

      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('card_id', cardId)
        .eq('user_id', user.id)
        .eq('reaction_type', 'like');

      if (error) {
        console.error('Error unliking card:', error);
        toast.error('Failed to unlike card');
        return false;
      }

      toast.success('Like removed');
      return true;
    } catch (error) {
      console.error('Error unliking card:', error);
      toast.error('Failed to unlike card');
      return false;
    }
  }

  async bookmarkCard(cardId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to bookmark cards');
        return false;
      }

      const { error } = await supabase
        .from('bookmarks')
        .insert({
          card_id: cardId,
          user_id: user.id
        });

      if (error) {
        console.error('Error bookmarking card:', error);
        toast.error('Failed to bookmark card');
        return false;
      }

      toast.success('Card bookmarked!');
      return true;
    } catch (error) {
      console.error('Error bookmarking card:', error);
      toast.error('Failed to bookmark card');
      return false;
    }
  }

  async removeBookmark(cardId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to manage bookmarks');
        return false;
      }

      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('card_id', cardId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing bookmark:', error);
        toast.error('Failed to remove bookmark');
        return false;
      }

      toast.success('Bookmark removed');
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Failed to remove bookmark');
      return false;
    }
  }

  async downloadCard(cardId: string, downloadType: string = 'image'): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Track download even for anonymous users, but associate with user if logged in
      const { error } = await supabase
        .from('card_downloads')
        .insert({
          card_id: cardId,
          user_id: user?.id || null,
          download_type: downloadType
        });

      if (error) {
        console.error('Error tracking download:', error);
        // Don't fail download if tracking fails
      }

      // Get the card to download
      const { data: card, error: cardError } = await supabase
        .from('cards')
        .select('image_url, title')
        .eq('id', cardId)
        .single();

      if (cardError || !card?.image_url) {
        toast.error('Card image not found');
        return false;
      }

      // Create download link
      const link = document.createElement('a');
      link.href = card.image_url;
      link.download = `${card.title || 'card'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Card download started!');
      return true;
    } catch (error) {
      console.error('Error downloading card:', error);
      toast.error('Failed to download card');
      return false;
    }
  }

  async getCardStats(cardId: string): Promise<{
    likeCount: number;
    viewCount: number;
    isLiked: boolean;
    isBookmarked: boolean;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get counts using the database function
      const { data: counts, error: countsError } = await supabase
        .rpc('get_card_reaction_counts', { card_uuid: cardId });

      if (countsError) {
        console.error('Error getting card counts:', countsError);
      }

      let isLiked = false;
      let isBookmarked = false;

      // Get user status if logged in
      if (user) {
        const { data: userStatus, error: statusError } = await supabase
          .rpc('get_user_card_status', { 
            card_uuid: cardId, 
            user_uuid: user.id 
          });

        if (!statusError && userStatus && userStatus.length > 0) {
          isLiked = userStatus[0].is_liked;
          isBookmarked = userStatus[0].is_bookmarked;
        }
      }

      return {
        likeCount: counts && counts.length > 0 ? Number(counts[0].like_count) : 0,
        viewCount: counts && counts.length > 0 ? Number(counts[0].view_count) : 0,
        isLiked,
        isBookmarked
      };
    } catch (error) {
      console.error('Error getting card stats:', error);
      return {
        likeCount: 0,
        viewCount: 0,
        isLiked: false,
        isBookmarked: false
      };
    }
  }
}

export const cardActionService = new CardActionServiceImpl();
