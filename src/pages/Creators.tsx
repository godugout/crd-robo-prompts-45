
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAllCollections } from '@/hooks/useCollections';
import { Loader, Image, Grid, Plus, Users, Palette } from 'lucide-react';

export default function Creators() {
  const [activeTab, setActiveTab] = useState<'frames' | 'collections'>('frames');
  const { collections, loading: collectionsLoading } = useAllCollections();
  
  const framesCommons = [
    {
      name: 'Classic Baseball (Community)',
      preview: '/placeholder.svg',
      creator: 'Community',
      price: 0,
      locked: false,
      description: "A vintage-style open frame perfect for all-star throwbacks and custom teams. Free to remix.",
    },
    {
      name: 'Pixel Art (Open)',
      preview: '/placeholder.svg',
      creator: 'PixArt Joe',
      price: 0,
      locked: false,
      description: "Minimal pixel frame, remix-friendly and open for all designers.",
    },
  ];

  const framesLocked = [
    {
      name: 'Gold Signature (Official)',
      preview: '/placeholder.svg',
      creator: 'RookieCollectibles',
      price: 20,
      locked: true,
      description: "Official CRD Creator frame, gold foil, perfect for ultra-rares. Unlock with $20 or 50 CC.",
    },
    {
      name: 'Team Authentics (Monetized)',
      preview: '/placeholder.svg',
      creator: 'OGCardBase',
      price: 5,
      locked: true,
      description: "Licensed team-style frame supporting creator—purchase with 5 CC.",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Creators Hub</h1>
        <Button>Become a Creator</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>CRD Creator Community</CardTitle>
          <CardDescription>
            Discover artists and collectors who create and curate cards, frames, and collections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg space-y-4">
              <Palette className="h-12 w-12 text-indigo-500" />
              <h3 className="text-xl font-bold">Frame Designers</h3>
              <p>Create custom frames for the community or monetize your premium designs</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg space-y-4">
              <Users className="h-12 w-12 text-emerald-500" />
              <h3 className="text-xl font-bold">Collectors & Curators</h3>
              <p>Build collections and curate galleries featuring your favorite cards and artists</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="frames" value={activeTab} onValueChange={(value) => setActiveTab(value as 'frames' | 'collections')}>
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="frames" className="flex-1">
            <Palette className="mr-2 h-4 w-4" />
            Frames
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex-1">
            <Grid className="mr-2 h-4 w-4" />
            Collections
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="frames" className="space-y-8">
          <section>
            <h2 className="text-2xl font-raleway font-extrabold mb-4">Commons: Open Community Frames</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {framesCommons.map((frame) => (
                <Card key={frame.name}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <img src={frame.preview} alt={frame.name} className="w-12 h-16 object-cover rounded-md bg-cardshow-mediumGray"/>
                      <span className="font-bold text-cardshow-green">{frame.name}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">{frame.description}</p>
                    <span className="text-cardshow-lightGray text-xs">Creator: {frame.creator}</span>
                    <span className="block text-cardshow-green font-bold mt-2">
                      {frame.price === 0 ? "Free" : `${frame.price} CC`}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-raleway font-extrabold mb-4">Locked & Official Frames</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {framesLocked.map((frame) => (
                <Card key={frame.name} className="relative">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <img src={frame.preview} alt={frame.name} className="w-12 h-16 object-cover rounded-md bg-cardshow-mediumGray"/>
                      <span className="font-bold text-cardshow-orange">{frame.name}</span>
                      {frame.locked && (
                        <span className="ml-2 text-yellow-400 font-bold text-sm">🔒 Locked</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">{frame.description}</p>
                    <span className="text-cardshow-lightGray text-xs">Creator: {frame.creator}</span>
                    <span className="block text-cardshow-orange font-bold mt-2">
                      {frame.price > 0 ? `${frame.price} CC` : "Free"}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>Become a CRD Frame Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Want to build and share new Frames? Design with our editor, submit to the commons, or set your own price for premium frames. Unlock more by joining the creator program and get featured or monetize your designs!</p>
            </CardContent>
            <CardFooter>
              <Button>Start Designing</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="collections" className="space-y-8">
          {collectionsLoading ? (
            <div className="flex justify-center py-12">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <section>
                <h2 className="text-2xl font-raleway font-extrabold mb-4">Featured Collections</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {Array(3).fill(null).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="h-40 bg-gray-200"></div>
                      <CardHeader>
                        <CardTitle className="text-lg">Collection {i+1}</CardTitle>
                        <CardDescription>By Creator {i+1}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">A curated collection of unique cards showcasing the best in digital art.</p>
                      </CardContent>
                      <CardFooter>
                        <p className="text-sm text-gray-500">12 cards</p>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-raleway font-extrabold mb-4">Community Collections</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {Array(3).fill(null).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="h-40 bg-gray-200"></div>
                      <CardHeader>
                        <CardTitle className="text-lg">Community Set {i+1}</CardTitle>
                        <CardDescription>Collaborative Collection</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">An open collection where community members can contribute their cards.</p>
                      </CardContent>
                      <CardFooter>
                        <p className="text-sm text-gray-500">24 cards</p>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </section>
              
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Own Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Start curating your own gallery of cards. Create themed collections, collaborate with others, or showcase your personal favorites.</p>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Collection
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
