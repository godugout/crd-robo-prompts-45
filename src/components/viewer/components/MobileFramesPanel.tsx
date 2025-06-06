
import React, { useState } from 'react';
import { Frame, Layers, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FrameOption {
  id: string;
  name: string;
  category: 'material' | 'layout' | 'style';
  preview: string;
  description: string;
}

interface MobileFramesPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFrame: (frameId: string) => void;
  selectedFrameId?: string;
}

const FRAME_OPTIONS: FrameOption[] = [
  // Material Frames
  { id: 'chrome-border', name: 'Chrome', category: 'material', preview: '🔘', description: 'Polished chrome border' },
  { id: 'gold-foil', name: 'Gold Foil', category: 'material', preview: '🟡', description: 'Luxury gold foil frame' },
  { id: 'holographic', name: 'Holographic', category: 'material', preview: '🌈', description: 'Rainbow holographic rim' },
  
  // Layout Frames
  { id: 'classic-border', name: 'Classic', category: 'layout', preview: '⬜', description: 'Traditional card border' },
  { id: 'modern-minimal', name: 'Minimal', category: 'layout', preview: '▫️', description: 'Clean modern frame' },
  { id: 'ornate-vintage', name: 'Ornate', category: 'layout', preview: '🔳', description: 'Detailed vintage design' },
  
  // Style Frames
  { id: 'neon-glow', name: 'Neon Glow', category: 'style', preview: '💫', description: 'Glowing neon effect' },
  { id: 'crystal-edge', name: 'Crystal', category: 'style', preview: '💎', description: 'Crystal faceted border' },
  { id: 'shadow-depth', name: 'Shadow', category: 'style', preview: '🔲', description: 'Deep shadow frame' }
];

export const MobileFramesPanel: React.FC<MobileFramesPanelProps> = ({
  isVisible,
  onClose,
  onApplyFrame,
  selectedFrameId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'material' | 'layout' | 'style'>('material');

  if (!isVisible) return null;

  const filteredFrames = FRAME_OPTIONS.filter(frame => frame.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80">
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-95 backdrop-blur border-t border-white/10 rounded-t-xl max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg flex items-center">
            <Frame className="w-5 h-5 mr-2" />
            Card Frames
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-white/10">
          <Button
            variant="ghost"
            onClick={() => setSelectedCategory('material')}
            className={`flex-1 py-3 text-sm ${
              selectedCategory === 'material' 
                ? 'text-crd-green border-b-2 border-crd-green' 
                : 'text-gray-400'
            }`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Materials
          </Button>
          <Button
            variant="ghost"
            onClick={() => setSelectedCategory('layout')}
            className={`flex-1 py-3 text-sm ${
              selectedCategory === 'layout' 
                ? 'text-crd-green border-b-2 border-crd-green' 
                : 'text-gray-400'
            }`}
          >
            <Layers className="w-4 h-4 mr-2" />
            Layouts
          </Button>
          <Button
            variant="ghost"
            onClick={() => setSelectedCategory('style')}
            className={`flex-1 py-3 text-sm ${
              selectedCategory === 'style' 
                ? 'text-crd-green border-b-2 border-crd-green' 
                : 'text-gray-400'
            }`}
          >
            <Frame className="w-4 h-4 mr-2" />
            Styles
          </Button>
        </div>

        {/* Frames Grid */}
        <ScrollArea className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-3">
            {filteredFrames.map((frame) => (
              <Button
                key={frame.id}
                variant="ghost"
                onClick={() => onApplyFrame(frame.id)}
                className={`flex flex-col items-center justify-center h-24 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-xl ${
                  selectedFrameId === frame.id ? 'ring-2 ring-crd-green' : ''
                }`}
              >
                <span className="text-2xl mb-1">{frame.preview}</span>
                <span className="text-sm font-medium">{frame.name}</span>
                <span className="text-xs text-gray-400 text-center px-2">{frame.description}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
