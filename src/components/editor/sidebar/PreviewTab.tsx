
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Eye, Maximize, Download, Share2, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { convertToUniversalCardData } from '@/components/viewer/types';
import AdvancedCardRenderer from '@/components/renderer/AdvancedCardRenderer';
import type { CardData } from '@/hooks/useCardEditor';

interface PreviewTabProps {
  selectedTemplate: string;
  cardData?: CardData;
  onContinueToEffects: () => void;
}

export const PreviewTab = ({ selectedTemplate, cardData, onContinueToEffects }: PreviewTabProps) => {
  const [previewMode, setPreviewMode] = useState<'simple' | 'scene' | '3d'>('simple');
  const [showImmersiveViewer, setShowImmersiveViewer] = useState(false);

  const handleImmersiveView = () => {
    if (cardData) {
      setShowImmersiveViewer(true);
    } else {
      toast.error('No card data available for immersive view');
    }
  };

  const handleExport = () => {
    toast.success('Exporting high-resolution card...');
  };

  const handleShare = () => {
    toast.success('Generating share link...');
  };

  const handleDownloadCard = () => {
    if (!cardData) return;
    
    const dataStr = JSON.stringify(cardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cardData.title.replace(/\s+/g, '_')}_card.json`;
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
    <ScrollArea className="h-full px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Card Preview</h3>
          <p className="text-crd-lightGray text-sm">
            Review your card design with advanced visual effects
          </p>
        </div>

        {/* Advanced Card Preview */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Advanced Preview</h4>
          <div className="flex justify-center">
            {cardData ? (
              <AdvancedCardRenderer
                card={cardData}
                width={240}
                height={336}
                interactive={true}
                showEffectControls={false}
              />
            ) : (
              <div className="aspect-[3/4] w-60 bg-editor-dark rounded-xl border border-editor-border relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-crd-green to-crd-orange rounded-xl mb-4 mx-auto flex items-center justify-center">
                      <span className="text-black font-bold text-lg">CARD</span>
                    </div>
                    <p className="text-crd-lightGray text-sm">Advanced Preview</p>
                    <p className="text-crd-lightGray text-xs mt-1">Template: {selectedTemplate}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Immersive Viewer Options */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Immersive Viewer</h4>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'simple', name: 'Simple BG', color: 'from-gray-600 to-gray-800' },
              { id: 'scene', name: 'Custom Scene', color: 'from-blue-600 to-purple-600' },
              { id: '3d', name: '3D Environment', color: 'from-green-600 to-cyan-600' }
            ].map((mode) => (
              <div
                key={mode.id}
                className={`aspect-square rounded-lg cursor-pointer transition-all ${
                  previewMode === mode.id ? 'ring-2 ring-crd-green scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setPreviewMode(mode.id as any)}
              >
                <div className={`w-full h-full bg-gradient-to-br ${mode.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white text-xs font-medium text-center">{mode.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Immersive View Button */}
        <Button 
          className="w-full bg-crd-purple hover:bg-crd-purple/90 text-white" 
          onClick={handleImmersiveView}
          disabled={!cardData}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Open Immersive Viewer
        </Button>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full border-editor-border text-white hover:bg-editor-border" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export High Resolution
          </Button>
          
          <Button variant="outline" className="w-full border-editor-border text-white hover:bg-editor-border" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Preview
          </Button>
        </div>

        {/* Continue Button */}
        <div className="pt-4 border-t border-editor-border">
          <Button className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium" onClick={onContinueToEffects}>
            Continue to Effects
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Immersive Card Viewer */}
      {showImmersiveViewer && cardData && (
        <ImmersiveCardViewer
          card={convertToUniversalCardData(cardData)}
          isOpen={showImmersiveViewer}
          onClose={() => setShowImmersiveViewer(false)}
          onShare={handleShareCard}
          onDownload={handleDownloadCard}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      )}
    </ScrollArea>
  );
};
