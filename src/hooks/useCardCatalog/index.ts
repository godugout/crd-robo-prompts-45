
import { useState, useCallback } from 'react';
import { FilterOptions, SortOption, CatalogState } from './types';
import { useUploadQueue } from './useUploadQueue';
import { useCardOperations } from './useCardOperations';
import { useCardFiltering } from './useCardFiltering';
import { useCardProcessing } from './useCardProcessing';

const initialState: CatalogState = {
  currentSession: null,
  uploadQueue: [],
  detectedCards: new Map(),
  selectedCards: new Set(),
  processingStatus: {
    total: 0,
    completed: 0,
    failed: 0,
    inProgress: []
  },
  filters: {
    status: 'all',
    confidence: { min: 0, max: 1 },
    dateRange: { start: null, end: null },
    searchTerm: ''
  },
  sortBy: { field: 'confidence', direction: 'desc' },
  viewMode: 'grid',
  isProcessing: false,
  showReview: false
};

export const useCardCatalog = () => {
  const [state, setState] = useState<CatalogState>(initialState);

  // Individual state setters for focused updates
  const setUploadQueue = useCallback((files: File[]) => {
    setState(prev => ({ ...prev, uploadQueue: files }));
  }, []);

  const setDetectedCards = useCallback((cards: Map<string, any>) => {
    setState(prev => ({ ...prev, detectedCards: cards }));
  }, []);

  const setSelectedCards = useCallback((cards: Set<string>) => {
    setState(prev => ({ ...prev, selectedCards: cards }));
  }, []);

  const setIsProcessing = useCallback((processing: boolean) => {
    setState(prev => ({ ...prev, isProcessing: processing }));
  }, []);

  const setShowReview = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showReview: show }));
  }, []);

  const setProcessingStatus = useCallback((status: any) => {
    setState(prev => ({ ...prev, processingStatus: status }));
  }, []);

  const setFilters = useCallback((filters: FilterOptions) => {
    setState(prev => ({ ...prev, filters }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setState(prev => ({ ...prev, sortBy }));
  }, []);

  const setViewMode = useCallback((mode: 'grid' | 'list') => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  // Use specialized hooks
  const uploadQueue = useUploadQueue({
    uploadQueue: state.uploadQueue,
    setUploadQueue
  });

  const cardOperations = useCardOperations({
    detectedCards: state.detectedCards,
    selectedCards: state.selectedCards,
    setDetectedCards,
    setSelectedCards
  });

  const cardFiltering = useCardFiltering({
    detectedCards: state.detectedCards,
    selectedCards: state.selectedCards,
    filters: state.filters,
    sortBy: state.sortBy,
    setFilters,
    setSortBy,
    setSelectedCards
  });

  const cardProcessing = useCardProcessing({
    uploadQueue: state.uploadQueue,
    setUploadQueue,
    setDetectedCards,
    setSelectedCards,
    setIsProcessing,
    setShowReview,
    setProcessingStatus
  });

  const createSelectedCards = useCallback(() => {
    cardProcessing.createSelectedCards(state.detectedCards, state.selectedCards);
  }, [cardProcessing, state.detectedCards, state.selectedCards]);

  return {
    // State
    ...state,
    filteredCards: cardFiltering.filteredCards,
    
    // Upload Queue Actions
    addToQueue: uploadQueue.addToQueue,
    clearQueue: uploadQueue.clearQueue,
    removeFromQueue: uploadQueue.removeFromQueue,
    
    // Card Operations
    selectCard: cardOperations.selectCard,
    deselectCard: cardOperations.deselectCard,
    toggleCardSelection: cardOperations.toggleCardSelection,
    deleteSelected: cardOperations.deleteSelected,
    editCardBounds: cardOperations.editCardBounds,
    clearDetectedCards: cardOperations.clearDetectedCards,
    
    // Filtering & Sorting
    updateFilters: cardFiltering.updateFilters,
    updateSort: cardFiltering.updateSort,
    selectAllVisible: cardFiltering.selectAllVisible,
    clearSelection: cardFiltering.clearSelection,
    
    // Processing
    processQueue: cardProcessing.processQueue,
    createSelectedCards,
    
    // View Mode
    setViewMode
  };
};

// Re-export types for convenience
export type { FilterOptions, SortOption, CatalogState } from './types';
