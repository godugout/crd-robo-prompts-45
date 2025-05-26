
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAllCollections } from '@/hooks/useCollections';
import { Loader, Image, Grid, Plus, Users, Palette, Star, Crown, Gem } from 'lucide-react';

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
      rarity: 'common',
      description: "A vintage-style open frame perfect for all-star throwbacks and custom teams. Free to remix.",
      downloads: 1520,
      rating: 4.8
    },
    {
      name: 'Pixel Art (Open)',
      preview: '/placeholder.svg',
      creator: 'PixArt Joe',
      price: 0,
      locked: false,
      rarity: 'common',
      description: "Minimal pixel frame, remix-friendly and open for all designers.",
      downloads: 890,
      rating: 4.6
    },
  ];

  const framesLocked = [
    {
      name: 'Gold Signature (Official)',
      preview: '/placeholder.svg',
      creator: 'RookieCollectibles',
      price: 20,
      locked: true,
      rarity: 'legendary',
      description: "Official CRD Creator frame, gold foil, perfect for ultra-rares. Unlock with $20 or 50 CC.",
      downloads: 350,
      rating: 4.9
    },
    {
      name: 'Team Authentics (Monetized)',
      preview: '/placeholder.svg',
      creator: 'OGCardBase',
      price: 5,
      locked: true,
      rarity: 'epic',
      description: "Licensed team-style frame supporting creator—purchase with 5 CC.",
      downloads: 670,
      rating: 4.7
    },
  ];

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="h-4 w-4 text-orange-400" />;
      case 'epic': return <Gem className="h-4 w-4 text-purple-400" />;
      default: return <Star className="h-4 w-4 text-blue-400" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-orange-400 shadow-orange-400/20';
      case 'epic': return 'border-purple-400 shadow-purple-400/20';
      default: return 'border-blue-400 shadow-blue-400/20';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--primary-bg)' }}>
      <div className="container mx-auto py-8 px-4 space-y-8 fade-in">
        {/* Hero Section */}
        <div className="text-center py-12 px-8 rounded-2xl" style={{ background: 'var(--secondary-bg)' }}>
          <h1 className="text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Creators Hub
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Discover artists and collectors who create and curate cards, frames, and collections
          </p>
          <button className="crd-button-primary">
            <Plus className="mr-2 h-5 w-5" />
            Become a Creator
          </button>
        </div>
        
        {/* Creator Types Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="text-center p-8 rounded-2xl transition-all duration-300 hover:scale-105" 
               style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                 style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
              <Palette className="h-8 w-8" style={{ color: 'var(--accent-blue)' }} />
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Frame Designers
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Create custom frames for the community or monetize your premium designs
            </p>
          </div>
          
          <div className="text-center p-8 rounded-2xl transition-all duration-300 hover:scale-105" 
               style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                 style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
              <Users className="h-8 w-8" style={{ color: 'var(--accent-green)' }} />
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Collectors & Curators
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Build collections and curate galleries featuring your favorite cards and artists
            </p>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <Tabs defaultValue="frames" value={activeTab} onValueChange={(value) => setActiveTab(value as 'frames' | 'collections')}>
          <TabsList className="w-full justify-start mb-8 p-1 rounded-xl" 
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <TabsTrigger value="frames" className="flex-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500">
              <Palette className="mr-2 h-4 w-4" />
              Frames
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500">
              <Grid className="mr-2 h-4 w-4" />
              Collections
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="frames" className="space-y-12">
            {/* Commons Section */}
            <section>
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Commons: Open Community Frames
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {framesCommons.map((frame) => (
                  <div key={frame.name} 
                       className={`card-item ${frame.rarity} rounded-xl overflow-hidden`}
                       style={{ aspectRatio: 'auto', background: 'var(--card-bg)' }}>
                    <div className="relative h-48 overflow-hidden">
                      <img src={frame.preview} alt={frame.name} 
                           className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                           style={{ background: 'var(--secondary-bg)' }} />
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full"
                           style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
                        {getRarityIcon(frame.rarity)}
                        <span className="text-xs font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                          {frame.rarity}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        {frame.name}
                      </h3>
                      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                        {frame.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          Creator: {frame.creator}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {frame.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold" style={{ color: 'var(--accent-green)' }}>
                          {frame.price === 0 ? "Free" : `${frame.price} CC`}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {frame.downloads} downloads
                        </span>
                      </div>
                      <button className="crd-button-primary w-full mt-4">
                        Use Frame
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Locked Frames Section */}
            <section>
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Locked & Official Frames
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {framesLocked.map((frame) => (
                  <div key={frame.name} 
                       className={`card-item ${frame.rarity} rounded-xl overflow-hidden relative`}
                       style={{ aspectRatio: 'auto', background: 'var(--card-bg)' }}>
                    {frame.locked && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-2">
                            <Crown className="h-8 w-8 text-black" />
                          </div>
                          <span className="text-yellow-400 font-bold">LOCKED</span>
                        </div>
                      </div>
                    )}
                    <div className="relative h-48 overflow-hidden">
                      <img src={frame.preview} alt={frame.name} 
                           className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                           style={{ background: 'var(--secondary-bg)' }} />
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full"
                           style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
                        {getRarityIcon(frame.rarity)}
                        <span className="text-xs font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                          {frame.rarity}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        {frame.name}
                      </h3>
                      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                        {frame.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          Creator: {frame.creator}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {frame.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold" style={{ color: 'var(--accent-orange)' }}>
                          {frame.price > 0 ? `${frame.price} CC` : "Free"}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {frame.downloads} downloads
                        </span>
                      </div>
                      <button className="crd-button-secondary w-full mt-4" disabled={frame.locked}>
                        {frame.locked ? 'Unlock Frame' : 'Use Frame'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <div className="text-center p-8 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Become a CRD Frame Creator
              </h3>
              <p className="mb-6 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Want to build and share new Frames? Design with our editor, submit to the commons, or set your own price for premium frames. Unlock more by joining the creator program and get featured or monetize your designs!
              </p>
              <button className="crd-button-primary">
                Start Designing
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="collections" className="space-y-8">
            {collectionsLoading ? (
              <div className="flex justify-center py-12">
                <div className="loading-shimmer w-8 h-8 rounded-full"></div>
              </div>
            ) : (
              <>
                <section>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                    Featured Collections
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {Array(3).fill(null).map((_, i) => (
                      <div key={i} className="card-item rounded-xl overflow-hidden" 
                           style={{ aspectRatio: 'auto', background: 'var(--card-bg)' }}>
                        <div className="h-40" style={{ background: 'var(--secondary-bg)' }}></div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                            Collection {i+1}
                          </h3>
                          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                            By Creator {i+1}
                          </p>
                          <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
                            A curated collection of unique cards showcasing the best in digital art.
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            12 cards
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                
                <section>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                    Community Collections
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {Array(3).fill(null).map((_, i) => (
                      <div key={i} className="card-item rounded-xl overflow-hidden" 
                           style={{ aspectRatio: 'auto', background: 'var(--card-bg)' }}>
                        <div className="h-40" style={{ background: 'var(--secondary-bg)' }}></div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                            Community Set {i+1}
                          </h3>
                          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                            Collaborative Collection
                          </p>
                          <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
                            An open collection where community members can contribute their cards.
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            24 cards
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                
                <div className="text-center p-8 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Create Your Own Collection
                  </h3>
                  <p className="mb-6 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    Start curating your own gallery of cards. Create themed collections, collaborate with others, or showcase your personal favorites.
                  </p>
                  <button className="crd-button-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Collection
                  </button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
