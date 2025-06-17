
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { CardActionButton } from '@/components/card/buttons/CardActionButton';
import { ImageCropperModal } from '@/components/editor/modals/ImageCropperModal';
import { Card3DPreviewModal } from '@/components/editor/modals/Card3DPreviewModal';
import { CompactCardInfo } from './CompactCardInfo';
import { EnhancedDropZone } from '../../upload/EnhancedDropZone';
import { toast } from 'sonner';
import { calculateAutoFit, detectBestFitMode } from '@/utils/imageAutoFit';

interface MinimalistFrame {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'classic' | 'modern' | 'fun';
  borderStyle: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

interface FramePreviewProps {
  frame: MinimalistFrame;
  imageUrl?: string;
  size: 'small' | 'medium' | 'large';
  isDragActive?: boolean;
  onImageUpdate?: (newImageUrl: string) => void;
}

// Standard card dimensions
const CARD_WIDTH = 240;
const CARD_HEIGHT = 336;

export const FramePreview: React.FC<FramePreviewProps> = ({ 
  frame, 
  imageUrl, 
  size, 
  isDragActive,
  onImageUpdate
}) => {
  const [showCropModal, setShowCropModal] = useState(false);
  const [show3DModal, setShow3DModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const [cardMetadata, setCardMetadata] = useState({
    title: "Your Card Title",
    description: "Description",
    rarity: "common"
  });

  const iconSize = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  // Enhanced file upload handler
  const handleFilesAdded = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const newImageUrl = URL.createObjectURL(file);
      setCurrentImageUrl(newImageUrl);
      onImageUpdate?.(newImageUrl);
      toast.success("Image uploaded successfully!");
    }
  };

  // Action button handlers
  const handleCropComplete = (croppedImageUrl: string) => {
    console.log("Crop completed:", croppedImageUrl);
    setCurrentImageUrl(croppedImageUrl);
    onImageUpdate?.(croppedImageUrl);
    toast.success("Image cropped successfully!");
  };

  const handleAutoFit = () => {
    console.log("Auto-fit clicked");
    const imageToFit = currentImageUrl || imageUrl;
    
    if (!imageToFit) {
      toast.error("No image to auto-fit");
      return;
    }

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
    const imageToEdit = currentImageUrl || imageUrl;
    
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

  const handleCardMetadataUpdate = (data: { title: string; description: string; rarity: string }) => {
    setCardMetadata(data);
    toast.success("Card details updated!");
  };

  // Determine border radius based on frame border style
  const getFrameBorderRadius = () => {
    if (frame.borderStyle.includes('border-0') || 
        frame.borderStyle.includes('border-2') || 
        frame.borderStyle.includes('border-4')) {
      return 'rounded-none';
    }
    return 'rounded-lg';
  };

  const displayImageUrl = currentImageUrl || imageUrl;
  const hasImage = Boolean(displayImageUrl);
  
  return (
    <>
      <div 
        className={`relative ${frame.borderStyle} ${frame.backgroundColor} overflow-hidden transition-all duration-300 w-full h-full ${getFrameBorderRadius()} ${
          isDragActive ? 'ring-2 ring-crd-green ring-opacity-50' : ''
        }`}
      >
        {/* Image Area - Takes up 85% of the card space */}
        <div className={`w-full h-[85%] relative overflow-hidden ${getFrameBorderRadius()}`}>
          {displayImageUrl ? (
            <>
              <img 
                src={displayImageUrl} 
                alt="Your card" 
                className="w-full h-full object-cover"
              />
              
              {/* Action buttons overlay - only show for large size (main preview) */}
              {size === 'large' && (
                <div className="absolute bottom-2 left-2 flex gap-2 z-20">
                  <CardActionButton
                    onClick={handle3DClick}
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"
                          fill="#777E91"
                        />
                      </svg>
                    }
                    className="w-8 h-8"
                  />
                  <CardActionButton
                    onClick={handleCropClick}
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
                    className="w-8 h-8"
                  />
                  <CardActionButton
                    onClick={handleAutoFit}
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#777E91" strokeWidth="2" fill="none"/>
                        <circle cx="12" cy="12" r="3" fill="#777E91"/>
                        <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1" stroke="#777E91" strokeWidth="2"/>
                      </svg>
                    }
                    className="w-8 h-8"
                  />
                </div>
              )}
            </>
          ) : (
            <div className={`w-full h-full ${frame.accentColor} flex items-center justify-center relative`}>
              {size === 'large' ? (
                // Enhanced dropzone for large preview
                <div className="absolute inset-4">
                  <EnhancedDropZone 
                    onFilesAdded={handleFilesAdded}
                    maxFiles={1}
                  />
                </div>
              ) : (
                // Simple placeholder for small previews
                <div className="text-center">
                  <Upload className={`${iconSize[size]} mx-auto mb-1 ${frame.textColor} opacity-50`} />
                  <p className={`text-xs ${frame.textColor} opacity-50`}>Your Image</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Compact Card Info Area - 15% of card space */}
        <div className={`w-full h-[15%] ${frame.backgroundColor}`}>
          {size === 'large' ? (
            <CompactCardInfo
              title={cardMetadata.title}
              description={cardMetadata.description}
              rarity={cardMetadata.rarity}
              onUpdate={handleCardMetadataUpdate}
              className={`h-full ${frame.textColor}`}
            />
          ) : (
            <div className="p-1 flex flex-col justify-center h-full">
              <h4 className={`${frame.textColor} font-semibold text-xs text-center truncate leading-tight`}>
                {cardMetadata.title}
              </h4>
              <p className={`${frame.textColor} opacity-70 text-xs text-center truncate leading-tight`}>
                {cardMetadata.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCropModal && hasImage && (
        <ImageCropperModal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          imageUrl={displayImageUrl!}
          onCropComplete={handleCropComplete}
        />
      )}

      {show3DModal && (
        <Card3DPreviewModal
          isOpen={show3DModal}
          onClose={() => setShow3DModal(false)}
          cardData={{
            title: cardMetadata.title,
            description: cardMetadata.description,
            rarity: cardMetadata.rarity
          }}
          imageUrl={displayImageUrl}
        />
      )}
    </>
  );
};
