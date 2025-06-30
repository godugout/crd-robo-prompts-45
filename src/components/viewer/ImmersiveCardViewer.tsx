
import React, { useState, useCallback } from 'react';
import { EffectProvider } from './contexts/EffectContext';
import type { CardData } from '@/hooks/useCardEditor';

interface ImmersiveCardViewerProps {
  card: CardData;
  cards?: CardData[];
  currentCardIndex?: number;
  onCardChange?: (newIndex: number) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onShare?: () => void;
  onDownload?: () => void | Promise<void>;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
  className?: string;
}

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  cards,
  currentCardIndex,
  onCardChange,
  isOpen = true,
  onClose,
  onShare,
  onDownload,
  allowRotation = false,
  showStats = false,
  ambient = false,
  className = ""
}) => {
  const [effectValues, setEffectValues] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [materialSettings] = useState({
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 0.0,
    transmission: 0.0,
    reflectivity: 50
  });

  const handleEffectChange = useCallback(() => {}, []);
  const resetEffect = useCallback(() => {}, []);
  const resetAllEffects = useCallback(() => {}, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 bg-black/80 flex items-center justify-center ${className}`}>
      <div className="relative w-full max-w-4xl h-full max-h-[90vh] bg-crd-darkest rounded-lg overflow-hidden">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white hover:text-crd-green transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Card navigation */}
        {cards && cards.length > 1 && onCardChange && (
          <div className="absolute top-1/2 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
            <button
              onClick={() => onCardChange(Math.max(0, (currentCardIndex || 0) - 1))}
              disabled={(currentCardIndex || 0) === 0}
              className="pointer-events-auto bg-black/50 hover:bg-black/70 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => onCardChange(Math.min(cards.length - 1, (currentCardIndex || 0) + 1))}
              disabled={(currentCardIndex || 0) === cards.length - 1}
              className="pointer-events-auto bg-black/50 hover:bg-black/70 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        <EffectProvider 
          initialEffects={effectValues}
          initialValues={{
            effectValues,
            mousePosition,
            isHovering,
            showEffects: true,
            materialSettings,
            interactiveLighting: false,
            effectIntensity: [0]
          }}
        >
          <div className="immersive-card-viewer h-full flex flex-col">
            {/* Header with card info */}
            <div className="p-6 border-b border-crd-mediumGray">
              <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
              {card.description && (
                <p className="text-crd-lightGray">{card.description}</p>
              )}
              {showStats && (
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="text-crd-green">Rarity: {card.rarity}</span>
                  {card.tags && card.tags.length > 0 && (
                    <span className="text-crd-lightGray">Tags: {card.tags.join(', ')}</span>
                  )}
                </div>
              )}
            </div>

            {/* 3D View Area */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-md aspect-[3/4] bg-gradient-to-br from-crd-purple/20 to-crd-green/20 rounded-xl flex items-center justify-center">
                <span className="text-crd-lightGray text-lg">Premium 3D View</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-6 border-t border-crd-mediumGray flex gap-3 justify-center">
              {onShare && (
                <button
                  onClick={onShare}
                  className="bg-crd-mediumGray hover:bg-crd-lightGray text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Share
                </button>
              )}
              {onDownload && (
                <button
                  onClick={onDownload}
                  className="bg-crd-green hover:bg-crd-green/90 text-black px-4 py-2 rounded-lg transition-colors"
                >
                  Download
                </button>
              )}
            </div>
          </div>
        </EffectProvider>
      </div>
    </div>
  );
};
