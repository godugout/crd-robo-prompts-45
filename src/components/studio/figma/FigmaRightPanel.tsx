
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  Sparkles, 
  Layers, 
  X
} from 'lucide-react';

interface FigmaRightPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FigmaRightPanel: React.FC<FigmaRightPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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

      <Tabs defaultValue="properties" className="flex-1">
        <TabsList className="grid w-full grid-cols-3 bg-[#1e1e1e] m-2">
          <TabsTrigger value="properties" className="text-white/70 data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-2" />
            Props
          </TabsTrigger>
          <TabsTrigger value="effects" className="text-white/70 data-[state=active]:text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="layers" className="text-white/70 data-[state=active]:text-white">
            <Layers className="w-4 h-4 mr-2" />
            Layers
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 px-4">
          <TabsContent value="properties" className="space-y-4">
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Transform</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-white/70 text-xs">X</label>
                    <input 
                      className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2 py-1 text-white text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs">Y</label>
                    <input 
                      className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2 py-1 text-white text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-white/70 text-xs">W</label>
                    <input 
                      className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2 py-1 text-white text-sm"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs">H</label>
                    <input 
                      className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2 py-1 text-white text-sm"
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white text-sm font-medium mb-3">Appearance</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-white/70 text-xs mb-2 block">Opacity</label>
                  <Slider 
                    defaultValue={[100]} 
                    max={100} 
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-xs mb-2 block">Corner Radius</label>
                  <Slider 
                    defaultValue={[0]} 
                    max={50} 
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Visual Effects</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-white/70 text-xs mb-2 block">Holographic</label>
                  <Slider 
                    defaultValue={[0]} 
                    max={100} 
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-xs mb-2 block">Metallic</label>
                  <Slider 
                    defaultValue={[0]} 
                    max={100} 
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-xs mb-2 block">Glow</label>
                  <Slider 
                    defaultValue={[0]} 
                    max={100} 
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layers" className="space-y-2">
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Layer Stack</h3>
              <div className="space-y-1">
                {['Card 1', 'Background', 'Grid'].map((layer, index) => (
                  <div 
                    key={layer} 
                    className="flex items-center justify-between p-2 bg-[#1e1e1e] rounded hover:bg-[#3c3c3c] transition-colors"
                  >
                    <span className="text-white text-sm">{layer}</span>
                    <div className="flex items-center gap-1">
                      <button className="w-4 h-4 bg-white/20 rounded text-xs text-white">👁</button>
                      <button className="w-4 h-4 bg-white/20 rounded text-xs text-white">🔒</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
