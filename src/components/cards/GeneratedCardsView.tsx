
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { CardGrid } from '@/components/cards/CardGrid';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { Sparkles } from 'lucide-react';

interface Card {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  rarity: string;
  tags: string[];
  created_at: string;
  design_metadata: any;
}

export const GeneratedCardsView = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGeneratedCards();
  }, []);

  const fetchGeneratedCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_public', true)
        .contains('tags', ['Sports'])
        .order('created_at', { ascending: false })
        .limit(101);

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (cards.length === 0) {
    return (
      <EmptyState
        icon={<Sparkles className="h-12 w-12" />}
        title="No Generated Cards Found"
        description="Use the card generator in the editor to create your first collection of CRDs."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Generated CRD Collection</h2>
        <p className="text-crd-lightGray">
          {cards.length} randomly generated cards with sports themes and player stats
        </p>
      </div>
      
      <CardGrid 
        cards={cards} 
        loading={false}
        viewMode="grid"
      />
    </div>
  );
};
