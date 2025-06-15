
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { EXTRACTED_FRAMES } from '../frames/ExtractedFrameConfigs';

interface FigmaBottomPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFrameSelect?: (frameId: string) => void;
}

export const FigmaBottomPanel: React.FC<FigmaBottomPanelProps> = ({ 
  isOpen, 
  onClose, 
  onFrameSelect 
}) => {
  if (!isOpen) return null;

  const basicFrames = [
    { id: 'basic-1', name: 'Classic', preview: '📄' },
    { id: 'basic-2', name: 'Modern', preview: '🔲' },
    { id: 'basic-3', name: 'Rounded', preview: '⭕' },
  ];

  return (
    <div className="h-48 bg-[#2c2c2c] border-t border-[#3c3c3c] flex flex-col">
      <div className="h-12 border-b border-[#3c3c3c] flex items-center justify-between px-4">
        <span className="text-white font-medium text-sm">Frames & Templates</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="extracted" className="flex-1">
        <TabsList className="grid w-full grid-cols-2 bg-[#1e1e1e] m-2">
          <TabsTrigger value="extracted" className="text-white/70 data-[state=active]:text-white">
            Card Frames
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-white/70 data-[state=active]:text-white">
            Templates
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="extracted" className="space-y-4">
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Extracted Card Frames</h3>
              <div className="flex gap-4">
                {EXTRACTED_FRAMES.map((frame) => (
                  <div
                    key={frame.id}
                    className="flex-shrink-0 w-32 cursor-pointer group"
                    onClick={() => onFrameSelect?.(frame.id)}
                  >
                    <div 
                      className="w-32 h-20 rounded-lg border border-[#3c3c3c] flex items-center justify-center text-2xl group-hover:border-white/40 transition-colors relative overflow-hidden"
                      style={frame.style}
                    >
                      {frame.overlayElements?.map((element, index) => (
                        <div key={index} style={element.style} />
                      ))}
                      <span className="relative z-10 text-white drop-shadow-lg">
                        {frame.preview}
                      </span>
                    </div>
                    <p className="text-white/70 text-xs text-center mt-2 group-hover:text-white transition-colors">
                      {frame.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Basic Templates</h3>
              <div className="flex gap-4">
                {basicFrames.map((frame) => (
                  <div
                    key={frame.id}
                    className="flex-shrink-0 w-24 cursor-pointer group"
                    onClick={() => onFrameSelect?.(frame.id)}
                  >
                    <div className="w-24 h-16 bg-[#1e1e1e] rounded-lg border border-[#3c3c3c] flex items-center justify-center text-2xl group-hover:border-white/40 transition-colors">
                      {frame.preview}
                    </div>
                    <p className="text-white/70 text-xs text-center mt-2 group-hover:text-white transition-colors">
                      {frame.name}
                    </p>
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
