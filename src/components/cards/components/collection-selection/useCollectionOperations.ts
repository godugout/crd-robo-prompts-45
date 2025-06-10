
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import type { ExtractedCard } from './types';

interface Collection {
  id: string;
  title: string; // Fixed: using title instead of name
  description?: string;
  cardCount: number;
  createdAt: Date;
}

export const useCollectionOperations = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load existing collections from Supabase
  const loadCollections = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          id,
          title,
          description,
          created_at,
          collection_cards(count)
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading collections:', error);
        return;
      }

      const formattedCollections: Collection[] = (data || []).map(collection => ({
        id: collection.id,
        title: collection.title, // Fixed: using title consistently
        description: collection.description,
        cardCount: collection.collection_cards?.[0]?.count || 0,
        createdAt: new Date(collection.created_at)
      }));

      setCollections(formattedCollections);
    } catch (error) {
      console.error('Failed to load collections:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const handleCreateNewCollection = useCallback(async () => {
    if (!newCollectionName.trim() || !user?.id) {
      toast.error('Please enter a collection name');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('collections')
        .insert({
          title: newCollectionName.trim(), // Fixed: using title instead of name
          description: newCollectionDescription.trim() || null,
          owner_id: user.id,
          visibility: 'private'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating collection:', error);
        toast.error('Failed to create collection');
        return;
      }

      const newCollection: Collection = {
        id: data.id,
        title: data.title, // Fixed: using title consistently
        description: data.description,
        cardCount: 0,
        createdAt: new Date(data.created_at)
      };

      setCollections(prev => [newCollection, ...prev]);
      setSelectedCollectionId(data.id);
      setIsCreatingNew(false);
      setNewCollectionName('');
      setNewCollectionDescription('');
      
      toast.success('Collection created successfully');
    } catch (error) {
      console.error('Failed to create collection:', error);
      toast.error('Failed to create collection');
    }
  }, [newCollectionName, newCollectionDescription, user?.id]);

  const handleSaveCards = useCallback(async (
    extractedCards: ExtractedCard[],
    onCollectionSelected: (collectionId: string) => void
  ) => {
    if (!selectedCollectionId || !user?.id) {
      toast.error('Please select a collection');
      return;
    }

    setIsSaving(true);
    
    try {
      // Call the parent component's collection selection handler
      // This will trigger the bulk card saver which handles the actual saving
      onCollectionSelected(selectedCollectionId);
      
    } catch (error) {
      console.error('Failed to save cards:', error);
      toast.error('Failed to save cards. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedCollectionId, user?.id]);

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
