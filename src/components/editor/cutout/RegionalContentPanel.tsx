
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Type, Sticker, Palette } from 'lucide-react';
import { useCardEditor } from '@/hooks/useCardEditor';

interface RegionalContentPanelProps {
  regionId: string;
  onClose: () => void;
  cardEditor: ReturnType<typeof useCardEditor>;
}

export const RegionalContentPanel: React.FC<RegionalContentPanelProps> = ({
  regionId,
  onClose,
  cardEditor
}) => {
  const [activeTab, setActiveTab] = useState('presets');

  const textPresets = [
    { id: 'bold-title', text: 'CARD TITLE', style: 'font-bold text-2xl text-white' },
    { id: 'elegant-title', text: 'Card Title', style: 'font-serif text-xl text-crd-green' },
    { id: 'modern-title', text: 'CARD TITLE', style: 'font-mono text-lg text-crd-purple' },
    { id: 'stats-text', text: 'ATK: 100 | DEF: 50', style: 'font-semibold text-sm text-white' }
  ];

  const stickerPresets = [
    { id: 'star', emoji: '⭐', name: 'Star' },
    { id: 'fire', emoji: '🔥', name: 'Fire' },
    { id: 'crown', emoji: '👑', name: 'Crown' },
    { id: 'diamond', emoji: '💎', name: 'Diamond' },
    { id: 'lightning', emoji: '⚡', name: 'Lightning' },
    { id: 'magic', emoji: '✨', name: 'Magic' },
    { id: 'trophy', emoji: '🏆', name: 'Trophy' },
    { id: 'medal', emoji: '🏅', name: 'Medal' }
  ];

  const effectPresets = [
    { id: 'glow', name: 'Glow Effect', preview: 'bg-gradient-to-r from-crd-green to-crd-purple' },
    { id: 'shadow', name: 'Drop Shadow', preview: 'bg-black shadow-2xl' },
    { id: 'border', name: 'Gold Border', preview: 'border-2 border-crd-green' },
    { id: 'gradient', name: 'Color Gradient', preview: 'bg-gradient-to-br from-purple-500 to-blue-500' }
  ];

  const handlePresetClick = (preset: any) => {
    // Here we would apply the preset to the specific region
    console.log(`Applying preset ${preset.id} to region ${regionId}`);
    
    // Update card editor with the change
    cardEditor.updateDesignMetadata(`region_${regionId}`, preset);
  };

  const getRegionType = (regionId: string): 'text' | 'sticker' | 'effect' => {
    if (regionId.includes('title') || regionId.includes('stats') || regionId.includes('text')) return 'text';
    if (regionId.includes('logo') || regionId.includes('ornament') || regionId.includes('accent')) return 'sticker';
    return 'effect';
  };

  const regionType = getRegionType(regionId);

  return (
    <div className="w-80 bg-editor-dark border-l border-editor-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-editor-border">
        <h3 className="text-lg font-semibold text-white">
          Customize {regionId.replace('-', ' ').toUpperCase()}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-editor-border">
            <TabsTrigger value="presets" className="text-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
              Quick Presets
            </TabsTrigger>
            <TabsTrigger value="custom" className="text-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
              Custom
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4 mt-4">
            {regionType === 'text' && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-300">Text Styles</h4>
                {textPresets.map((preset) => (
                  <Card 
                    key={preset.id}
                    className="p-3 cursor-pointer hover:bg-editor-border/50 bg-editor-border transition-colors"
                    onClick={() => handlePresetClick(preset)}
                  >
                    <div className={preset.style}>{preset.text}</div>
                  </Card>
                ))}
              </div>
            )}

            {regionType === 'sticker' && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-300">Stickers & Icons</h4>
                <div className="grid grid-cols-4 gap-2">
                  {stickerPresets.map((sticker) => (
                    <Card 
                      key={sticker.id}
                      className="aspect-square p-2 cursor-pointer hover:bg-editor-border/50 bg-editor-border transition-colors flex flex-col items-center justify-center"
                      onClick={() => handlePresetClick(sticker)}
                    >
                      <div className="text-2xl mb-1">{sticker.emoji}</div>
                      <div className="text-xs text-gray-300 text-center">{sticker.name}</div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {regionType === 'effect' && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-300">Visual Effects</h4>
                {effectPresets.map((effect) => (
                  <Card 
                    key={effect.id}
                    className="p-3 cursor-pointer hover:bg-editor-border/50 bg-editor-border transition-colors"
                    onClick={() => handlePresetClick(effect)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded ${effect.preview}`} />
                      <span className="text-white text-sm">{effect.name}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 mt-4">
            <div className="text-center text-gray-400 py-8">
              <Palette className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Custom editing tools coming soon!</p>
              <p className="text-xs mt-1">Use the preset options for now</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-editor-border">
        <Button 
          className="w-full bg-crd-green text-black hover:bg-crd-green/90"
          onClick={onClose}
        >
          Apply Changes
        </Button>
      </div>
    </div>
  );
};
