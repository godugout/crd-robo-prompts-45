
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAllCollections } from '@/hooks/useCollections';
import { useCards } from '@/hooks/useCards';
import { useCreators } from '@/hooks/useCreators';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { GallerySection } from './Gallery/components/GallerySection';
import { GalleryHeader } from './Gallery/components/GalleryHeader';
import { CollectionsGrid } from './Gallery/components/CollectionsGrid';
import { CreatorsGrid } from './Gallery/components/CreatorsGrid';
import { CardsGrid } from './Gallery/components/CardsGrid';
import { useCardConversion } from './Gallery/hooks/useCardConversion';
import { useGalleryActions } from './Gallery/hooks/useGalleryActions';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('featured');
  
  const { collections, loading: collectionsLoading } = useAllCollections(1, 3);
  const { featuredCards, loading: cardsLoading } = useCards();
  const { popularCreators, loading: creatorsLoading } = useCreators();
  
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

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-[#121212]">
      <GalleryHeader activeTab={activeTab} onTabChange={setActiveTab} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="featured" className="mt-8">
          <GallerySection title="Featured Collections">
            <CollectionsGrid collections={collections || []} loading={collectionsLoading} />
          </GallerySection>

          <GallerySection title="Featured Artists">
            <CreatorsGrid creators={popularCreators || []} loading={creatorsLoading} />
          </GallerySection>

          <GallerySection title="Featured Cards">
            <CardsGrid 
              cards={featuredCards || []} 
              loading={cardsLoading}
              onCardClick={(card) => handleCardClick(card, featuredCards)}
            />
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

      {/* Enhanced Immersive Card Viewer with Navigation */}
      {showImmersiveViewer && currentCard && convertedCards.length > 0 && (
        <ImmersiveCardViewer
          card={currentCard}
          cards={convertedCards}
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
  );
};

export default Gallery;
