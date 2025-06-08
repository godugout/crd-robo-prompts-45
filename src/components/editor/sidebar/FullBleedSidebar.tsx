
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StickerLibrary } from '../stickers/StickerLibrary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Sticker, Layers, Settings } from 'lucide-react';
import { SidebarSection } from '../SidebarSection';

interface Sticker {
  id: string;
  name: string;
  category: string;
  emoji?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}

interface StickerData {
  id: string;
  type: 'emoji' | 'icon' | 'shape';
  content: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color?: string;
}

interface FullBleedSidebarProps {
  templateType: 'full-bleed-minimal' | 'full-bleed-social';
  onPhotoUpload: () => void;
  stickers: StickerData[];
  onAddSticker: (sticker: Sticker) => void;
  selectedStickerId?: string;
  onStickerSelect: (id: string) => void;
}

export const FullBleedSidebar: React.FC<FullBleedSidebarProps> = ({
  templateType,
  onPhotoUpload,
  stickers,
  onAddSticker,
  selectedStickerId,
  onStickerSelect
}) => {
  const [stickerSearchQuery, setStickerSearchQuery] = useState('');

  const handleStickerSelect = (sticker: Sticker) => {
    const newStickerData: StickerData = {
      id: `sticker-${Date.now()}`,
      type: sticker.emoji ? 'emoji' : 'icon',
      content: sticker.emoji || '⭐',
      x: 150,
      y: 210,
      rotation: 0,
      scale: 1,
      color: sticker.color
    };
    onAddSticker(sticker);
  };

  return (
    <div className="space-y-6">
      {/* Photo Section */}
      <SidebarSection title="Background Photo">
        <div className="space-y-3">
          <Button
            onClick={onPhotoUpload}
            className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium"
          >
            <Camera className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
          <p className="text-xs text-crd-lightGray">
            Your photo will fill the entire card background
          </p>
        </div>
      </SidebarSection>

      {/* Template-specific sections */}
      {templateType === 'full-bleed-minimal' && (
        <SidebarSection title="Minimal Overlay">
          <div className="text-sm text-crd-lightGray space-y-2">
            <p>This template includes:</p>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>CRD logo in top-left</li>
              <li>Card name in bottom-left</li>
              <li>Card number in top-right</li>
              <li>Rarity badge in bottom-right</li>
            </ul>
            <p className="text-xs mt-3">
              Edit card details in the main form to update these elements.
            </p>
          </div>
        </SidebarSection>
      )}

      {templateType === 'full-bleed-social' && (
        <>
          {/* Stickers Section */}
          <SidebarSection title="Stickers & Elements">
            <Tabs defaultValue="stickers" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-editor-darker">
                <TabsTrigger value="stickers" className="text-xs">
                  <Sticker className="w-3 h-3 mr-1" />
                  Stickers
                </TabsTrigger>
                <TabsTrigger value="layers" className="text-xs">
                  <Layers className="w-3 h-3 mr-1" />
                  Layers
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="stickers" className="mt-4">
                <StickerLibrary
                  onStickerSelect={handleStickerSelect}
                  searchQuery={stickerSearchQuery}
                  onSearchChange={setStickerSearchQuery}
                />
              </TabsContent>
              
              <TabsContent value="layers" className="mt-4">
                <div className="space-y-2">
                  <div className="text-sm text-white font-medium mb-3">
                    Active Layers ({stickers.length})
                  </div>
                  {stickers.length === 0 ? (
                    <p className="text-xs text-crd-lightGray text-center py-4">
                      No stickers added yet. Add some from the Stickers tab!
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {stickers.map((sticker, index) => (
                        <div
                          key={sticker.id}
                          className={`p-2 rounded cursor-pointer transition-colors ${
                            selectedStickerId === sticker.id 
                              ? 'bg-crd-green/20 border border-crd-green' 
                              : 'bg-editor-darker hover:bg-editor-border'
                          }`}
                          onClick={() => onStickerSelect(sticker.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{sticker.content}</span>
                              <span className="text-xs text-crd-lightGray">
                                Layer {stickers.length - index}
                              </span>
                            </div>
                            <div className="text-xs text-crd-lightGray">
                              {Math.round(sticker.scale * 100)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </SidebarSection>

          {/* Tips Section */}
          <SidebarSection title="Tips">
            <div className="text-xs text-crd-lightGray space-y-2">
              <p>• Tap stickers to select and move them</p>
              <p>• Use the controls to rotate and resize</p>
              <p>• Duplicate popular stickers</p>
              <p>• Layer stickers for creative effects</p>
            </div>
          </SidebarSection>
        </>
      )}
    </div>
  );
};
