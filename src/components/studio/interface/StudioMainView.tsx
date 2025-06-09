
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Maximize } from 'lucide-react';
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
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-editor-darker via-black to-editor-darker relative">
      {/* Card Preview Container */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-crd-green/20 via-transparent to-crd-purple/20 blur-3xl"></div>
        <div className="relative z-10">
          {show3DPreview ? (
            <div className="w-96 h-[520px]">
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
              scaleFactor={1.3}
              onPhotoUpload={onPhotoUpload}
              onElementSelect={onElementSelect}
            />
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
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
          <Maximize className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
