
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAllCollections } from '@/hooks/useCollections';
import { useCards } from '@/hooks/useCards';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { MobileControlProvider } from '@/components/viewer/context/MobileControlContext';
import { GallerySection } from './Gallery/components/GallerySection';
import { GalleryHeader } from './Gallery/components/GalleryHeader';
import { CollectionsGrid } from './Gallery/components/CollectionsGrid';
import { CardsGrid } from './Gallery/components/CardsGrid';
import { useCardConversion } from './Gallery/hooks/useCardConversion';
import { useGalleryActions } from './Gallery/hooks/useGalleryActions';
import { convertToUniversalCardData } from '@/components/viewer/types';
import { EmptyState } from '@/components/shared/EmptyState';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Gallery = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('featured');
  
  const { collections, loading: collectionsLoading } = useAllCollections(1, 6);
  const { featuredCards, loading: cardsLoading } = useCards();
  
  const { convertCardsToCardData } = useCardConversion();
  const {
    selectedCardIndex,
    showImmersiveViewer,
    handleCardClick,
    handleCardChange,
    handleCloseViewer,
    handleShareCard,
    handleDownloadCard
  } = useGalleryActions();

  // Convert cards to CardData format for the viewer
  const convertedCards = convertCardsToCardData(featuredCards);
  const currentCard = convertedCards[selectedCardIndex];

  const handleCreateCollection = () => {
    // TODO: Implement collection creation
    console.log('Create collection clicked');
  };

  const handleCreateCard = () => {
    navigate('/cards/enhanced');
  };

  return (
    <MobileControlProvider>
      <div className="min-h-screen bg-crd-darkest">
        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-12 pb-8 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-crd-white mb-6">
              Discover Amazing{' '}
              <span className="text-crd-green">Cards & Collections</span>
            </h1>
            <p className="text-xl text-crd-lightGray mb-8 max-w-2xl mx-auto">
              Explore thousands of unique cards from talented creators around the world. 
              Find rare collectibles, trending designs, and hidden gems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-crd-green hover:bg-crd-green-secondary text-black font-semibold px-8 py-3 h-auto transition-all duration-200 hover:scale-105"
                onClick={handleCreateCard}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your Card
              </Button>
              <Button 
                variant="outline" 
                className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black px-8 py-3 h-auto transition-all duration-200"
                onClick={handleCreateCollection}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Collection
              </Button>
            </div>
          </div>

          <GalleryHeader activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="featured" className="mt-8">
              {/* Collections Section */}
              <GallerySection title="Featured Collections">
                {collections && collections.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                    <CollectionsGrid collections={collections.slice(0, 5) || []} loading={collectionsLoading} />
                    <div className="flex items-center justify-center">
                      <EmptyState
                        title="Create Collection"
                        description="Start your own collection of cards"
                        icon={<Plus className="h-12 w-12 text-crd-lightGray mb-4" />}
                        action={{
                          label: "Create Collection",
                          onClick: handleCreateCollection,
                          icon: <Plus className="mr-2 h-4 w-4" />
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="No Collections Yet"
                    description="Be the first to create a collection and showcase your cards"
                    action={{
                      label: "Create Collection",
                      onClick: handleCreateCollection,
                      icon: <Plus className="mr-2 h-4 w-4" />
                    }}
                  />
                )}
              </GallerySection>

              {/* Featured Cards Section */}
              <GallerySection title="Featured Cards">
                <CardsGrid 
                  cards={featuredCards || []} 
                  loading={cardsLoading}
                  onCardClick={(card) => handleCardClick(card, featuredCards)}
                />
              </GallerySection>
            </TabsContent>
            
            <TabsContent value="trending" className="mt-8">
              <div className="py-16 text-center">
                <EmptyState
                  title="Trending Content Coming Soon"
                  description="We're preparing an amazing collection of trending cards and collections for you"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="new" className="mt-8">
              <div className="py-16 text-center">
                <EmptyState
                  title="New Content Coming Soon" 
                  description="Stay tuned for the latest and greatest cards from our community"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Enhanced Immersive Card Viewer with Navigation */}
        {showImmersiveViewer && currentCard && convertedCards.length > 0 && (
          <ImmersiveCardViewer
            card={convertToUniversalCardData(currentCard)}
            cards={convertedCards.map(convertToUniversalCardData)}
            currentCardIndex={selectedCardIndex}
            onCardChange={handleCardChange}
            isOpen={showImmersiveViewer}
            onClose={handleCloseViewer}
            onShare={() => handleShareCard(convertedCards)}
            onDownload={() => handleDownloadCard(convertedCards)}
            allowRotation={true}
            showStats={true}
            ambient={true}
          />
        )}
      </div>
    </MobileControlProvider>
  );
};

export default Gallery;
