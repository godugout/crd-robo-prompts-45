
import { useState, useEffect } from 'react';
import { cardActionService } from '@/services/cardActions';

export const useCardActions = (cardId: string) => {
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cardId) return;

    const fetchCardStats = async () => {
      setLoading(true);
      try {
        const stats = await cardActionService.getCardStats(cardId);
        setLikeCount(stats.likeCount);
        setViewCount(stats.viewCount);
        setIsLiked(stats.isLiked);
        setIsBookmarked(stats.isBookmarked);
      } catch (error) {
        console.error('Error fetching card stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardStats();
  }, [cardId]);

  const handleLike = async () => {
    const success = isLiked 
      ? await cardActionService.unlikeCard(cardId)
      : await cardActionService.likeCard(cardId);
    
    if (success) {
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    }
  };

  const handleBookmark = async () => {
    const success = isBookmarked
      ? await cardActionService.removeBookmark(cardId)
      : await cardActionService.bookmarkCard(cardId);
    
    if (success) {
      setIsBookmarked(!isBookmarked);
    }
  };

  const handleDownload = async () => {
    await cardActionService.downloadCard(cardId);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this card!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          url: shareUrl
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        // toast is handled in the service
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      // Using a simple approach since toast is in service
      console.log('Link copied to clipboard');
    }
  };

  return {
    likeCount,
    viewCount,
    isLiked,
    isBookmarked,
    loading,
    handleLike,
    handleBookmark,
    handleDownload,
    handleShare
  };
};
