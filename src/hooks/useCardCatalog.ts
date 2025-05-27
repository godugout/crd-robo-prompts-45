
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { cardDetectionService, DetectedCard, ProcessingResult, UploadSession } from '@/services/cardCatalog/CardDetectionService';

export interface FilterOptions {
  status: 'all' | 'detected' | 'processing' | 'enhanced' | 'error';
  confidence: { min: number; max: number };
  dateRange: { start: Date | null; end: Date | null };
  searchTerm: string;
}

export interface SortOption {
  field: 'confidence' | 'date' | 'name' | 'status';
  direction: 'asc' | 'desc';
}

export interface CatalogState {
  currentSession: UploadSession | null;
  uploadQueue: File[];
  detectedCards: Map<string, DetectedCard>;
  selectedCards: Set<string>;
  processingStatus: {
    total: number;
    completed: number;
    failed: number;
    inProgress: string[];
  };
  filters: FilterOptions;
  sortBy: SortOption;
  viewMode: 'grid' | 'list';
  isProcessing: boolean;
  showReview: boolean;
}

export const useCardCatalog = () => {
  const [state, setState] = useState<CatalogState>({
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
  });

  const processingRef = useRef<AbortController | null>(null);

  const addToQueue = useCallback((files: File[]) => {
    setState(prev => ({
      ...prev,
      uploadQueue: [...prev.uploadQueue, ...files]
    }));
    toast.success(`Added ${files.length} files to queue`);
  }, []);

  const processQueue = useCallback(async () => {
    if (state.uploadQueue.length === 0) {
      toast.warning('No files in queue to process');
      return;
    }

    setState(prev => ({ ...prev, isProcessing: true }));
    processingRef.current = new AbortController();

    try {
      toast.info(`Processing ${state.uploadQueue.length} images...`);
      
      const results = await cardDetectionService.processBatch(state.uploadQueue);
      
      // Flatten all detected cards from all results
      const allCards = new Map<string, DetectedCard>();
      let totalDetected = 0;

      results.forEach(result => {
        result.cards.forEach(card => {
          allCards.set(card.id, card);
          totalDetected++;
        });
      });

      setState(prev => ({
        ...prev,
        detectedCards: new Map([...prev.detectedCards, ...allCards]),
        uploadQueue: [],
        isProcessing: false,
        showReview: totalDetected > 0,
        processingStatus: {
          total: state.uploadQueue.length,
          completed: totalDetected,
          failed: 0,
          inProgress: []
        }
      }));

      toast.success(`Successfully detected ${totalDetected} cards from ${results.length} images!`);
    } catch (error) {
      console.error('Batch processing failed:', error);
      setState(prev => ({ ...prev, isProcessing: false }));
      toast.error('Processing failed. Please try again.');
    }
  }, [state.uploadQueue]);

  const selectCard = useCallback((cardId: string) => {
    setState(prev => ({
      ...prev,
      selectedCards: new Set([...prev.selectedCards, cardId])
    }));
  }, []);

  const deselectCard = useCallback((cardId: string) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedCards);
      newSelected.delete(cardId);
      return {
        ...prev,
        selectedCards: newSelected
      };
    });
  }, []);

  const toggleCardSelection = useCallback((cardId: string) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedCards);
      if (newSelected.has(cardId)) {
        newSelected.delete(cardId);
      } else {
        newSelected.add(cardId);
      }
      return {
        ...prev,
        selectedCards: newSelected
      };
    });
  }, []);

  const selectAllVisible = useCallback(() => {
    const visibleCards = getFilteredCards();
    setState(prev => ({
      ...prev,
      selectedCards: new Set([...prev.selectedCards, ...visibleCards.map(c => c.id)])
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedCards: new Set()
    }));
  }, []);

  const deleteSelected = useCallback(() => {
    setState(prev => {
      const newCards = new Map(prev.detectedCards);
      prev.selectedCards.forEach(cardId => {
        newCards.delete(cardId);
      });
      return {
        ...prev,
        detectedCards: newCards,
        selectedCards: new Set()
      };
    });
    toast.success(`Deleted ${state.selectedCards.size} cards`);
  }, [state.selectedCards.size]);

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
  }, []);

  const updateSort = useCallback((newSort: SortOption) => {
    setState(prev => ({
      ...prev,
      sortBy: newSort
    }));
  }, []);

  const setViewMode = useCallback((mode: 'grid' | 'list') => {
    setState(prev => ({
      ...prev,
      viewMode: mode
    }));
  }, []);

  const clearDetectedCards = useCallback(() => {
    setState(prev => ({
      ...prev,
      detectedCards: new Map(),
      selectedCards: new Set(),
      showReview: false
    }));
  }, []);

  const createSelectedCards = useCallback(() => {
    const selectedCardData = Array.from(state.detectedCards.values())
      .filter(card => state.selectedCards.has(card.id));
    
    // TODO: Integrate with card creation service
    toast.success(`Creating ${selectedCardData.length} cards...`);
    
    // Clear after creation
    setState(prev => ({
      ...prev,
      detectedCards: new Map(),
      selectedCards: new Set(),
      showReview: false
    }));
  }, [state.detectedCards, state.selectedCards]);

  const editCardBounds = useCallback((cardId: string, bounds: DetectedCard['bounds']) => {
    setState(prev => {
      const newCards = new Map(prev.detectedCards);
      const card = newCards.get(cardId);
      if (card) {
        newCards.set(cardId, { ...card, bounds });
      }
      return {
        ...prev,
        detectedCards: newCards
      };
    });
  }, []);

  const getFilteredCards = useCallback((): DetectedCard[] => {
    let cards = Array.from(state.detectedCards.values());

    // Apply filters
    if (state.filters.status !== 'all') {
      cards = cards.filter(card => card.status === state.filters.status);
    }

    cards = cards.filter(card => 
      card.confidence >= state.filters.confidence.min && 
      card.confidence <= state.filters.confidence.max
    );

    if (state.filters.searchTerm) {
      const term = state.filters.searchTerm.toLowerCase();
      cards = cards.filter(card => 
        card.metadata?.player?.name.toLowerCase().includes(term) ||
        card.metadata?.team?.name.toLowerCase().includes(term) ||
        card.metadata?.series?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    cards.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (state.sortBy.field) {
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

      if (aVal < bVal) return state.sortBy.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return state.sortBy.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return cards;
  }, [state.detectedCards, state.filters, state.sortBy]);

  const clearQueue = useCallback(() => {
    setState(prev => ({
      ...prev,
      uploadQueue: []
    }));
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      uploadQueue: prev.uploadQueue.filter((_, i) => i !== index)
    }));
  }, []);

  return {
    // State
    ...state,
    filteredCards: getFilteredCards(),
    
    // Actions
    addToQueue,
    processQueue,
    clearQueue,
    removeFromQueue,
    selectCard,
    deselectCard,
    toggleCardSelection,
    selectAllVisible,
    clearSelection,
    deleteSelected,
    updateFilters,
    updateSort,
    setViewMode,
    clearDetectedCards,
    createSelectedCards,
    editCardBounds
  };
};
