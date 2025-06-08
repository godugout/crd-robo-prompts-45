
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImmersiveCardViewer } from "@/components/viewer/ImmersiveCardViewer";
import { useCardActions } from "@/hooks/useCardActions";
import { useCardData } from "@/hooks/useCardData";
import { convertToViewerCardData } from "@/components/viewer/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader } from "lucide-react";
import { toast } from "sonner";

export default function CardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleShare, handleRemix, handleStage } = useCardActions();
  const { card, loading, error } = useCardData(id);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDownload = async () => {
    if (card) {
      toast.success(`Downloading "${card.title}"`);
      // Download logic would go here
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

  // Convert CardData to UniversalCardData format for actions
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
    stock: 3, // Default value
    tags: card.tags
  };

  // Convert to viewer CardData format
  const viewerCard = convertToViewerCardData(universalCard);

  console.log('CardDetail: Converted viewer card data:', {
    id: viewerCard.id,
    title: viewerCard.title,
    image_url: viewerCard.image_url,
    hasImage: !!viewerCard.image_url
  });

  return (
    <>
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="bg-black bg-opacity-80 hover:bg-opacity-90 backdrop-blur text-white border border-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Immersive 3D Card Viewer */}
      <ImmersiveCardViewer
        card={universalCard}
        isOpen={true}
        onClose={handleGoBack}
        onShare={() => handleShare(universalCard)}
        onDownload={handleDownload}
        allowRotation={true}
        showStats={true}
        ambient={true}
      />
    </>
  );
}
