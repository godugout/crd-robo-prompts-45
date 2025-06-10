
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { Collection, ExtractedCard } from './types';

export const useCollectionOperations = () => {
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

    const updatedCollections = [...collections, newCollection];
    localStorage.setItem('cardshow_collections', JSON.stringify(updatedCollections));
    
    setCollections(updatedCollections);
    setSelectedCollectionId(newCollection.id);
    setIsCreatingNew(false);
    setNewCollectionName('');
    setNewCollectionDescription('');
    
    toast.success('Collection created successfully');
  }, [newCollectionName, newCollectionDescription, collections]);

  const handleSaveCards = useCallback(async (
    extractedCards: ExtractedCard[],
    onCollectionSelected: (collectionId: string) => void
  ) => {
    if (!selectedCollectionId) {
      toast.error('Please select a collection');
      return;
    }

    setIsSaving(true);
    
    try {
      toast.loading('Saving cards to collection...', {
        description: `Adding ${extractedCards.length} cards`
      });

      const cardsToSave = extractedCards.map(card => ({
        id: card.id,
        name: card.name,
        description: card.description,
        rarity: card.rarity,
        tags: card.tags,
        confidence: card.confidence,
        sourceImageName: card.sourceImageName,
        collectionId: selectedCollectionId,
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
  }, [selectedCollectionId, collections]);

  const cancelNewCollection = useCallback(() => {
    setIsCreatingNew(false);
    setNewCollectionName('');
    setNewCollectionDescription('');
  }, []);

  return {
    collections,
    selectedCollectionId,
    setSelectedCollectionId,
    isCreatingNew,
    setIsCreatingNew,
    newCollectionName,
    setNewCollectionName,
    newCollectionDescription,
    setNewCollectionDescription,
    isSaving,
    handleCreateNewCollection,
    handleSaveCards,
    cancelNewCollection
  };
};
