
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface CardNavigationContext {
  currentIndex: number;
  total: number;
  source: 'gallery' | 'profile' | 'search' | 'collection';
  sourceId?: string;
  cards: Array<{ id: string; title: string }>;
}

export const useCardNavigation = (currentCardId: string) => {
  const [navigationContext, setNavigationContext] = useState<CardNavigationContext | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('useCardNavigation hook initialized with cardId:', currentCardId);
    console.log('Current location:', location.pathname, location.search);
    
    // Try to get navigation context from URL params or session storage
    const urlParams = new URLSearchParams(location.search);
    const contextData = urlParams.get('context');
    
    if (contextData) {
      console.log('Found context in URL params:', contextData);
      try {
        const context = JSON.parse(decodeURIComponent(contextData));
        console.log('Parsed context from URL:', context);
        setNavigationContext(context);
      } catch (error) {
        console.warn('Failed to parse navigation context:', error);
      }
    } else {
      // Try to get from session storage
      const storedContext = sessionStorage.getItem('cardNavigationContext');
      console.log('Checking session storage for context:', storedContext);
      
      if (storedContext) {
        try {
          const context = JSON.parse(storedContext);
          console.log('Parsed context from session storage:', context);
          
          // Find current card index
          const currentIndex = context.cards.findIndex((card: any) => card.id === currentCardId);
          console.log('Found current card index:', currentIndex);
          
          if (currentIndex !== -1) {
            const updatedContext = {
              ...context,
              currentIndex
            };
            console.log('Setting navigation context:', updatedContext);
            setNavigationContext(updatedContext);
          }
        } catch (error) {
          console.warn('Failed to parse stored navigation context:', error);
        }
      } else {
        console.log('No navigation context found in session storage');
      }
    }
  }, [currentCardId, location.search]);

  const showNavigation = () => {
    console.log('showNavigation called');
    setIsVisible(true);
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    const timeout = setTimeout(() => {
      console.log('Auto-hiding navigation after timeout');
      setIsVisible(false);
    }, 3500);
    setHideTimeout(timeout);
  };

  const hideNavigation = () => {
    console.log('hideNavigation called');
    setIsVisible(false);
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
  };

  const navigateToCard = (direction: 'prev' | 'next') => {
    if (!navigationContext) {
      console.log('No navigation context for navigation');
      return;
    }

    const newIndex = direction === 'prev' 
      ? navigationContext.currentIndex - 1 
      : navigationContext.currentIndex + 1;

    console.log('Navigating to index:', newIndex);

    if (newIndex < 0 || newIndex >= navigationContext.total) {
      console.log('Navigation out of bounds');
      return;
    }

    const targetCard = navigationContext.cards[newIndex];
    if (!targetCard) {
      console.log('Target card not found');
      return;
    }

    console.log('Navigating to card:', targetCard);

    // Update navigation context
    const updatedContext = {
      ...navigationContext,
      currentIndex: newIndex
    };
    
    // Store updated context
    sessionStorage.setItem('cardNavigationContext', JSON.stringify(updatedContext));
    
    // Navigate to card
    navigate(`/card/${targetCard.id}`);
  };

  const canNavigatePrev = navigationContext && navigationContext.currentIndex > 0;
  const canNavigateNext = navigationContext && navigationContext.currentIndex < navigationContext.total - 1;

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);

  console.log('useCardNavigation returning:', {
    navigationContext,
    isVisible,
    canNavigatePrev,
    canNavigateNext
  });

  return {
    navigationContext,
    isVisible,
    showNavigation,
    hideNavigation,
    navigateToCard,
    canNavigatePrev,
    canNavigateNext
  };
};
