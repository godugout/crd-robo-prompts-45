
import { supabase } from '@/lib/supabase-client';

export interface RelatedCard {
  id: string;
  title: string;
}

export const fetchRelatedCards = async (currentCardId: string): Promise<RelatedCard[]> => {
  try {
    console.log('Fetching related cards for:', currentCardId);
    
    // First get the current card to understand its properties
    const { data: currentCard, error: currentCardError } = await supabase
      .from('cards')
      .select('creator_id, rarity, tags')
      .eq('id', currentCardId)
      .single();

    if (currentCardError) {
      console.error('Error fetching current card:', currentCardError);
      throw currentCardError;
    }

    console.log('Current card data:', currentCard);

    // Fetch related cards based on creator, then rarity, then recent cards
    let relatedCards: RelatedCard[] = [];

    // Strategy 1: Same creator's cards
    if (currentCard.creator_id) {
      const { data: creatorCards, error: creatorError } = await supabase
        .from('cards')
        .select('id, title')
        .eq('creator_id', currentCard.creator_id)
        .eq('is_public', true)
        .neq('id', currentCardId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!creatorError && creatorCards && creatorCards.length > 0) {
        relatedCards = creatorCards;
        console.log('Found creator cards:', relatedCards.length);
      }
    }

    // Strategy 2: Same rarity if we don't have enough cards
    if (relatedCards.length < 5 && currentCard.rarity) {
      const { data: rarityCards, error: rarityError } = await supabase
        .from('cards')
        .select('id, title')
        .eq('rarity', currentCard.rarity)
        .eq('is_public', true)
        .neq('id', currentCardId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!rarityError && rarityCards) {
        // Add cards that aren't already in the list
        const existingIds = new Set(relatedCards.map(c => c.id));
        const newCards = rarityCards.filter(c => !existingIds.has(c.id));
        relatedCards = [...relatedCards, ...newCards];
        console.log('Added rarity cards, total:', relatedCards.length);
      }
    }

    // Strategy 3: Recent public cards if we still don't have enough
    if (relatedCards.length < 5) {
      const { data: recentCards, error: recentError } = await supabase
        .from('cards')
        .select('id, title')
        .eq('is_public', true)
        .neq('id', currentCardId)
        .order('created_at', { ascending: false })
        .limit(15);

      if (!recentError && recentCards) {
        // Add cards that aren't already in the list
        const existingIds = new Set(relatedCards.map(c => c.id));
        const newCards = recentCards.filter(c => !existingIds.has(c.id));
        relatedCards = [...relatedCards, ...newCards].slice(0, 12); // Limit to 12 total
        console.log('Added recent cards, final total:', relatedCards.length);
      }
    }

    return relatedCards;
  } catch (error) {
    console.error('Error fetching related cards:', error);
    return [];
  }
};

export const getFallbackNavigationContext = (currentCardId: string, relatedCards: RelatedCard[]) => {
  const currentIndex = relatedCards.findIndex(card => card.id === currentCardId);
  
  // If current card isn't in the list, add it at the beginning
  let cards = relatedCards;
  let index = currentIndex;
  
  if (currentIndex === -1) {
    cards = [{ id: currentCardId, title: 'Current Card' }, ...relatedCards];
    index = 0;
  }

  return {
    cards,
    source: 'similar' as const,
    total: cards.length,
    currentIndex: index
  };
};
