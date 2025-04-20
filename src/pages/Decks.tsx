
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { Loader, Plus } from 'lucide-react';

interface Deck {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  coverImage?: string;
}

const Decks = () => {
  const { user, loading: userLoading } = useUser();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    if (user) {
      setLoading(true);
      // In a real app, fetch data from Supabase here
      setTimeout(() => {
        setDecks([
          {
            id: '1',
            title: 'Sports Collection',
            description: 'My favorite sports cards',
            cardCount: 12,
            coverImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80'
          },
          {
            id: '2',
            title: 'Art Collection',
            description: 'Beautiful art cards',
            cardCount: 8,
            coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80'
          },
          {
            id: '3',
            title: 'Travel Memories',
            description: 'Cards from my travels',
            cardCount: 15,
            coverImage: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&q=80'
          }
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  if (userLoading || loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <Loader className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>My Decks</CardTitle>
            <CardDescription>Please sign in to view your decks</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You need to be logged in to view and manage your card decks.</p>
          </CardContent>
          <CardFooter>
            <Button>Sign In</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Decks</h1>
          <p className="text-gray-500">Manage your card collections</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Deck
        </Button>
      </div>

      {decks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <h3 className="text-xl font-medium mb-2">No decks yet</h3>
            <p className="text-gray-500 mb-6">Create your first deck to organize your cards</p>
            <Button>Create New Deck</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <Card key={deck.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div 
                className="h-48 bg-cover bg-center" 
                style={{ backgroundImage: `url(${deck.coverImage || ''})` }}
              />
              <CardHeader>
                <CardTitle>{deck.title}</CardTitle>
                <CardDescription>{deck.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{deck.cardCount} cards</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">View</Button>
                <Button variant="outline" size="sm">Edit</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Decks;
