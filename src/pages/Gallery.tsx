import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAllCollections } from '@/hooks/useCollections';
import { useCards } from '@/hooks/useCards';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreators } from '@/hooks/useCreators';
import { Filter } from 'lucide-react';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';

const GallerySection = ({ 
  title, 
  children 
}: { 
  title: string, 
  children: React.ReactNode 
}) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold mb-6 text-[#FCFCFD]">{title}</h2>
    {children}
  </div>
);

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [showImmersiveViewer, setShowImmersiveViewer] = useState(false);
  
  const { collections, loading: collectionsLoading } = useAllCollections(1, 3);
  const { featuredCards, loading: cardsLoading } = useCards();
  const { popularCreators, loading: creatorsLoading } = useCreators();

  // Convert cards to CardData format for the viewer
  const convertedCards: CardData[] = featuredCards.map(card => ({
    ...card,
    visibility: card.visibility || 'public',
    creator_attribution: card.creator_attribution || '',
    publishing_options: card.publishing_options || {},
    tags: card.tags || []
  }));

  const handleCardClick = (card: any) => {
    const cardIndex = featuredCards.findIndex(c => c.id === card.id);
    setSelectedCardIndex(cardIndex >= 0 ? cardIndex : 0);
    setShowImmersiveViewer(true);
  };

  const handleCardChange = (newIndex: number) => {
    setSelectedCardIndex(newIndex);
  };

  const handleCloseViewer = () => {
    setShowImmersiveViewer(false);
  };

  const handleShareCard = () => {
    const selectedCard = convertedCards[selectedCardIndex];
    if (selectedCard) {
      const shareUrl = `${window.location.origin}/card/${selectedCard.id}`;
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl)
          .then(() => toast.success('Card link copied to clipboard'))
          .catch(() => toast.error('Failed to copy link'));
      } else {
        toast.error('Sharing not supported in this browser');
      }
    }
  };

  const handleDownloadCard = () => {
    const selectedCard = convertedCards[selectedCardIndex];
    if (selectedCard) {
      const dataStr = JSON.stringify(selectedCard, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedCard.title.replace(/\s+/g, '_')}_card.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success('Card exported successfully');
    }
  };

  const currentCard = convertedCards[selectedCardIndex];

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-[#121212]">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-8">Discover <span className="text-[#EA6E48]">Cards & Collectibles</span></h1>
        
        <div className="flex justify-between items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center w-full">
              <TabsList className="bg-[#1A1A1A] p-1 rounded-md">
                <TabsTrigger 
                  value="featured" 
                  className={`px-4 py-2 ${activeTab === 'featured' ? 'bg-[#3772FF] text-white' : 'text-[#777E90]'}`}
                >
                  Featured
                </TabsTrigger>
                <TabsTrigger 
                  value="trending" 
                  className={`px-4 py-2 ${activeTab === 'trending' ? 'bg-[#3772FF] text-white' : 'text-[#777E90]'}`}
                >
                  Trending
                </TabsTrigger>
                <TabsTrigger 
                  value="new" 
                  className={`px-4 py-2 ${activeTab === 'new' ? 'bg-[#3772FF] text-white' : 'text-[#777E90]'}`}
                >
                  New
                </TabsTrigger>
              </TabsList>
              
              <Button className="bg-[#3772FF] text-white rounded-md flex items-center gap-2">
                <Filter size={16} />
                Filter
                <span className="ml-1 bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs">×</span>
              </Button>
            </div>
          
            <TabsContent value="featured" className="mt-8">
              <GallerySection title="Featured Collections">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {collectionsLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-48 rounded-lg" />
                    ))
                  ) : collections && collections.length > 0 ? (
                    collections.map((collection, index) => (
                      <Card key={index} className="bg-[#23262F] border-[#353945] overflow-hidden">
                        <div 
                          className="h-32 bg-cover bg-center"
                          style={{ 
                            backgroundImage: collection.coverImageUrl 
                              ? `url(${collection.coverImageUrl})` 
                              : 'url(https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80)'
                          }}
                        ></div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-[#FCFCFD]">{collection.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-[#777E90] text-sm">{collection.description || 'A beautiful collection of cards'}</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full border-[#353945] text-white hover:bg-[#353945]">View Collection</Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <p className="text-[#777E90] col-span-3 text-center py-8">No collections found</p>
                  )}
                </div>
              </GallerySection>

              <GallerySection title="Featured Artists">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {creatorsLoading ? (
                    Array(4).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-48 rounded-lg" />
                    ))
                  ) : popularCreators && popularCreators.length > 0 ? (
                    popularCreators.map((creator, index) => (
                      <Card key={index} className="bg-[#23262F] border-[#353945]">
                        <CardHeader className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-[#353945] mb-2">
                            {creator.avatarUrl && (
                              <img 
                                src={creator.avatarUrl} 
                                alt={creator.name} 
                                className="w-full h-full rounded-full object-cover" 
                              />
                            )}
                          </div>
                          <CardTitle className="text-center text-[#FCFCFD]">{creator.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-2">
                          <p className="text-[#777E90] text-sm">{creator.bio || 'Artist'}</p>
                        </CardContent>
                        <CardFooter className="justify-center">
                          <Button variant="outline" size="sm" className="border-[#353945] text-white hover:bg-[#353945]">Follow</Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <p className="text-[#777E90] col-span-4 text-center py-8">No featured artists found</p>
                  )}
                </div>
              </GallerySection>

              <GallerySection title="Featured Cards">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {cardsLoading ? (
                    Array(4).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-64 rounded-lg" />
                    ))
                  ) : featuredCards && featuredCards.length > 0 ? (
                    featuredCards.slice(0, 8).map((card, index) => (
                      <Card 
                        key={card.id} 
                        className="bg-[#23262F] border-[#353945] overflow-hidden cursor-pointer hover:border-[#3772FF] transition-colors group"
                        onClick={() => handleCardClick(card)}
                      >
                        <div 
                          className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform"
                          style={{ 
                            backgroundImage: card.image_url 
                              ? `url(${card.image_url})` 
                              : 'url(https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80)'
                          }}
                        ></div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-[#FCFCFD] text-lg group-hover:text-[#3772FF] transition-colors">{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-[#777E90] text-sm line-clamp-2">{card.description}</p>
                          {card.rarity && (
                            <div className="mt-2">
                              <span className="inline-block bg-[#3772FF] text-white text-xs px-2 py-1 rounded">
                                {card.rarity}
                              </span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            className="w-full border-[#353945] text-white hover:bg-[#3772FF] hover:border-[#3772FF] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCardClick(card);
                            }}
                          >
                            View in 3D
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <p className="text-[#777E90] col-span-4 text-center py-8">No featured cards found</p>
                  )}
                </div>
              </GallerySection>
            </TabsContent>
            
            <TabsContent value="trending">
              <div className="py-16">
                <p className="text-[#777E90] text-center">Trending content coming soon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="new">
              <div className="py-16">
                <p className="text-[#777E90] text-center">New content coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Enhanced Immersive Card Viewer with Navigation */}
      {showImmersiveViewer && currentCard && convertedCards.length > 0 && (
        <ImmersiveCardViewer
          card={currentCard}
          cards={convertedCards}
          currentCardIndex={selectedCardIndex}
          onCardChange={handleCardChange}
          isOpen={showImmersiveViewer}
          onClose={handleCloseViewer}
          onShare={handleShareCard}
          onDownload={handleDownloadCard}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      )}
    </div>
  );
};

export default Gallery;
