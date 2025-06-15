
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Layers, 
  Settings, 
  Palette,
  X,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react';

interface FigmaRightPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LayerItem {
  id: string;
  name: string;
  type: 'text' | 'image' | 'frame' | 'background';
  visible: boolean;
  locked: boolean;
}

export const FigmaRightPanel: React.FC<FigmaRightPanelProps> = ({ isOpen, onClose }) => {
  const [layers, setLayers] = useState<LayerItem[]>([
    { id: '1', name: 'Card Frame', type: 'frame', visible: true, locked: false },
    { id: '2', name: 'Player Image', type: 'image', visible: true, locked: false },
    { id: '3', name: 'Title Text', type: 'text', visible: true, locked: false },
    { id: '4', name: 'Background', type: 'background', visible: true, locked: true },
  ]);

  const [frameProperties, setFrameProperties] = useState({
    opacity: [100],
    borderRadius: [8],
    borderWidth: [2],
    shadowIntensity: [50]
  });

  if (!isOpen) return null;

  const toggleLayerVisibility = (id: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const toggleLayerLock = (id: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === id ? { ...layer, locked: !layer.locked } : layer
    ));
  };

  return (
    <div className="w-80 bg-[#2c2c2c] border-l border-[#3c3c3c] flex flex-col">
      <div className="h-12 border-b border-[#3c3c3c] flex items-center justify-between px-4">
        <span className="text-white font-medium text-sm">Properties</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="layers" className="flex-1">
        <TabsList className="grid w-full grid-cols-3 bg-[#1e1e1e] m-2">
          <TabsTrigger value="layers" className="text-white/70 data-[state=active]:text-white">
            <Layers className="w-4 h-4 mr-1" />
            Layers
          </TabsTrigger>
          <TabsTrigger value="properties" className="text-white/70 data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-1" />
            Props
          </TabsTrigger>
          <TabsTrigger value="effects" className="text-white/70 data-[state=active]:text-white">
            <Palette className="w-4 h-4 mr-1" />
            Effects
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 px-4">
          <TabsContent value="layers" className="space-y-2">
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Layer Stack</h3>
              <div className="space-y-1">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className="flex items-center gap-2 p-2 rounded bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors"
                  >
                    <button
                      onClick={() => toggleLayerVisibility(layer.id)}
                      className="text-white/70 hover:text-white"
                    >
                      {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => toggleLayerLock(layer.id)}
                      className="text-white/70 hover:text-white"
                    >
                      {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>
                    <span className="flex-1 text-white text-sm">{layer.name}</span>
                    <div className={`w-3 h-3 rounded ${
                      layer.type === 'frame' ? 'bg-blue-500' :
                      layer.type === 'image' ? 'bg-green-500' :
                      layer.type === 'text' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-4">
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Frame Properties</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-xs mb-2 block">Opacity</label>
                  <Slider
                    value={frameProperties.opacity}
                    onValueChange={(value) => setFrameProperties(prev => ({ ...prev, opacity: value }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-white/50 text-xs">{frameProperties.opacity[0]}%</span>
                </div>

                <div>
                  <label className="text-white/70 text-xs mb-2 block">Border Radius</label>
                  <Slider
                    value={frameProperties.borderRadius}
                    onValueChange={(value) => setFrameProperties(prev => ({ ...prev, borderRadius: value }))}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-white/50 text-xs">{frameProperties.borderRadius[0]}px</span>
                </div>

                <div>
                  <label className="text-white/70 text-xs mb-2 block">Border Width</label>
                  <Slider
                    value={frameProperties.borderWidth}
                    onValueChange={(value) => setFrameProperties(prev => ({ ...prev, borderWidth: value }))}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-white/50 text-xs">{frameProperties.borderWidth[0]}px</span>
                </div>

                <div>
                  <label className="text-white/70 text-xs mb-2 block">Shadow Intensity</label>
                  <Slider
                    value={frameProperties.shadowIntensity}
                    onValueChange={(value) => setFrameProperties(prev => ({ ...prev, shadowIntensity: value }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-white/50 text-xs">{frameProperties.shadowIntensity[0]}%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Visual Effects</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Holographic', 'Chrome', 'Vintage', 'Neon', 'Foil', 'Matte'].map((effect) => (
                  <button
                    key={effect}
                    className="p-3 bg-[#1e1e1e] rounded-lg border border-[#3c3c3c] text-white/70 hover:text-white hover:border-white/40 transition-colors text-sm"
                  >
                    {effect}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
