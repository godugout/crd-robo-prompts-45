
import React, { useState, useCallback, useEffect } from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { toast } from 'sonner';
import { Plus, FolderPlus, Save } from 'lucide-react';

interface ExtractedCard {
  id: string;
  imageBlob: Blob;
  imageUrl: string;
  confidence: number;
  sourceImageName: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
}

interface Collection {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  createdAt: Date | string;
}

interface CollectionSelectionPhaseProps {
  extractedCards: ExtractedCard[];
  onCollectionSelected: (collectionId: string) => void;
  onGoBack: () => void;
}

// Helper function to safely format dates
const formatDate = (date: Date | string): string => {
  try {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Unknown date';
  }
};

export const CollectionSelectionPhase: React.FC<CollectionSelectionPhaseProps> = ({
  extractedCards,
  onCollectionSelected,
  onGoBack
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load existing collections
  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = useCallback(() => {
    // For now, load from localStorage (in a real app, this would be from API)
    const savedCollections = JSON.parse(localStorage.getItem('cardshow_collections') || '[]');
    setCollections(savedCollections);
  }, []);

  const handleCreateNewCollection = useCallback(() => {
    if (!newCollectionName.trim()) {
      toast.error('Please enter a collection name');
      return;
    }

    const newCollection: Collection = {
      id: `collection-${Date.now()}`,
      name: newCollectionName.trim(),
      description: newCollectionDescription.trim(),
      cardCount: 0,
      createdAt: new Date()
    };

    // Save to localStorage (in a real app, this would be an API call)
    const updatedCollections = [...collections, newCollection];
    localStorage.setItem('cardshow_collections', JSON.stringify(updatedCollections));
    
    setCollections(updatedCollections);
    setSelectedCollectionId(newCollection.id);
    setIsCreatingNew(false);
    setNewCollectionName('');
    setNewCollectionDescription('');
    
    toast.success('Collection created successfully');
  }, [newCollectionName, newCollectionDescription, collections]);

  const handleSaveCards = useCallback(async () => {
    if (!selectedCollectionId) {
      toast.error('Please select a collection');
      return;
    }

    setIsSaving(true);
    
    try {
      toast.loading('Saving cards to collection...', {
        description: `Adding ${extractedCards.length} cards`
      });

      // In a real app, this would upload images to storage and save to database
      // For now, we'll simulate this process
      
      const cardsToSave = extractedCards.map(card => ({
        id: card.id,
        name: card.name,
        description: card.description,
        rarity: card.rarity,
        tags: card.tags,
        confidence: card.confidence,
        sourceImageName: card.sourceImageName,
        collectionId: selectedCollectionId,
        // In real app, this would be the uploaded image URL
        imageUrl: card.imageUrl,
        createdAt: new Date()
      }));

      // Save cards to localStorage
      const existingCards = JSON.parse(localStorage.getItem('cardshow_saved_cards') || '[]');
      const updatedCards = [...existingCards, ...cardsToSave];
      localStorage.setItem('cardshow_saved_cards', JSON.stringify(updatedCards));

      // Update collection card count
      const updatedCollections = collections.map(collection =>
        collection.id === selectedCollectionId
          ? { ...collection, cardCount: collection.cardCount + extractedCards.length }
          : collection
      );
      localStorage.setItem('cardshow_collections', JSON.stringify(updatedCollections));
      setCollections(updatedCollections);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`Successfully saved ${extractedCards.length} cards!`, {
        description: 'Cards have been added to your collection'
      });

      onCollectionSelected(selectedCollectionId);
      
    } catch (error) {
      console.error('Failed to save cards:', error);
      toast.error('Failed to save cards. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedCollectionId, extractedCards, collections, onCollectionSelected]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-crd-white mb-2">
            Save to Collection
          </h3>
          <p className="text-crd-lightGray">
            Choose a collection for your {extractedCards.length} cards
          </p>
        </div>
        <CRDButton
          variant="outline"
          onClick={onGoBack}
          disabled={isSaving}
        >
          Back to Customization
        </CRDButton>
      </div>

      {/* Card Summary */}
      <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-6">
        <h4 className="text-lg font-semibold text-crd-white mb-4">Cards to Save</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {extractedCards.slice(0, 12).map((card) => (
            <div key={card.id} className="relative">
              <div className="aspect-[3/4] bg-crd-darkGray rounded overflow-hidden">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                {card.name}
              </div>
            </div>
          ))}
          {extractedCards.length > 12 && (
            <div className="aspect-[3/4] bg-crd-mediumGray rounded flex items-center justify-center">
              <div className="text-center text-crd-lightGray">
                <div className="text-lg font-bold">+{extractedCards.length - 12}</div>
                <div className="text-xs">more cards</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collection Selection */}
      <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-crd-white">Select Collection</h4>
          <CRDButton
            variant="outline"
            onClick={() => setIsCreatingNew(true)}
            disabled={isSaving}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Collection
          </CRDButton>
        </div>

        {/* Create New Collection Form */}
        {isCreatingNew && (
          <div className="bg-editor-tool rounded-lg p-4 mb-6">
            <h5 className="font-medium text-crd-white mb-3">Create New Collection</h5>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Collection name..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="w-full px-3 py-2 bg-crd-darkGray border border-crd-mediumGray rounded-lg text-white"
                autoFocus
              />
              <textarea
                placeholder="Collection description (optional)..."
                value={newCollectionDescription}
                onChange={(e) => setNewCollectionDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-crd-darkGray border border-crd-mediumGray rounded-lg text-white resize-none"
              />
              <div className="flex gap-2">
                <CRDButton
                  variant="primary"
                  size="sm"
                  onClick={handleCreateNewCollection}
                  disabled={!newCollectionName.trim()}
                  className="bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Create
                </CRDButton>
                <CRDButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setNewCollectionName('');
                    setNewCollectionDescription('');
                  }}
                >
                  Cancel
                </CRDButton>
              </div>
            </div>
          </div>
        )}

        {/* Existing Collections */}
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCollectionId === collection.id
                    ? 'border-crd-green bg-crd-green/10'
                    : 'border-crd-mediumGray hover:border-crd-green/50'
                }`}
                onClick={() => setSelectedCollectionId(collection.id)}
              >
                <h6 className="font-semibold text-crd-white mb-1">{collection.name}</h6>
                {collection.description && (
                  <p className="text-sm text-crd-lightGray mb-2 line-clamp-2">
                    {collection.description}
                  </p>
                )}
                <div className="text-xs text-crd-lightGray">
                  {collection.cardCount} cards • Created {formatDate(collection.createdAt)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-crd-lightGray mb-4">No collections yet</p>
            <p className="text-sm text-crd-lightGray">Create your first collection to save these cards</p>
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-crd-white font-medium">
            {selectedCollectionId ? 'Ready to Save' : 'Select a Collection'}
          </p>
          <p className="text-sm text-crd-lightGray">
            {selectedCollectionId
              ? `${extractedCards.length} cards will be added to the selected collection`
              : 'Choose an existing collection or create a new one'
            }
          </p>
        </div>
        <CRDButton
          variant="primary"
          onClick={handleSaveCards}
          disabled={!selectedCollectionId || isSaving}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save {extractedCards.length} Cards
            </>
          )}
        </CRDButton>
      </div>
    </div>
  );
};
