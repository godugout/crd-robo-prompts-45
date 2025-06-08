
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shuffle, Eye, Copy, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/hooks/useCards';
import { UniversalCardDisplay } from '@/components/cards/UniversalCardDisplay';
import { toast } from 'sonner';
import type { CardRarity } from '@/components/cards/UniversalCardDisplay';

export const RemixFlow = () => {
  const navigate = useNavigate();
  const { featuredCards, loading } = useCards();
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'random' | 'gallery'>('random');
  const [randomCard, setRandomCard] = useState<any>(null);

  useEffect(() => {
    if (featuredCards && featuredCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * featuredCards.length);
      setRandomCard(featuredCards[randomIndex]);
    }
  }, [featuredCards]);

  const getRandomCard = () => {
    if (featuredCards && featuredCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * featuredCards.length);
      setRandomCard(featuredCards[randomIndex]);
    }
  };

  const handleRemixCard = (card: any) => {
    toast.success(`Starting remix of "${card.title}"`);
    // Navigate to editor with card data
    navigate('/cards/create?mode=design-scratch', { 
      state: { remixCard: card } 
    });
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/cards')}
            className="text-crd-lightGray hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Remix Existing Card</h1>
            <p className="text-crd-lightGray">Start with an existing design and make it your own</p>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={viewMode === 'random' ? 'default' : 'outline'}
            onClick={() => setViewMode('random')}
            className={viewMode === 'random' 
              ? 'bg-crd-green text-black hover:bg-crd-green/90' 
              : 'border-editor-border text-crd-lightGray hover:text-white'
            }
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Random Selection
          </Button>
          <Button
            variant={viewMode === 'gallery' ? 'default' : 'outline'}
            onClick={() => setViewMode('gallery')}
            className={viewMode === 'gallery' 
              ? 'bg-crd-green text-black hover:bg-crd-green/90' 
              : 'border-editor-border text-crd-lightGray hover:text-white'
            }
          >
            <Search className="w-4 h-4 mr-2" />
            Browse Gallery
          </Button>
        </div>

        {viewMode === 'random' ? (
          /* Random Card Selection */
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <Card className="bg-editor-dark border-editor-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Random Card</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={getRandomCard}
                      className="border-editor-border text-crd-lightGray hover:text-white"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      New Random
                    </Button>
                  </div>

                  {loading ? (
                    <div className="aspect-[3/4] bg-editor-border rounded-lg flex items-center justify-center">
                      <p className="text-crd-lightGray">Loading cards...</p>
                    </div>
                  ) : randomCard ? (
                    <div className="space-y-4">
                      <UniversalCardDisplay
                        card={{
                          id: randomCard.id,
                          title: randomCard.title,
                          description: randomCard.description,
                          image_url: randomCard.image_url,
                          thumbnail_url: randomCard.thumbnail_url,
                          rarity: (randomCard.rarity || 'common') as CardRarity,
                          price: randomCard.price,
                          creator_name: randomCard.creator_name,
                          creator_verified: randomCard.creator_verified,
                          tags: randomCard.tags,
                          stock: 1
                        }}
                        mode="grid"
                        showActions={false}
                      />
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-crd-green text-black">
                            {randomCard.rarity || 'common'}
                          </Badge>
                          {randomCard.creator_verified && (
                            <Badge variant="outline" className="border-crd-green text-crd-green">
                              Verified Creator
                            </Badge>
                          )}
                        </div>
                        
                        {randomCard.tags && randomCard.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {randomCard.tags.slice(0, 3).map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[3/4] bg-editor-border rounded-lg flex items-center justify-center">
                      <p className="text-crd-lightGray">No cards available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-editor-dark border-editor-border">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">What is Remixing?</h3>
                  <ul className="space-y-3 text-crd-lightGray">
                    <li className="flex items-start gap-3">
                      <Copy className="w-4 h-4 mt-0.5 text-crd-green" />
                      <span>Start with the selected card's design and layout</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Eye className="w-4 h-4 mt-0.5 text-crd-green" />
                      <span>Modify colors, text, and add your own elements</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shuffle className="w-4 h-4 mt-0.5 text-crd-green" />
                      <span>Original creator gets attribution credit</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {randomCard && (
                <div className="space-y-4">
                  <Button
                    onClick={() => handleRemixCard(randomCard)}
                    className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Remix This Card
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/card/${randomCard.id}`)}
                    className="w-full border-editor-border text-crd-lightGray hover:text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Original
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Gallery Browse Mode */
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index} className="bg-editor-dark border-editor-border">
                    <CardContent className="p-4">
                      <div className="aspect-[3/4] bg-editor-border rounded-lg animate-pulse" />
                    </CardContent>
                  </Card>
                ))
              ) : featuredCards && featuredCards.length > 0 ? (
                featuredCards.map((card) => (
                  <Card
                    key={card.id}
                    className="bg-editor-dark border-editor-border hover:border-crd-green/50 transition-all cursor-pointer group"
                  >
                    <CardContent className="p-4">
                      <UniversalCardDisplay
                        card={{
                          id: card.id,
                          title: card.title,
                          description: card.description,
                          image_url: card.image_url,
                          thumbnail_url: card.thumbnail_url,
                          rarity: (card.rarity || 'common') as CardRarity,
                          price: card.price,
                          creator_name: card.creator_name,
                          creator_verified: card.creator_verified,
                          tags: card.tags,
                          stock: 1
                        }}
                        mode="grid"
                        showActions={false}
                      />
                      
                      <div className="mt-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          onClick={() => handleRemixCard(card)}
                          className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
                        >
                          <Copy className="w-3 h-3 mr-2" />
                          Remix
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-crd-lightGray">No cards available for remixing</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
