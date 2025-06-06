
import React, { useState } from 'react';
import { Crown, Layout, Lightbulb, Package, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ShowcaseLayout {
  id: string;
  name: string;
  description: string;
  preview: string;
  isPremium: boolean;
}

interface MobileShowcasePanelProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectLayout: (layoutId: string) => void;
  selectedLayoutId?: string;
}

const SHOWCASE_LAYOUTS: ShowcaseLayout[] = [
  { id: 'single-spotlight', name: 'Spotlight', description: 'Single card with dramatic lighting', preview: '💡', isPremium: false },
  { id: 'gallery-wall', name: 'Gallery Wall', description: 'Museum-style wall display', preview: '🖼️', isPremium: true },
  { id: 'floating-display', name: 'Floating', description: 'Cards floating in space', preview: '✨', isPremium: true },
  { id: 'pedestal-luxury', name: 'Pedestal', description: 'Luxury pedestal presentation', preview: '🏛️', isPremium: true },
  { id: 'hologram-tech', name: 'Hologram', description: 'Futuristic hologram display', preview: '🔮', isPremium: true },
  { id: 'collectors-case', name: "Collector's Case", description: 'Premium glass display case', preview: '📦', isPremium: true }
];

export const MobileShowcasePanel: React.FC<MobileShowcasePanelProps> = ({
  isVisible,
  onClose,
  onSelectLayout,
  selectedLayoutId
}) => {
  const [selectedTab, setSelectedTab] = useState<'layouts' | 'lighting' | 'objects'>('layouts');

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80">
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-95 backdrop-blur border-t border-white/10 rounded-t-xl max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg flex items-center">
            <Crown className="w-5 h-5 mr-2 text-yellow-500" />
            Premium Showcase
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Feature Tabs */}
        <div className="flex border-b border-white/10">
          <Button
            variant="ghost"
            onClick={() => setSelectedTab('layouts')}
            className={`flex-1 py-3 text-sm ${
              selectedTab === 'layouts' 
                ? 'text-yellow-500 border-b-2 border-yellow-500' 
                : 'text-gray-400'
            }`}
          >
            <Layout className="w-4 h-4 mr-2" />
            Layouts
          </Button>
          <Button
            variant="ghost"
            onClick={() => setSelectedTab('lighting')}
            className={`flex-1 py-3 text-sm ${
              selectedTab === 'lighting' 
                ? 'text-yellow-500 border-b-2 border-yellow-500' 
                : 'text-gray-400'
            }`}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Lighting
          </Button>
          <Button
            variant="ghost"
            onClick={() => setSelectedTab('objects')}
            className={`flex-1 py-3 text-sm ${
              selectedTab === 'objects' 
                ? 'text-yellow-500 border-b-2 border-yellow-500' 
                : 'text-gray-400'
            }`}
          >
            <Package className="w-4 h-4 mr-2" />
            Objects
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-4">
          {selectedTab === 'layouts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {SHOWCASE_LAYOUTS.map((layout) => (
                  <Button
                    key={layout.id}
                    variant="ghost"
                    onClick={() => onSelectLayout(layout.id)}
                    className={`flex flex-col items-center justify-center h-28 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-xl relative ${
                      selectedLayoutId === layout.id ? 'ring-2 ring-yellow-500' : ''
                    }`}
                  >
                    {layout.isPremium && (
                      <Crown className="absolute top-2 right-2 w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-2xl mb-1">{layout.preview}</span>
                    <span className="text-sm font-medium">{layout.name}</span>
                    <span className="text-xs text-gray-400 text-center px-2">{layout.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'lighting' && (
            <div className="space-y-4">
              <div className="text-center text-gray-400 py-8">
                <Lightbulb className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <p>Advanced lighting controls</p>
                <p className="text-sm">Coming soon</p>
              </div>
            </div>
          )}

          {selectedTab === 'objects' && (
            <div className="space-y-4">
              <div className="text-center text-gray-400 py-8">
                <Package className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <p>Scene personalization objects</p>
                <p className="text-sm">Coming soon</p>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Premium Notice */}
        <div className="border-t border-white/10 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
          <div className="flex items-center justify-center">
            <Crown className="w-4 h-4 text-yellow-500 mr-2" />
            <span className="text-yellow-500 text-sm font-medium">Premium Feature</span>
          </div>
          <p className="text-xs text-gray-400 text-center mt-1">
            Unlock advanced showcase layouts and lighting
          </p>
        </div>
      </div>
    </div>
  );
};
