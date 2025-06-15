
export interface CardNavigationData {
  cards: Array<{ id: string; title: string }>;
  source: 'gallery' | 'profile' | 'search' | 'collection';
  sourceId?: string;
}

export const setCardNavigationContext = (data: CardNavigationData) => {
  console.log('Setting card navigation context:', data);
  const context = {
    ...data,
    total: data.cards.length,
    currentIndex: 0 // Will be updated when viewing specific card
  };
  
  sessionStorage.setItem('cardNavigationContext', JSON.stringify(context));
  console.log('Stored navigation context in session storage');
};

export const createCardNavigationUrl = (cardId: string, context: CardNavigationData) => {
  const encodedContext = encodeURIComponent(JSON.stringify({
    ...context,
    total: context.cards.length,
    currentIndex: context.cards.findIndex(card => card.id === cardId)
  }));
  
  return `/card/${cardId}?context=${encodedContext}`;
};

// Helper function to manually test navigation context
export const testNavigationContext = (cardId: string) => {
  console.log('Setting test navigation context for card:', cardId);
  const testContext = {
    cards: [
      { id: '132cef10-e74d-40c2-9af6-cb22719e5e1e', title: 'Current Card' },
      { id: 'test-card-2', title: 'Test Card 2' },
      { id: 'test-card-3', title: 'Test Card 3' }
    ],
    source: 'gallery' as const,
    total: 3,
    currentIndex: 0
  };
  
  sessionStorage.setItem('cardNavigationContext', JSON.stringify(testContext));
  console.log('Test navigation context set');
  
  // Trigger a page refresh to reload the navigation
  window.location.reload();
};

// Make it available globally for testing
(window as any).testNavigationContext = testNavigationContext;
