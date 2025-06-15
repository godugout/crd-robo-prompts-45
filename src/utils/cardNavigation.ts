
export interface CardNavigationData {
  cards: Array<{ id: string; title: string }>;
  source: 'gallery' | 'profile' | 'search' | 'collection';
  sourceId?: string;
}

export const setCardNavigationContext = (data: CardNavigationData) => {
  const context = {
    ...data,
    total: data.cards.length,
    currentIndex: 0 // Will be updated when viewing specific card
  };
  
  sessionStorage.setItem('cardNavigationContext', JSON.stringify(context));
};

export const createCardNavigationUrl = (cardId: string, context: CardNavigationData) => {
  const encodedContext = encodeURIComponent(JSON.stringify({
    ...context,
    total: context.cards.length,
    currentIndex: context.cards.findIndex(card => card.id === cardId)
  }));
  
  return `/card/${cardId}?context=${encodedContext}`;
};
