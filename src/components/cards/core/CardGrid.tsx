
import React, { useEffect, useRef, useCallback } from 'react';
import { Card, CardFilters } from '@/types/cards';
import { CardDisplay } from './CardDisplay';
import { useCards, useToggleFavorite } from '@/hooks/cards/useCards';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/common/LoadingState';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface CardGridProps {
  filters?: CardFilters;
  variant?: 'grid' | 'list';
  onCardView?: (card: Card) => void;
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  filters = {},
  variant = 'grid',
  onCardView,
  className = ''
}) => {
  const { user } = useAuth();
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useCards(filters);

  const toggleFavorite = useToggleFavorite();

  // Infinite scroll implementation
  const lastCardRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleFavorite = async (card: Card) => {
    if (!user) {
      toast.error('Please sign in to favorite cards');
      return;
    }

    try {
      await toggleFavorite.mutateAsync({
        cardId: card.id,
        userId: user.id
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleShare = async (card: Card) => {
    try {
      await navigator.share({
        title: card.name,
        text: card.description || `Check out this ${card.rarity} ${card.card_type} card!`,
        url: window.location.origin + `/cards/${card.id}`
      });
    } catch (error) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.origin + `/cards/${card.id}`);
      toast.success('Card link copied to clipboard!');
    }
  };

  // Flatten paginated data
  const cards = data?.pages.flatMap(page => page.cards) || [];
  const totalCards = data?.pages[0]?.total || 0;

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">Failed to load cards</div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState message="Loading awesome cards..." />;
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎴</div>
        <h3 className="text-xl font-bold text-white mb-2">No cards found</h3>
        <p className="text-crd-lightGray mb-4">
          Try adjusting your filters or check back later for new cards.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  const gridClasses = variant === 'grid' 
    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
    : 'space-y-4';

  return (
    <div className={className}>
      {/* Results summary */}
      <div className="mb-6 text-sm text-crd-lightGray">
        Showing {cards.length} of {totalCards} cards
      </div>

      {/* Cards grid/list */}
      <div className={gridClasses}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            ref={index === cards.length - 1 ? lastCardRef : null}
          >
            <CardDisplay
              card={card}
              variant={variant}
              onView={onCardView}
              onFavorite={handleFavorite}
              onShare={handleShare}
            />
          </div>
        ))}
      </div>

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className="text-center py-8">
          <LoadingState message="Loading more cards..." />
        </div>
      )}

      {/* Load more button (fallback) */}
      {hasNextPage && !isFetchingNextPage && (
        <div className="text-center py-8">
          <Button onClick={() => fetchNextPage()} variant="outline">
            Load More Cards
          </Button>
        </div>
      )}

      {/* End of results */}
      {!hasNextPage && cards.length > 10 && (
        <div className="text-center py-8 text-crd-lightGray">
          <div className="text-2xl mb-2">🎉</div>
          <p>You've seen all the cards!</p>
        </div>
      )}
    </div>
  );
};
