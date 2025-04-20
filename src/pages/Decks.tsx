
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Deck {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  coverImage?: string;
}

const Decks = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Mock data for demonstration
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
  }, []);

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
            <Button className="bg-[#3772FF] hover:bg-[#3772FF]/90">
              <Plus className="mr-2 h-4 w-4" />
              New Collection
            </Button>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input 
                placeholder="Search collections..." 
                className="bg-[#353945] border-[#353945] text-[#FCFCFD]"
                prefix={<Search className="text-[#777E90]" />}
              />
            </div>
            <Button variant="outline" className="border-[#353945] text-[#FCFCFD]">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <div className="flex rounded-md overflow-hidden border border-[#353945]">
              <Button variant="ghost" className="rounded-none px-3 text-[#FCFCFD]">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="rounded-none px-3 text-[#777E90]">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {decks.length === 0 ? (
          <Card className="bg-[#23262F] border-[#353945]">
            <CardContent className="flex flex-col items-center py-16">
              <h3 className="text-xl font-medium text-[#FCFCFD] mb-2">No collections yet</h3>
              <p className="text-[#777E90] mb-6">Create your first collection to organize your cards</p>
              <Button className="bg-[#3772FF] hover:bg-[#3772FF]/90">Create New Collection</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
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
                  <Button variant="outline" size="sm" className="border-[#353945] text-[#FCFCFD]">View</Button>
                  <Button variant="outline" size="sm" className="border-[#353945] text-[#FCFCFD]">Edit</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Decks;
