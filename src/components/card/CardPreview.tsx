
import React, { useState } from "react";
import { CardActionButton } from "./buttons/CardActionButton";
import { ImageCropperModal } from "../editor/modals/ImageCropperModal";
import { Card3DPreviewModal } from "../editor/modals/Card3DPreviewModal";
import { toast } from "sonner";
import { calculateAutoFit, detectBestFitMode } from "@/utils/imageAutoFit";

// 2.5in x 3.5in = 216 x 302px at 96dpi (browser default 1in = 96px)
const CARD_WIDTH = 240; // slightly larger to work well visually on screen
const CARD_HEIGHT = 336;

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
    setCurrentImageUrl(croppedImageUrl);
    onImageUpdate?.(croppedImageUrl);
    toast.success("Image cropped successfully!");
  };

  const handleAutoFit = () => {
    const imageToFit = currentImageUrl || displayImageUrl;
    
    if (!imageToFit) {
      toast.error("No image to auto-fit");
      return;
    }

    // Create a temporary image to get dimensions
    const img = new Image();
    img.onload = () => {
      const fitOptions = {
        containerWidth: CARD_WIDTH,
        containerHeight: CARD_HEIGHT,
        imageWidth: img.naturalWidth,
        imageHeight: img.naturalHeight,
        fitMode: detectBestFitMode({
          containerWidth: CARD_WIDTH,
          containerHeight: CARD_HEIGHT,
          imageWidth: img.naturalWidth,
          imageHeight: img.naturalHeight
        })
      };

      const fitResult = calculateAutoFit(fitOptions);
      
      // Apply the auto-fit positioning
      toast.success(`Auto-fit applied: ${fitOptions.fitMode} mode`);
      
      // Dispatch event for auto-fit
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
    const imageToEdit = currentImageUrl || displayImageUrl;
    
    if (!imageToEdit) {
      toast.error("No image to crop");
      return;
    }
    
    console.log("Opening crop modal with image:", imageToEdit);
    setShowCropModal(true);
  };

  const handle3DClick = () => {
    console.log("Opening 3D modal");
    setShow3DModal(true);
  };

  const displayImageUrl = currentImageUrl || imageUrl || "https://cdn.builder.io/api/v1/image/assets/TEMP/2e3fccaef4a8c8a85ab1b25e96634ffea6707d7f";

  return (
    <>
      <div className="relative bg-[#353945] rounded-2xl" style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
        <div className="absolute top-6 left-6 flex gap-2">
          <span className="px-2 py-2 text-xs font-raleway font-semibold uppercase bg-white text-[#23262F] rounded">
            Art
          </span>
          <span className="px-2 py-2 text-xs font-raleway font-semibold uppercase bg-[#9757D7] text-white rounded">
            Unlockable
          </span>
        </div>
        <img
          src={displayImageUrl}
          alt="Card Art"
          className="absolute w-full h-full object-cover"
          style={{ borderRadius: "1rem" }}
        />
        <div className="absolute bottom-8 left-[40px] flex gap-6">
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
                  d="m1 6.13 16-.13a2 2 0 0 1 2 2V23"
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
