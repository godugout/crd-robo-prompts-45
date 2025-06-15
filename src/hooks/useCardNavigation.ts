
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
    // Try to get navigation context from URL params or session storage
    const urlParams = new URLSearchParams(location.search);
    const contextData = urlParams.get('context');
    
    if (contextData) {
      try {
        const context = JSON.parse(decodeURIComponent(contextData));
        setNavigationContext(context);
      } catch (error) {
        console.warn('Failed to parse navigation context:', error);
      }
    } else {
      // Try to get from session storage
      const storedContext = sessionStorage.getItem('cardNavigationContext');
      if (storedContext) {
        try {
          const context = JSON.parse(storedContext);
          // Find current card index
          const currentIndex = context.cards.findIndex((card: any) => card.id === currentCardId);
          if (currentIndex !== -1) {
            setNavigationContext({
              ...context,
              currentIndex
            });
          }
        } catch (error) {
          console.warn('Failed to parse stored navigation context:', error);
        }
      }
    }
  }, [currentCardId, location.search]);

  const showNavigation = () => {
    setIsVisible(true);
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3500);
    setHideTimeout(timeout);
  };

  const hideNavigation = () => {
    setIsVisible(false);
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
  };

  const navigateToCard = (direction: 'prev' | 'next') => {
    if (!navigationContext) return;

    const newIndex = direction === 'prev' 
      ? navigationContext.currentIndex - 1 
      : navigationContext.currentIndex + 1;

    if (newIndex < 0 || newIndex >= navigationContext.total) return;

    const targetCard = navigationContext.cards[newIndex];
    if (!targetCard) return;

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
