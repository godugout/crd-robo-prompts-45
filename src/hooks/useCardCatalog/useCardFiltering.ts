
import { useCallback, useMemo } from 'react';
import { FilterOptions, SortOption } from './types';

interface UseCardFilteringProps {
  detectedCards: Map<string, any>;
  selectedCards: Set<string>;
  filters: FilterOptions;
  sortBy: SortOption;
  setFilters: (filters: FilterOptions) => void;
  setSortBy: (sort: SortOption) => void;
  setSelectedCards: (cards: Set<string>) => void;
}

export const useCardFiltering = ({
  detectedCards,
  selectedCards,
  filters,
  sortBy,
  setFilters,
  setSortBy,
  setSelectedCards
}: UseCardFilteringProps) => {
  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters({ ...filters, ...newFilters });
  }, [filters, setFilters]);

  const updateSort = useCallback((newSort: SortOption) => {
    setSortBy(newSort);
  }, [setSortBy]);

  const getFilteredCards = useCallback((): any[] => {
    let cards = Array.from(detectedCards.values());

    // Apply filters
    if (filters.status !== 'all') {
      cards = cards.filter(card => card.status === filters.status);
    }

    cards = cards.filter(card => 
      card.confidence >= filters.confidence.min && 
      card.confidence <= filters.confidence.max
    );

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      cards = cards.filter(card => 
        card.metadata?.player?.name.toLowerCase().includes(term) ||
        card.metadata?.team?.name.toLowerCase().includes(term) ||
        card.metadata?.series?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    cards.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy.field) {
        case 'confidence':
          aVal = a.confidence;
          bVal = b.confidence;
          break;
        case 'date':
          aVal = a.processingTime || 0;
          bVal = b.processingTime || 0;
          break;
        case 'name':
          aVal = a.metadata?.player?.name || '';
          bVal = b.metadata?.player?.name || '';
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortBy.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortBy.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return cards;
  }, [detectedCards, filters, sortBy]);

  const filteredCards = useMemo(() => getFilteredCards(), [getFilteredCards]);

  const selectAllVisible = useCallback(() => {
    const visibleCards = filteredCards;
    setSelectedCards(new Set([...selectedCards, ...visibleCards.map(c => c.id)]));
  }, [filteredCards, selectedCards, setSelectedCards]);

  const clearSelection = useCallback(() => {
    setSelectedCards(new Set());
  }, [setSelectedCards]);

  return {
    filteredCards,
    updateFilters,
    updateSort,
    selectAllVisible,
    clearSelection
  };
};
