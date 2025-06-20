
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
import { AddToCollectionModal } from '../modals/AddToCollectionModal';
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
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleRemoveCard = (cardId: string) => {
    if (window.confirm('Are you sure you want to remove this card from the collection?')) {
      removeCardMutation.mutate({ collectionId, cardId });
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
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
            <Input
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-editor-dark border-crd-mediumGray text-crd-white"
            />
          </div>
          
          <Select value={rarityFilter} onValueChange={setRarityFilter}>
            <SelectTrigger className="w-40 bg-editor-dark border-crd-mediumGray">
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
            <SelectTrigger className="w-40 bg-editor-dark border-crd-mediumGray">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="display_order">Order</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="rarity">Rarity</SelectItem>
              <SelectItem value="date_added">Date Added</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
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

          {canEdit && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-crd-green text-black hover:bg-crd-green/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Cards
            </Button>
          )}
        </div>
      </div>

      {/* Cards Display */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-crd-lightGray mb-4">
            {searchTerm || rarityFilter !== 'all' ? 'No cards match your filters' : 'No cards in this collection yet'}
          </p>
          {canEdit && !searchTerm && rarityFilter === 'all' && (
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-crd-green text-black hover:bg-crd-green/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Card
            </Button>
          )}
        </div>
      ) : (
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8' 
            : 'grid-cols-1'
        }`}>
          {filteredCards.map((collectionCard) => (
            <CardItem
              key={collectionCard.id}
              collectionCard={collectionCard}
              viewMode={viewMode}
              canEdit={canEdit}
              onRemove={() => handleRemoveCard(collectionCard.card_id)}
              rarityColors={rarityColors}
            />
          ))}
        </div>
      )}

      {/* Add Cards Modal */}
      {showAddModal && (
        <AddToCollectionModal
          collectionId={collectionId}
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

interface CardItemProps {
  collectionCard: CollectionCard;
  viewMode: 'grid' | 'list';
  canEdit: boolean;
  onRemove: () => void;
  rarityColors: Record<string, string>;
}

const CardItem: React.FC<CardItemProps> = ({
  collectionCard,
  viewMode,
  canEdit,
  onRemove,
  rarityColors
}) => {
  const card = collectionCard.card;
  const isGrid = viewMode === 'grid';

  return (
    <Card className={`bg-editor-dark border-crd-mediumGray/20 hover:border-crd-green/50 transition-all group ${
      isGrid ? 'aspect-[2/3]' : 'h-24'
    }`}>
      <CardContent className={`p-3 h-full ${isGrid ? 'flex flex-col' : 'flex items-center gap-3'}`}>
        {/* Card Image */}
        <div className={`relative overflow-hidden rounded bg-crd-mediumGray/20 ${
          isGrid ? 'flex-1 mb-2' : 'w-16 h-16 flex-shrink-0'
        }`}>
          {card?.thumbnail_url || card?.image_url ? (
            <img 
              src={card.thumbnail_url || card.image_url} 
              alt={card.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 bg-crd-mediumGray rounded" />
            </div>
          )}
          
          {/* Quantity Badge */}
          {collectionCard.quantity > 1 && (
            <Badge className="absolute top-1 left-1 bg-crd-green text-black text-xs px-1">
              {collectionCard.quantity}x
            </Badge>
          )}

          {/* Actions Menu */}
          {canEdit && (
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={onRemove} className="text-red-400">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Card Info */}
        <div className={`${isGrid ? '' : 'flex-1'}`}>
          <h4 className={`font-medium text-crd-white ${isGrid ? 'text-xs' : 'text-sm'} line-clamp-2 mb-1`}>
            {card?.title || 'Unknown Card'}
          </h4>
          
          {card?.rarity && (
            <div className="flex items-center gap-1 mb-1">
              <div 
                className={`w-2 h-2 rounded-full ${rarityColors[card.rarity] || 'bg-gray-500'}`}
              />
              <span className={`text-crd-lightGray capitalize ${isGrid ? 'text-xs' : 'text-sm'}`}>
                {card.rarity}
              </span>
            </div>
          )}

          {collectionCard.notes && (
            <p className={`text-crd-lightGray ${isGrid ? 'text-xs' : 'text-sm'} line-clamp-1`}>
              {collectionCard.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
