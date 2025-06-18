
import React, { useState } from "react";
import { CardActionButton } from "./buttons/CardActionButton";
import { ImageCropperModal } from "../editor/modals/ImageCropperModal";
import { Card3DPreviewModal } from "../editor/modals/Card3DPreviewModal";
import { toast } from "sonner";
import { calculateAutoFit, detectBestFitMode } from "@/utils/imageAutoFit";

// Enhanced card dimensions with proper padding
const CARD_WIDTH = 260; // Increased from 240 for better padding
const CARD_HEIGHT = 364; // Increased from 336 for better padding
const CARD_PADDING = 12; // Padding around the card content

interface CardPreviewProps {
  cardData?: any;
  imageUrl?: string;
  onImageUpdate?: (newImageUrl: string) => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  cardData,
  imageUrl,
  onImageUpdate
}) => {
  const [showCropModal, setShowCropModal] = useState(false);
  const [show3DModal, setShow3DModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);

  const handleCropComplete = (croppedImageUrl: string) => {
    console.log("Crop completed:", croppedImageUrl);
    setCurrentImageUrl(croppedImageUrl);
    onImageUpdate?.(croppedImageUrl);
    toast.success("Image cropped successfully!");
  };

  const handleAutoFit = () => {
    console.log("Auto-fit clicked");
    const imageToFit = currentImageUrl || displayImageUrl;
    
    if (!imageToFit) {
      toast.error("No image to auto-fit");
      return;
    }

    const img = new Image();
    img.onload = () => {
      const fitOptions = {
        containerWidth: CARD_WIDTH - (CARD_PADDING * 2),
        containerHeight: CARD_HEIGHT - (CARD_PADDING * 2),
        imageWidth: img.naturalWidth,
        imageHeight: img.naturalHeight,
        fitMode: detectBestFitMode({
          containerWidth: CARD_WIDTH - (CARD_PADDING * 2),
          containerHeight: CARD_HEIGHT - (CARD_PADDING * 2),
          imageWidth: img.naturalWidth,
          imageHeight: img.naturalHeight
        })
      };

      const fitResult = calculateAutoFit(fitOptions);
      
      toast.success(`Auto-fit applied: ${fitOptions.fitMode} mode`);
      
      window.dispatchEvent(new CustomEvent('autoFitApplied', { 
        detail: { fitResult, fitOptions } 
      }));
    };
    
    img.onerror = () => {
      toast.error("Failed to load image for auto-fit");
    };
    
    img.src = imageToFit;
  };

  const handleCropClick = () => {
    console.log("Crop button clicked");
    const imageToEdit = currentImageUrl || displayImageUrl;
    
    if (!imageToEdit) {
      toast.error("No image to crop");
      return;
    }
    
    console.log("Opening crop modal with image:", imageToEdit);
    setShowCropModal(true);
  };

  const handle3DClick = () => {
    console.log("3D button clicked");
    setShow3DModal(true);
  };

  const displayImageUrl = currentImageUrl || imageUrl || "https://cdn.builder.io/api/v1/image/assets/TEMP/2e3fccaef4a8c8a85ab1b25e96634ffea6707d7f";

  return (
    <>
      <div 
        className="relative bg-gradient-to-br from-[#353945] to-[#2a2d35] rounded-2xl shadow-xl border border-gray-600/30" 
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      >
        {/* Enhanced graded case effect with proper padding */}
        <div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent"
          style={{ padding: CARD_PADDING }}
        >
          {/* Inner card area */}
          <div className="w-full h-full rounded-xl overflow-hidden relative bg-black/20">
            {/* Top badges */}
            <div className="absolute top-6 left-6 flex gap-2 z-10">
              <span className="px-2 py-2 text-xs font-raleway font-semibold uppercase bg-white text-[#23262F] rounded">
                Art
              </span>
              <span className="px-2 py-2 text-xs font-raleway font-semibold uppercase bg-[#9757D7] text-white rounded">
                Unlockable
              </span>
            </div>
            
            {/* Card image with proper padding */}
            <img
              src={displayImageUrl}
              alt="Card Art"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-xl"
            />
            
            {/* Action buttons container - positioned with proper spacing */}
            <div className="absolute bottom-8 left-8 flex gap-6 z-20">
              <CardActionButton
                onClick={handle3DClick}
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"
                      fill="#777E91"
                    />
                  </svg>
                }
              />
              <CardActionButton
                onClick={handleCropClick}
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6.13 1L6 16a2 2 0 0 0 2 2h15"
                      stroke="#777E91"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m1 6.13 16-.13a2 2 0 0 1 2 V23"
                      stroke="#777E91"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
              <CardActionButton
                onClick={handleAutoFit}
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#777E91" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="12" r="3" fill="#777E91"/>
                    <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1" stroke="#777E91" strokeWidth="2"/>
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCropModal && (
        <ImageCropperModal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          imageUrl={currentImageUrl || displayImageUrl}
          onCropComplete={handleCropComplete}
        />
      )}

      {show3DModal && (
        <Card3DPreviewModal
          isOpen={show3DModal}
          onClose={() => setShow3DModal(false)}
          cardData={cardData || {
            title: "Sample Card",
            description: "Preview Card",
            rarity: "common"
          }}
          imageUrl={currentImageUrl || displayImageUrl}
        />
      )}
    </>
  );
};
