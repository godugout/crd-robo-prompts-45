
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Image, 
  Shapes, 
  X,
  ChevronRight
} from 'lucide-react';

interface FigmaLeftPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FigmaLeftPanel: React.FC<FigmaLeftPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  return (
    <div className="w-80 bg-[#2c2c2c] border-r border-[#3c3c3c] flex flex-col">
      <div className="h-12 border-b border-[#3c3c3c] flex items-center justify-between px-4">
        <span className="text-white font-medium text-sm">Design</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="colors" className="flex-1">
        <TabsList className="grid w-full grid-cols-3 bg-[#1e1e1e] m-2">
          <TabsTrigger value="colors" className="text-white/70 data-[state=active]:text-white">
            <Palette className="w-4 h-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="images" className="text-white/70 data-[state=active]:text-white">
            <Image className="w-4 h-4 mr-2" />
            Images
          </TabsTrigger>
          <TabsTrigger value="assets" className="text-white/70 data-[state=active]:text-white">
            <Shapes className="w-4 h-4 mr-2" />
            Assets
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 px-4">
          <TabsContent value="colors" className="space-y-4">
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Color Palette</h3>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className="w-10 h-10 rounded-lg border-2 border-white/20 hover:border-white/40 transition-colors"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Recent Colors</h3>
              <div className="grid grid-cols-5 gap-2">
                {colors.slice(0, 5).map((color, index) => (
                  <button
                    key={index}
                    className="w-10 h-10 rounded-lg border-2 border-white/20 hover:border-white/40 transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Upload Image</h3>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                <Image className="w-8 h-8 text-white/40 mx-auto mb-2" />
                <p className="text-white/70 text-sm">Drop images here or click to upload</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Recent Images</h3>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-white/10 rounded-lg flex items-center justify-center">
                    <Image className="w-6 h-6 text-white/40" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assets" className="space-y-4">
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Shapes</h3>
              <div className="grid grid-cols-4 gap-2">
                {['Rectangle', 'Circle', 'Triangle', 'Star'].map((shape) => (
                  <button
                    key={shape}
                    className="aspect-square bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Shapes className="w-6 h-6 text-white/70" />
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
