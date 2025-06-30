
import React, { useState } from 'react';
import { useUserCollections, useCreateCollection, useAddCardToCollection } from '@/hooks/collections/useCollectionQueries';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/common/LoadingState';
import { Search, Plus, Check } from 'lucide-react';
import { Card as CardType } from '@/types/cards';

interface AddToCollectionModalProps {
  card: CardType;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  card,
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set());
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  const { data: collections, isLoading } = useUserCollections(user?.id || '');
  const createCollection = useCreateCollection();
  const addCardToCollection = useAddCardToCollection();

  const filteredCollections = collections?.filter(collection =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleToggleCollection = (collectionId: string) => {
    const newSelected = new Set(selectedCollections);
    if (newSelected.has(collectionId)) {
      newSelected.delete(collectionId);
    } else {
      newSelected.add(collectionId);
    }
    setSelectedCollections(newSelected);
  };

  const handleCreateAndAdd = async () => {
    if (!newCollectionTitle.trim() || !user) return;

    try {
      const newCollection = await createCollection.mutateAsync({
        title: newCollectionTitle.trim(),
        description: newCollectionDescription.trim() || undefined,
        owner_id: user.id,
        visibility: 'private',
        design_metadata: {},
        tags: [],
        allow_comments: true,
        is_template: false
      });

      // Add to selected collections
      setSelectedCollections(prev => new Set([...prev, newCollection.id]));
      
      // Reset form
      setNewCollectionTitle('');
      setNewCollectionDescription('');
      setIsCreatingNew(false);
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  const handleAddToCollections = async () => {
    if (selectedCollections.size === 0) return;

    const promises = Array.from(selectedCollections).map(collectionId =>
      addCardToCollection.mutateAsync({
        collectionId,
        cardId: card.id,
        quantity: 1
      })
    );

    try {
      await Promise.all(promises);
      onClose();
    } catch (error) {
      console.error('Failed to add card to collections:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-crd-dark border-crd-mediumGray max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white">Add "{card.title}" to Collections</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray" />
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-crd-mediumGray border-crd-mediumGray text-white"
            />
          </div>

          {/* Create New Collection */}
          <div>
            {!isCreatingNew ? (
              <Button
                variant="outline"
                onClick={() => setIsCreatingNew(true)}
                className="w-full border-dashed border-crd-mediumGray text-crd-lightGray hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Collection
              </Button>
            ) : (
              <Card className="bg-crd-mediumGray/20 border-crd-mediumGray">
                <CardContent className="p-4 space-y-3">
                  <Input
                    placeholder="Collection title..."
                    value={newCollectionTitle}
                    onChange={(e) => setNewCollectionTitle(e.target.value)}
                    className="bg-crd-mediumGray border-crd-mediumGray text-white"
                  />
                  <Textarea
                    placeholder="Description (optional)..."
                    value={newCollectionDescription}
                    onChange={(e) => setNewCollectionDescription(e.target.value)}
                    className="bg-crd-mediumGray border-crd-mediumGray text-white"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateAndAdd}
                      disabled={!newCollectionTitle.trim() || createCollection.isPending}
                      size="sm"
                      className="bg-crd-green text-black hover:bg-crd-green/80"
                    >
                      Create
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreatingNew(false)}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Collections List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {isLoading ? (
              <LoadingState message="Loading collections..." />
            ) : filteredCollections.length > 0 ? (
              filteredCollections.map((collection) => (
                <Card
                  key={collection.id}
                  className={`cursor-pointer transition-colors ${
                    selectedCollections.has(collection.id)
                      ? 'bg-crd-green/20 border-crd-green'
                      : 'bg-crd-dark border-crd-mediumGray hover:border-crd-green/50'
                  }`}
                  onClick={() => handleToggleCollection(collection.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">{collection.title}</h4>
                        {collection.description && (
                          <p className="text-sm text-crd-lightGray line-clamp-2">
                            {collection.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {collection.visibility}
                          </Badge>
                          <span className="text-xs text-crd-lightGray">
                            {Math.round(collection.completion_rate || 0)}% complete
                          </span>
                        </div>
                      </div>
                      
                      {selectedCollections.has(collection.id) && (
                        <div className="ml-4 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📚</div>
                <p className="text-crd-lightGray">
                  {searchQuery ? 'No collections match your search.' : 'No collections yet.'}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleAddToCollections}
              disabled={selectedCollections.size === 0 || addCardToCollection.isPending}
              className="flex-1 bg-crd-green text-black hover:bg-crd-green/80"
            >
              Add to {selectedCollections.size} Collection{selectedCollections.size !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
