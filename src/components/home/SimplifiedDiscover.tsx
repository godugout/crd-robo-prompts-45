import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CRDButton, Typography } from "@/components/ui/design-system";
import { useCards } from "@/hooks/useCards";
import { Skeleton } from "@/components/ui/skeleton";
import { useGalleryActions } from "@/pages/Gallery/hooks/useGalleryActions";
import { useCardConversion } from "@/pages/Gallery/hooks/useCardConversion";
import { ImmersiveCardViewer } from "@/components/viewer/ImmersiveCardViewer";
import { convertToUniversalCardData } from "@/components/viewer/types";

const FALLBACK_CARDS = [
  {
    id: 'fallback-1',
    title: "Mystic Dragon",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
    creator: "ArtistOne"
  },
  {
    id: 'fallback-2',
    title: "Cyber Warrior",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80",
    creator: "DigitalMaster"
  },
  {
    id: 'fallback-3',
    title: "Forest Guardian",
    image: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=400&q=80",
    creator: "NatureLover"
  },
  {
    id: 'fallback-4',
    title: "Space Explorer",
    image: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=400&q=80",
    creator: "CosmicArt"
  },
  {
    id: 'fallback-5',
    title: "Ancient Rune",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&q=80",
    creator: "RuneCaster"
  },
  {
    id: 'fallback-6',
    title: "Fire Phoenix",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80",
    creator: "FlameForge"
  }
];

export const SimplifiedDiscover: React.FC = () => {
  const { cards, loading } = useCards();
  const { selectedCardIndex, showImmersiveViewer, handleCardClick, handleCardChange, handleCloseViewer, handleShareCard, handleDownloadCard } = useGalleryActions();
  const { convertCardsToCardData } = useCardConversion();
  
  // Use real cards if available, otherwise use fallback
  const displayCards = cards && cards.length > 0 
    ? cards.slice(0, 6).map(card => ({
        id: card.id,
        title: card.title,
        image: card.image_url || card.thumbnail_url,
        creator: "Creator" // We'd get this from profiles later
      }))
    : FALLBACK_CARDS.slice(0, 6);

  // Convert cards to CardData format for the viewer
  const convertedCards = convertCardsToCardData(
    cards && cards.length > 0 ? cards.slice(0, 6) : []
  );

  const handleCardView = (card: any, index: number) => {
    if (cards && cards.length > 0) {
      handleCardClick(cards[index], cards.slice(0, 6));
    }
  };

  return (
    <>
      <div className="bg-[#141416] flex flex-col overflow-hidden pt-32 pb-16 px-4 md:px-8 lg:px-[352px] max-md:max-w-full">
        <div className="text-center mb-12">
          <Typography as="h2" variant="h1" className="mb-4">
            Discover Amazing Cards
          </Typography>
          <Typography variant="body" className="text-crd-lightGray text-lg max-w-2xl mx-auto">
            Explore stunning card art created by our community of talented artists and creators
          </Typography>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {loading ? (
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="w-full">
                <Skeleton className="w-full aspect-[3/4] rounded-xl bg-[#353945]" />
                <div className="mt-3 space-y-2">
                  <Skeleton className="w-3/4 h-5 bg-[#353945]" />
                  <Skeleton className="w-1/2 h-4 bg-[#353945]" />
                </div>
              </div>
            ))
          ) : (
            displayCards.map((card, index) => (
              <div
                key={card.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => handleCardView(card, index)}
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl overflow-hidden relative">
                  <img
                    src={card.image || FALLBACK_CARDS[index % FALLBACK_CARDS.length].image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CRDButton size="sm" className="w-full">
                      View in 3D
                    </CRDButton>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-crd-white font-semibold text-lg">{card.title}</h3>
                  <p className="text-crd-lightGray text-sm">by {card.creator}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center">
          <Link to="/editor">
            <CRDButton 
              variant="secondary" 
              size="lg"
              className="px-8 py-4 rounded-[90px] mr-4"
            >
              Browse All Cards
            </CRDButton>
          </Link>
          <Link to="/editor">
            <CRDButton 
              variant="primary" 
              size="lg"
              className="px-8 py-4 rounded-[90px]"
            >
              Start Creating
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
