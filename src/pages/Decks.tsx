
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, Grid, List, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckboxCard } from '@/components/card/CheckboxCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase-client';

interface Deck {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  coverImage?: string;
  cards?: string[];
  ownerId: string;
  createdAt: string;
}

interface Card {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
}

const Decks = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // New/Edit Deck Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [deckTitle, setDeckTitle] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [availableCards, setAvailableCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);

  // Delete Confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<Deck | null>(null);

  const fetchDecks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Try with Supabase first
      let data;
      try {
        const { data: collectionsData, error } = await supabase
          .from('collections')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });
          
        if (!error && collectionsData) {
          data = collectionsData.map(collection => ({
            id: collection.id,
            title: collection.title,
            description: collection.description || '',
            cardCount: 0, // We'll need another query to count the cards
            coverImage: collection.cover_image_url,
            ownerId: collection.owner_id,
            createdAt: collection.created_at
          }));
        }
      } catch (e) {
        console.error('Supabase error, falling back to mock:', e);
      }

      // Fallback to mock API if Supabase fails
      if (!data) {
        const response = await fetch(`/api/decks?userId=${user.id}`);
        const result = await response.json();
        data = result.items;
      }

      setDecks(data);
    } catch (error) {
      console.error('Failed to fetch decks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your collections',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCards = async () => {
    if (!user) return;
    
    try {
      setLoadingCards(true);
      
      // Try with Supabase first
      let data;
      try {
        const { data: memoriesData, error } = await supabase
          .from('memories')
          .select('id, title, description, media(url)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (!error && memoriesData) {
          data = memoriesData.map(memory => ({
            id: memory.id,
            title: memory.title,
            description: memory.description,
            image_url: memory.media?.[0]?.url
          }));
        }
      } catch (e) {
        console.error('Supabase error, falling back to mock:', e);
      }

      // Fallback to mock API if Supabase fails
      if (!data) {
        const response = await fetch('/api/cards');
        const result = await response.json();
        data = result.items;
      }

      setAvailableCards(data);
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    } finally {
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, [user]);

  const openCreateDialog = () => {
    setEditingDeck(null);
    setDeckTitle('');
    setDeckDescription('');
    setSelectedCards([]);
    fetchAvailableCards();
    setIsDialogOpen(true);
  };

  const openEditDialog = async (deck: Deck) => {
    setEditingDeck(deck);
    setDeckTitle(deck.title);
    setDeckDescription(deck.description || '');
    
    // Try to fetch the cards in this deck
    try {
      let deckCards: string[] = [];

      // Try with Supabase first
      try {
        if (user) {
          const { data, error } = await supabase
            .from('collection_items')
            .select('memory_id')
            .eq('collection_id', deck.id);
            
          if (!error && data) {
            deckCards = data.map(item => item.memory_id);
          }
        }
      } catch (e) {
        console.error('Supabase error, falling back to mock:', e);
      }

      // Fallback to mock API
      if (deckCards.length === 0) {
        const response = await fetch(`/api/decks/${deck.id}`);
        const fullDeck = await response.json();
        deckCards = fullDeck.cards?.map((card: any) => card.id) || [];
      }

      setSelectedCards(deckCards);
    } catch (error) {
      console.error('Failed to fetch deck cards:', error);
      setSelectedCards([]);
    }
    
    await fetchAvailableCards();
    setIsDialogOpen(true);
  };

  const handleSaveDeck = async () => {
    if (!user) return;
    
    if (!deckTitle.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a title for your collection',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const isEditing = !!editingDeck;
      const deckData = {
        title: deckTitle,
        description: deckDescription,
        cards: selectedCards,
        ownerId: user.id
      };
      
      let savedDeck;
      
      // Try with Supabase first
      try {
        if (isEditing) {
          // Update existing collection
          const { data, error } = await supabase
            .from('collections')
            .update({
              title: deckTitle,
              description: deckDescription
            })
            .eq('id', editingDeck.id)
            .select()
            .single();
            
          if (error) throw error;
          
          // Update the cards in the collection
          // First remove existing items
          await supabase
            .from('collection_items')
            .delete()
            .eq('collection_id', editingDeck.id);
            
          // Then add new items
          if (selectedCards.length > 0) {
            const collectionItems = selectedCards.map((cardId, index) => ({
              collection_id: editingDeck.id,
              memory_id: cardId,
              display_order: index
            }));
            
            await supabase
              .from('collection_items')
              .insert(collectionItems);
          }
          
          savedDeck = data;
        } else {
          // Create new collection
          const { data, error } = await supabase
            .from('collections')
            .insert({
              title: deckTitle,
              description: deckDescription,
              owner_id: user.id,
              visibility: 'private'
            })
            .select()
            .single();
            
          if (error) throw error;
          
          // Add cards to the collection
          if (selectedCards.length > 0) {
            const collectionItems = selectedCards.map((cardId, index) => ({
              collection_id: data.id,
              memory_id: cardId,
              display_order: index
            }));
            
            await supabase
              .from('collection_items')
              .insert(collectionItems);
          }
          
          savedDeck = data;
        }
      } catch (e) {
        console.error('Supabase error, falling back to mock:', e);
      }

      // Fallback to mock API
      if (!savedDeck) {
        if (isEditing) {
          const response = await fetch(`/api/decks/${editingDeck.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deckData)
          });
          savedDeck = await response.json();
        } else {
          const response = await fetch('/api/decks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deckData)
          });
          savedDeck = await response.json();
        }
      }
      
      toast({
        title: isEditing ? 'Collection Updated' : 'Collection Created',
        description: isEditing ? 'Your changes have been saved' : 'Your new collection has been created'
      });
      
      setIsDialogOpen(false);
      fetchDecks();
    } catch (error) {
      console.error('Failed to save deck:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your collection',
        variant: 'destructive'
      });
    }
  };

  const confirmDeleteDeck = (deck: Deck) => {
    setDeckToDelete(deck);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDeck = async () => {
    if (!deckToDelete) return;
    
    try {
      // Try with Supabase first
      try {
        // Delete the collection items first
        await supabase
          .from('collection_items')
          .delete()
          .eq('collection_id', deckToDelete.id);
          
        // Then delete the collection
        const { error } = await supabase
          .from('collections')
          .delete()
          .eq('id', deckToDelete.id);
          
        if (error) throw error;
      } catch (e) {
        console.error('Supabase error, falling back to mock:', e);
        
        // Fallback to mock API
        await fetch(`/api/decks/${deckToDelete.id}`, {
          method: 'DELETE'
        });
      }
      
      toast({
        title: 'Collection Deleted',
        description: 'Your collection has been deleted'
      });
      
      setDeleteDialogOpen(false);
      setDeckToDelete(null);
      fetchDecks();
    } catch (error) {
      console.error('Failed to delete deck:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete your collection',
        variant: 'destructive'
      });
    }
  };

  const toggleCardSelection = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  const filteredDecks = decks.filter(deck => 
    deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#141416]">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#FCFCFD]">My Collections</h1>
              <p className="text-[#777E90]">Organize and manage your card collections</p>
            </div>
            <Button 
              className="bg-[#3772FF] hover:bg-[#3772FF]/90"
              onClick={openCreateDialog}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Collection
            </Button>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Input 
                placeholder="Search collections..." 
                className="bg-[#353945] border-[#353945] text-[#FCFCFD] pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#777E90] h-4 w-4" />
            </div>
            <Button variant="outline" className="border-[#353945] text-[#FCFCFD]">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <div className="flex rounded-md overflow-hidden border border-[#353945]">
              <Button 
                variant="ghost" 
                className={`rounded-none px-3 ${viewMode === 'grid' ? 'text-[#FCFCFD]' : 'text-[#777E90]'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                className={`rounded-none px-3 ${viewMode === 'list' ? 'text-[#FCFCFD]' : 'text-[#777E90]'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="bg-[#23262F] border-[#353945] h-64 animate-pulse">
                <div className="h-48 bg-[#353945]" />
                <CardContent className="h-16 bg-[#353945] mt-4" />
              </Card>
            ))}
          </div>
        ) : filteredDecks.length === 0 ? (
          <Card className="bg-[#23262F] border-[#353945]">
            <CardContent className="flex flex-col items-center py-16">
              <h3 className="text-xl font-medium text-[#FCFCFD] mb-2">No collections yet</h3>
              <p className="text-[#777E90] mb-6">Create your first collection to organize your cards</p>
              <Button 
                className="bg-[#3772FF] hover:bg-[#3772FF]/90"
                onClick={openCreateDialog}
              >
                Create New Collection
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck) => (
              <Card key={deck.id} className="bg-[#23262F] border-[#353945] overflow-hidden hover:border-[#3772FF] transition-all">
                <div 
                  className="h-48 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${deck.coverImage || ''})` }}
                />
                <CardHeader>
                  <CardTitle className="text-[#FCFCFD]">{deck.title}</CardTitle>
                  <CardDescription className="text-[#777E90]">{deck.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#777E90]">{deck.cardCount} cards</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-[#353945] pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-[#353945] text-[#FCFCFD]"
                    onClick={() => openEditDialog(deck)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-[#353945] text-[#FCFCFD]"
                    onClick={() => confirmDeleteDeck(deck)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Deck Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#23262F] border-[#353945] text-[#FCFCFD] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingDeck ? 'Edit Collection' : 'Create New Collection'}</DialogTitle>
            <DialogDescription className="text-[#777E90]">
              {editingDeck ? 'Update your collection details and cards' : 'Add a new collection to organize your cards'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#FCFCFD]">Collection Title</Label>
              <Input
                id="title"
                placeholder="My Awesome Collection"
                className="bg-[#353945] border-[#353945] text-[#FCFCFD]"
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#FCFCFD]">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your collection..."
                className="bg-[#353945] border-[#353945] text-[#FCFCFD]"
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[#FCFCFD]">Select Cards</Label>
              {loadingCards ? (
                <div className="flex justify-center p-8">
                  <p className="text-[#777E90]">Loading cards...</p>
                </div>
              ) : availableCards.length === 0 ? (
                <div className="flex justify-center p-8">
                  <p className="text-[#777E90]">No cards available</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto p-1">
                  <div className="grid grid-cols-2 gap-4">
                    {availableCards.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => toggleCardSelection(card.id)}
                        className={`p-2 rounded-lg cursor-pointer border-2 ${
                          selectedCards.includes(card.id) 
                            ? 'border-[#3772FF] bg-[#3772FF]/10' 
                            : 'border-[#353945]'
                        }`}
                      >
                        {card.image_url && (
                          <div 
                            className="h-24 bg-cover bg-center rounded-lg mb-2" 
                            style={{ backgroundImage: `url(${card.image_url})` }}
                          />
                        )}
                        <p className="text-sm font-medium truncate">{card.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-sm text-[#777E90]">
                {selectedCards.length} card{selectedCards.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-[#353945] text-[#FCFCFD]"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#3772FF] hover:bg-[#3772FF]/90"
              onClick={handleSaveDeck}
            >
              {editingDeck ? 'Save Changes' : 'Create Collection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#23262F] border-[#353945] text-[#FCFCFD]">
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogDescription className="text-[#777E90]">
              Are you sure you want to delete this collection? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-[#353945] text-[#FCFCFD]"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteDeck}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Decks;
