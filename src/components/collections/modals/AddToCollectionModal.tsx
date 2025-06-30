
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, CheckCircle } from 'lucide-react';
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
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  // Mock data - in real implementation, this would come from useCards hook
  const mockCards = [
    {
      id: '1',
      title: 'Sample Card 1',
      image_url: 'https://via.placeholder.com/200x280',
      rarity: 'rare',
      description: 'A sample card'
    },
    {
      id: '2',
      title: 'Sample Card 2',
      image_url: 'https://via.placeholder.com/200x280',
      rarity: 'common',
      description: 'Another sample card'
    }
  ];

  const filteredCards = mockCards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardToggle = (cardId: string) => {
    setSelectedCards(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleAddCards = () => {
    // In real implementation, this would use the addCardToCollection mutation
    console.log('Adding cards to collection:', selectedCards);
    onClose();
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
      <DialogContent className="bg-editor-dark border-crd-mediumGray max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-crd-white">Add Cards to Collection</DialogTitle>
          <DialogDescription className="text-crd-lightGray">
            Search and select cards to add to your collection.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
          <Input
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-editor-dark border-crd-mediumGray text-crd-white"
          />
        </div>

        {/* Cards Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredCards.map((card) => (
              <Card
                key={card.id}
                className={`cursor-pointer transition-all ${
                  selectedCards.includes(card.id)
                    ? 'ring-2 ring-crd-green bg-crd-green/10'
                    : 'bg-editor-dark border-crd-mediumGray/20 hover:border-crd-green/50'
                }`}
                onClick={() => handleCardToggle(card.id)}
              >
                <CardContent className="p-2">
                  <div className="relative aspect-[2/3] mb-2">
                    <img
                      src={card.image_url}
                      alt={card.title}
                      className="w-full h-full object-cover rounded"
                    />
                    
                    {selectedCards.includes(card.id) && (
                      <div className="absolute top-1 right-1">
                        <CheckCircle className="w-5 h-5 text-crd-green" />
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-xs font-medium text-crd-white mb-1 line-clamp-2">
                    {card.title}
                  </h4>
                  
                  <div className="flex items-center gap-1">
                    <div 
                      className={`w-2 h-2 rounded-full ${rarityColors[card.rarity] || 'bg-gray-500'}`}
                    />
                    <span className="text-xs text-crd-lightGray capitalize">
                      {card.rarity}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-crd-mediumGray/20">
          <p className="text-sm text-crd-lightGray">
            {selectedCards.length} card{selectedCards.length !== 1 ? 's' : ''} selected
          </p>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCards}
              disabled={selectedCards.length === 0}
              className="bg-crd-green text-black hover:bg-crd-green/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Selected Cards
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
