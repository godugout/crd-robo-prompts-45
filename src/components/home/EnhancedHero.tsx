
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CRDButton, Typography } from "@/components/ui/design-system";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useCards } from "@/hooks/useCards";
import { ImmersiveCardViewer } from "@/components/viewer/ImmersiveCardViewer";
import { useGalleryActions } from "@/pages/Gallery/hooks/useGalleryActions";
import { useCardConversion } from "@/pages/Gallery/hooks/useCardConversion";
import { convertToUniversalCardData } from "@/components/viewer/types";

export const EnhancedHero: React.FC = () => {
  const { containerPadding, isMobile } = useResponsiveLayout();
  const { featuredCards, loading } = useCards();
  const { selectedCardIndex, showImmersiveViewer, handleCardClick, handleCardChange, handleCloseViewer, handleShareCard, handleDownloadCard } = useGalleryActions();
  const { convertCardsToCardData } = useCardConversion();
  
  // Convert cards to CardData format
  const convertedCards = convertCardsToCardData(featuredCards);
  
  // Get top 3 featured cards for showcase
  const showcaseCards = featuredCards.slice(0, 3);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const handleCardPreview = (card: any, index: number) => {
    setActiveCardIndex(index);
    handleCardClick(card, showcaseCards);
  };

  return (
    <>
      <div className={`items-center bg-crd-darkest flex w-full flex-col overflow-hidden text-center pt-32 ${isMobile ? 'px-5' : 'px-[352px]'} max-md:max-w-full max-md:pt-[100px]`}>
        <div className="flex w-full max-w-[900px] flex-col items-center max-md:max-w-full">
          {/* Main Hero Content */}
          <div className="flex w-full flex-col items-center mb-12">
            <Typography 
              variant="caption" 
              className="text-xs font-semibold leading-none uppercase mb-2"
            >
              THE FIRST PRINT & MINT DIGITAL CARD MARKET
            </Typography>
            <Typography 
              as="h1" 
              variant="h1"
              className="text-[40px] font-black leading-[48px] tracking-[-0.4px] mt-2 max-md:max-w-full text-center mb-4"
            >
              Create, collect, and trade
              <br />
              card art with stunning 3D effects
            </Typography>
            <Typography 
              variant="body" 
              className="text-crd-lightGray text-lg mb-8 max-w-2xl"
            >
              Experience cards like never before with immersive 3D viewing, professional lighting, and visual effects that bring your art to life.
            </Typography>
          </div>

          {/* Featured Cards Showcase */}
          {showcaseCards.length > 0 && (
            <div className="w-full mb-12">
              <Typography variant="h3" className="text-white mb-6">
                Featured Creations
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {showcaseCards.map((card, index) => (
                  <div 
                    key={card.id}
                    className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                      activeCardIndex === index ? 'ring-2 ring-crd-green' : ''
                    }`}
                    onClick={() => handleCardPreview(card, index)}
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl overflow-hidden relative">
                      <img
                        src={card.image_url || card.thumbnail_url || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80"}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-white text-sm font-semibold mb-1">{card.title}</div>
                        <CRDButton size="sm" className="w-full">
                          View in 3D
                        </CRDButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Primary CTA */}
          <Link to="/cards/enhanced">
            <CRDButton 
              variant="primary"
              size="lg"
              className="self-stretch gap-3 text-lg font-extrabold px-8 py-4 rounded-[90px] max-md:px-5"
            >
              Create Your First Card
            </CRDButton>
          </Link>
        </div>
      </div>

      {/* Immersive Viewer */}
      {showImmersiveViewer && convertedCards.length > 0 && (
        <ImmersiveCardViewer
          card={convertToUniversalCardData(convertedCards[selectedCardIndex])}
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
    </>
  );
};
