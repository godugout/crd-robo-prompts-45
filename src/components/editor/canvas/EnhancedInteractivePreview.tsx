
import React, { useState } from 'react';
import { Sparkles, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { toast } from 'sonner';
import type { useCardEditor } from '@/hooks/useCardEditor';

interface EnhancedInteractivePreviewProps {
  title: string;
  description: string;
  cardEditor?: ReturnType<typeof useCardEditor>;
  onElementSelect: (element: string | null) => void;
  selectedElement: string | null;
  currentPhoto: {file: File, preview: string} | null;
  cardState: any;
}

export const EnhancedInteractivePreview = ({
  title,
  description,
  cardEditor,
  onElementSelect,
  selectedElement,
  currentPhoto,
  cardState
}: EnhancedInteractivePreviewProps) => {
  const [showImmersiveViewer, setShowImmersiveViewer] = useState(false);

  const handleViewImmersive = () => {
    if (!cardEditor?.cardData || !cardEditor.cardData.title?.trim()) {
      toast.error('Please add a card title before viewing in immersive mode');
      return;
    }
    setShowImmersiveViewer(true);
  };

  const handleDownloadCard = () => {
    if (!cardEditor?.cardData) {
      toast.error('No card data available');
      return;
    }
    
    const card = cardEditor.cardData;
    const dataStr = JSON.stringify(card, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${card.title.replace(/\s+/g, '_')}_card.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Card exported successfully');
  };

  const handleShareCard = () => {
    const shareUrl = window.location.href;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success('Card link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    } else {
      toast.error('Sharing not supported in this browser');
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Card Preview Container */}
      <div className="relative">
        {/* Interactive Card Preview */}
        <div 
          className={`aspect-[3/4] w-80 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
            cardEditor?.cardData.template_id === 'neon' ? 'bg-gradient-to-br from-purple-900 to-black border-2 border-purple-500' :
            cardEditor?.cardData.template_id === 'vintage' ? 'bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-600' :
            cardEditor?.cardData.template_id === 'classic' ? 'bg-white border-2 border-gray-300' :
            'bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300'
          }`}
          onClick={() => onElementSelect(selectedElement === 'card' ? null : 'card')}
          style={{
            transform: `perspective(1000px) rotateX(${cardState?.effects?.holographic ? '2deg' : '0'}) rotateY(${cardState?.effects?.neonGlow ? '1deg' : '0'})`,
            filter: `brightness(${cardState?.effects?.brightness || 100}%) contrast(${cardState?.effects?.contrast || 100}%) saturate(${cardState?.effects?.saturation || 100}%)`,
            ...cardState?.effects?.holographic && { 
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
              backgroundSize: '400% 400%',
              animation: 'gradient 4s ease infinite'
            }
          }}
        >
          {/* Photo Section */}
          <div className="h-3/5 w-full p-4">
            <div className="h-full w-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center relative">
              {currentPhoto ? (
                <img 
                  src={currentPhoto.preview} 
                  alt="Card" 
                  className="w-full h-full object-cover"
                  style={{
                    filter: cardState?.photo?.filter !== 'original' ? 
                      cardState?.photo?.filter === 'sepia' ? 'sepia(1)' :
                      cardState?.photo?.filter === 'grayscale' ? 'grayscale(1)' :
                      cardState?.photo?.filter === 'blur' ? 'blur(2px)' :
                      'none' : 'none',
                    transform: `scale(${cardState?.photo?.crop?.scale || 1}) rotate(${cardState?.photo?.crop?.rotation || 0}deg) translateX(${cardState?.photo?.crop?.offsetX || 0}px) translateY(${cardState?.photo?.crop?.offsetY || 0}px)`
                  }}
                />
              ) : cardEditor?.cardData.image_url ? (
                <img 
                  src={cardEditor.cardData.image_url} 
                  alt={title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <Eye className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Upload a photo</p>
                </div>
              )}
              
              {cardState?.effects?.holographic && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
              )}
            </div>
          </div>
          
          {/* Text Section */}
          <div className="h-2/5 p-4 flex flex-col justify-center">
            <h2 
              className={`text-2xl font-bold mb-2 cursor-text ${
                cardEditor?.cardData.template_id === 'neon' ? 'text-white' : 'text-gray-900'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onElementSelect('title');
              }}
              style={{ color: cardState?.template?.colors?.primary }}
            >
              {title || 'Card Title'}
            </h2>
            <p 
              className={`text-sm cursor-text ${
                cardEditor?.cardData.template_id === 'neon' ? 'text-gray-300' : 'text-gray-600'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onElementSelect('description');
              }}
              style={{ color: cardState?.template?.colors?.accent }}
            >
              {description || 'Add a description...'}
            </p>
            
            {cardEditor?.cardData.rarity && (
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  cardEditor.cardData.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                  cardEditor.cardData.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                  cardEditor.cardData.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                  cardEditor.cardData.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {cardEditor.cardData.rarity}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Immersive View Button */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <Button
            onClick={handleViewImmersive}
            className="bg-crd-purple hover:bg-crd-purple/90 text-white px-6 py-2 rounded-full shadow-lg"
            disabled={!cardEditor?.cardData || !cardEditor.cardData.title?.trim()}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            View Immersive
          </Button>
        </div>
      </div>

      {/* Visual Effects */}
      {cardState?.effects?.neonGlow && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-30 blur-2xl"></div>
        </div>
      )}

      {/* Selection Indicator */}
      {selectedElement && (
        <div className="absolute top-4 right-4 bg-crd-green text-black px-3 py-1 rounded-full text-sm font-medium">
          Selected: {selectedElement}
        </div>
      )}

      {/* Immersive Card Viewer */}
      {showImmersiveViewer && cardEditor?.cardData && (
        <ImmersiveCardViewer
          card={cardEditor.cardData}
          isOpen={showImmersiveViewer}
          onClose={() => setShowImmersiveViewer(false)}
          onShare={handleShareCard}
          onDownload={handleDownloadCard}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      )}
    </div>
  );
};
