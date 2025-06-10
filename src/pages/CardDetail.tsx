import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImmersiveCardViewer } from "@/components/viewer/ImmersiveCardViewer";
import { EnhancedCardDetailView } from "@/components/cards/EnhancedCardDetailView";
import { useCardActions } from "@/hooks/useCardActions";
import { useCardData } from "@/hooks/useCardData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader, Info } from "lucide-react";
import { toast } from "sonner";

export default function CardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleShare, handleRemix, handleStage } = useCardActions();
  const { card, loading, error } = useCardData(id);
  // Default to immersive viewer mode
  const [showViewer, setShowViewer] = useState(true);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleToggleView = () => {
    setShowViewer(!showViewer);
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
  };

  const handleDownload = async () => {
    if (card) {
      toast.success(`Downloading "${card.title}"`);
      // Download logic would go here
    }
  };

  const handleShareCard = async () => {
    if (card) {
      const universalCard = {
        id: card.id,
        title: card.title,
        description: card.description,
        image_url: card.image_url,
        thumbnail_url: card.thumbnail_url,
        rarity: card.rarity,
        price: card.price,
        creator_name: card.creator_name,
        creator_verified: card.creator_verified,
        creator_id: card.creator_id,
        stock: 3,
        tags: card.tags
      };
      await handleShare(universalCard);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-crd-blue" />
          <p className="text-crd-lightGray">Loading card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Card Not Found</h1>
          <p className="text-crd-lightGray mb-6">{error || "The card you're looking for doesn't exist."}</p>
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  console.log('CardDetail: Card data received:', {
    id: card.id,
    title: card.title,
    image_url: card.image_url,
    hasImage: !!card.image_url
  });

  // Convert CardData to UniversalCardData format
  const universalCard = {
    id: card.id,
    title: card.title,
    description: card.description,
    image_url: card.image_url,
    thumbnail_url: card.thumbnail_url,
    rarity: card.rarity,
    price: card.price,
    creator_name: card.creator_name,
    creator_verified: card.creator_verified,
    creator_id: card.creator_id,
    stock: 3,
    tags: card.tags
  };

  // Show immersive viewer by default
  if (showViewer) {
    return (
      <>
        {/* Navigation Controls - Fixed z-index and pointer events */}
        <div className="fixed top-4 left-4 z-[60] flex gap-2 pointer-events-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="bg-black/80 hover:bg-black/90 backdrop-blur-sm text-white border border-white/20 pointer-events-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleView}
            className="bg-black/80 hover:bg-black/90 backdrop-blur-sm text-white border border-white/20 pointer-events-auto"
          >
            <Info className="w-4 h-4 mr-2" />
            Details
          </Button>
        </div>

        {/* Immersive 3D Card Viewer */}
        <ImmersiveCardViewer
          card={universalCard}
          isOpen={true}
          onClose={handleCloseViewer}
          onShare={handleShareCard}
          onDownload={handleDownload}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      </>
    );
  }

  // Show enhanced card detail view
  return (
    <EnhancedCardDetailView
      card={card}
      onOpenViewer={() => setShowViewer(true)}
      onShare={handleShareCard}
      onDownload={handleDownload}
      onGoBack={handleGoBack}
    />
  );
}
