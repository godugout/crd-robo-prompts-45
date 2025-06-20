
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter,
  Grid,
  List,
  MoreHorizontal,
  Trash2,
  Edit
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRemoveCardFromCollection } from '@/hooks/collections/useCollectionQueries';
import type { CollectionCard } from '@/types/collections';

interface CollectionCardsGridProps {
  collectionId: string;
  cards: CollectionCard[];
  canEdit: boolean;
}

export const CollectionCardsGrid: React.FC<CollectionCardsGridProps> = ({
  collectionId,
  cards,
  canEdit
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('display_order');

  const removeCardMutation = useRemoveCardFromCollection();

  // Filter and sort cards
  const filteredCards = cards
    .filter(card => {
      const matchesSearch = searchTerm === '' || 
        (card.card?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         card.notes?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRarity = rarityFilter === 'all' || card.card?.rarity === rarityFilter;
      
      return matchesSearch && matchesRarity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'display_order':
          return a.display_order - b.display_order;
        case 'name':
          return (a.card?.title || '').localeCompare(b.card?.title || '');
        case 'rarity':
          return (a.card?.rarity || '').localeCompare(b.card?.rarity || '');
        case 'date_added':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  const handleRemoveCard = async (cardId: string) => {
    try {
      await removeCardMutation.mutateAsync({ collectionId, cardId });
    } catch (error) {
      console.error('Failed to remove card:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
            <Input
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-crd-mediumGray border-crd-mediumGray text-white"
            />
          </div>

          <Select value={rarityFilter} onValueChange={setRarityFilter}>
            <SelectTrigger className="w-32 bg-crd-mediumGray border-crd-mediumGray">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="uncommon">Uncommon</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-crd-mediumGray border-crd-mediumGray">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="display_order">Display Order</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="rarity">Rarity</SelectItem>
              <SelectItem value="date_added">Date Added</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Button size="sm" className="bg-crd-green text-black hover:bg-crd-green/80">
              <Plus className="w-4 h-4 mr-2" />
              Add Cards
            </Button>
          )}

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

      {/* Cards Display */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-crd-lightGray">
            {searchTerm || rarityFilter !== 'all' ? 'No cards match your filters.' : 'No cards in this collection yet.'}
          </p>
        </div>
      ) : (
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
            : 'grid-cols-1'
        }`}>
          {filteredCards.map((collectionCard) => (
            <Card key={collectionCard.id} className="bg-crd-dark border-crd-mediumGray">
              <CardContent className={`p-4 ${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}>
                {/* Card Image */}
                <div className={`bg-crd-mediumGray/20 rounded-lg overflow-hidden ${
                  viewMode === 'grid' ? 'aspect-[2/3] mb-3' : 'w-16 h-20 flex-shrink-0'
                }`}>
                  {collectionCard.card?.image_url ? (
                    <img 
                      src={collectionCard.card.image_url} 
                      alt={collectionCard.card.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">🎴</span>
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1 line-clamp-1">
                    {collectionCard.card?.title || 'Unknown Card'}
                  </h4>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {collectionCard.card?.rarity || 'common'}
                    </Badge>
                    {collectionCard.quantity > 1 && (
                      <Badge variant="outline" className="text-xs">
                        x{collectionCard.quantity}
                      </Badge>
                    )}
                  </div>

                  {collectionCard.notes && (
                    <p className="text-xs text-crd-lightGray mb-2 line-clamp-2">
                      {collectionCard.notes}
                    </p>
                  )}

                  <p className="text-xs text-crd-lightGray">
                    Added {new Date(collectionCard.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                {canEdit && (
                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Notes
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRemoveCard(collectionCard.card?.id || '')}
                          className="text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
