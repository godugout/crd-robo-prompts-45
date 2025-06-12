
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Maximize, Minimize } from 'lucide-react';
import { StudioCardRenderer } from '../renderer/StudioCardRenderer';
import { Advanced3DCardRenderer } from '../advanced/Advanced3DCardRenderer';
import type { CardData } from '@/hooks/useCardEditor';
import type { StudioState } from '@/hooks/useStudioState';

interface StudioMainViewProps {
  show3DPreview: boolean;
  showCRDBack: boolean;
  isFullscreen: boolean;
  currentPhoto: string;
  cardData: CardData;
  advanced3DEffects: any;
  templateForRenderer: any;
  studioState: StudioState;
  setShow3DPreview: (value: boolean) => void;
  setShowCRDBack: (value: boolean) => void;
  setIsFullscreen: (value: boolean) => void;
  onPhotoUpload: () => void;
  onElementSelect: (elementId: string) => void;
}

export const StudioMainView: React.FC<StudioMainViewProps> = ({
  show3DPreview,
  showCRDBack,
  isFullscreen,
  currentPhoto,
  cardData,
  advanced3DEffects,
  templateForRenderer,
  studioState,
  setShow3DPreview,
  setShowCRDBack,
  setIsFullscreen,
  onPhotoUpload,
  onElementSelect
}) => {
  // Calculate responsive dimensions based on fullscreen mode
  const getCardDimensions = () => {
    if (isFullscreen) {
      // In fullscreen, use most of the screen real estate
      const maxHeight = window.innerHeight * 0.9; // 90% of screen height
      const aspectRatio = 2.5 / 3.5; // Standard trading card ratio
      const calculatedWidth = maxHeight * aspectRatio;
      
      // Ensure we don't exceed screen width
      const maxWidth = window.innerWidth * 0.8;
      if (calculatedWidth > maxWidth) {
        return {
          width: maxWidth,
          height: maxWidth / aspectRatio
        };
      }
      
      return {
        width: calculatedWidth,
        height: maxHeight
      };
    } else {
      // Normal mode - use a reasonable size
      return {
        width: 384, // w-96 equivalent
        height: 520
      };
    }
  };

  const cardDimensions = getCardDimensions();
  const scaleFactor = cardDimensions.width / 384; // Scale relative to base size

  return (
    <div className={`flex-1 flex items-center justify-center ${
      isFullscreen ? 'p-2' : 'p-8'
    } bg-gradient-to-br from-editor-darker via-black to-editor-darker relative`}>
      {/* Card Preview Container */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-crd-green/20 via-transparent to-crd-purple/20 blur-3xl"></div>
        <div className="relative z-10">
          {show3DPreview ? (
            <div 
              style={{
                width: cardDimensions.width,
                height: cardDimensions.height
              }}
            >
              <Advanced3DCardRenderer
                cardData={cardData}
                imageUrl={currentPhoto}
                effects={advanced3DEffects}
                onInteraction={(type, data) => {
                  console.log('3D interaction:', type, data);
                }}
              />
            </div>
          ) : (
            <StudioCardRenderer
              template={templateForRenderer}
              cardData={cardData}
              currentPhoto={currentPhoto}
              studioState={studioState}
              scaleFactor={scaleFactor}
              onPhotoUpload={onPhotoUpload}
              onElementSelect={onElementSelect}
              dimensions={cardDimensions}
            />
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className={`absolute ${isFullscreen ? 'bottom-4 right-4' : 'bottom-6 right-6'} flex flex-col gap-2`}>
        <Button
          onClick={() => setShow3DPreview(!show3DPreview)}
          className={`w-12 h-12 rounded-full ${show3DPreview ? 'bg-crd-green text-black' : 'bg-editor-dark text-white border border-editor-border'}`}
        >
          <Sparkles className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => setShowCRDBack(!showCRDBack)}
          className={`w-12 h-12 rounded-full ${showCRDBack ? 'bg-crd-green text-black' : 'bg-editor-dark text-white border border-editor-border'}`}
        >
          <Zap className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-12 h-12 rounded-full bg-editor-dark text-white border border-editor-border hover:bg-editor-border"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </Button>
      </div>

      {/* Fullscreen indicator */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 bg-crd-green text-black px-3 py-1 rounded-full text-sm font-medium">
          Fullscreen Mode
        </div>
      )}
    </div>
  );
};
