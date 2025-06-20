
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Check,
  Grid,
  List,
  Filter
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAddCardToCollection } from '@/hooks/collections/useCollectionQueries';
import { LoadingState } from '@/components/common/LoadingState';

interface AddToCollectionModalProps {
  collectionId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  collectionId,
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [rarityFilter, setRarityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const addCardMutation = useAddCardToCollection();

  // Fetch available cards (not already in collection)
  const { data: availableCards, isLoading } = useQuery({
    queryKey: ['available-cards', collectionId, searchTerm, rarityFilter],
    queryFn: async () => {
      let query = supabase
        .from('cards')
        .select('*')
        .not('id', 'in', `(
          SELECT card_id FROM collection_cards WHERE collection_id = '${collectionId}'
        )`);

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (rarityFilter !== 'all') {
        query = query.eq('rarity', rarityFilter);
      }

      query = query.order('created_at', { ascending: false }).limit(50);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: isOpen
  });

  const handleCardToggle = (cardId: string) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedCards(newSelected);
  };

  const handleAddSelected = async () => {
    const promises = Array.from(selectedCards).map(cardId =>
      addCardMutation.mutateAsync({ collectionId, cardId })
    );

    try {
      await Promise.all(promises);
      setSelectedCards(new Set());
      onClose();
    } catch (error) {
      console.error('Failed to add cards:', error);
    }
  };

  const rarityColors = {
    common: 'bg-gray-500',
    uncommon: 'bg-green-500',
    rare: 'bg-blue-500',
    epic: 'bg-purple-500',
    legendary: 'bg-orange-500'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] bg-editor-dark border-crd-mediumGray">
        <DialogHeader>
          <DialogTitle className="text-crd-white">Add Cards to Collection</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
              <Input
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-crd-darkGray border-crd-mediumGray text-crd-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                className="px-3 py-2 bg-crd-darkGray border border-crd-mediumGray rounded-md text-crd-white"
              >
                <option value="all">All Rarities</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>

              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Selected Cards Count */}
          {selectedCards.size > 0 && (
            <div className="flex items-center justify-between p-3 bg-crd-green/10 border border-crd-green/20 rounded-lg">
              <span className="text-crd-white">
                {selectedCards.size} card{selectedCards.size !== 1 ? 's' : ''} selected
              </span>
              <Button
                onClick={handleAddSelected}
                disabled={addCardMutation.isPending}
                className="bg-crd-green text-black hover:bg-crd-green/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                {addCardMutation.isPending ? 'Adding...' : 'Add Selected'}
              </Button>
            </div>
          )}

          {/* Cards Grid */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <LoadingState message="Loading cards..." />
            ) : !availableCards?.length ? (
              <div className="text-center py-8">
                <p className="text-crd-lightGray">
                  {searchTerm ? 'No cards match your search' : 'No cards available to add'}
                </p>
              </div>
            ) : (
              <div className={`grid gap-3 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' 
                  : 'grid-cols-1'
              }`}>
                {availableCards.map((card) => (
                  <Card
                    key={card.id}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedCards.has(card.id)
                        ? 'border-crd-green bg-crd-green/10'
                        : 'border-crd-mediumGray/20 hover:border-crd-green/50'
                    } ${viewMode === 'grid' ? 'aspect-[2/3]' : 'h-20'}`}
                    onClick={() => handleCardToggle(card.id)}
                  >
                    <CardContent className={`p-2 h-full ${
                      viewMode === 'grid' ? 'flex flex-col' : 'flex items-center gap-3'
                    }`}>
                      {/* Card Image */}
                      <div className={`relative overflow-hidden rounded bg-crd-mediumGray/20 ${
                        viewMode === 'grid' ? 'flex-1 mb-2' : 'w-12 h-12 flex-shrink-0'
                      }`}>
                        {card.thumbnail_url || card.image_url ? (
                          <img 
                            src={card.thumbnail_url || card.image_url} 
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-6 h-6 bg-crd-mediumGray rounded" />
                          </div>
                        )}

                        {/* Selection Indicator */}
                        {selectedCards.has(card.id) && (
                          <div className="absolute inset-0 bg-crd-green/20 flex items-center justify-center">
                            <div className="w-8 h-8 bg-crd-green rounded-full flex items-center justify-center">
                              <Check className="w-5 h-5 text-black" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Info */}
                      <div className={`${viewMode === 'grid' ? '' : 'flex-1'}`}>
                        <h4 className={`font-medium text-crd-white ${
                          viewMode === 'grid' ? 'text-xs' : 'text-sm'
                        } line-clamp-2 mb-1`}>
                          {card.title}
                        </h4>
                        
                        {card.rarity && (
                          <div className="flex items-center gap-1">
                            <div 
                              className={`w-2 h-2 rounded-full ${rarityColors[card.rarity] || 'bg-gray-500'}`}
                            />
                            <span className={`text-crd-lightGray capitalize ${
                              viewMode === 'grid' ? 'text-xs' : 'text-sm'
                            }`}>
                              {card.rarity}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-crd-mediumGray">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-crd-mediumGray text-crd-lightGray"
          >
            Cancel
          </Button>
          {selectedCards.size > 0 && (
            <Button
              onClick={handleAddSelected}
              disabled={addCardMutation.isPending}
              className="bg-crd-green text-black hover:bg-crd-green/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {selectedCards.size} Card{selectedCards.size !== 1 ? 's' : ''}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
