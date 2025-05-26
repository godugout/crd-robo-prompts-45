
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Layers, Palette, Shapes, Image, Type } from 'lucide-react';

export const ModernLeftPanel = () => {
  const shapes = [
    { name: 'Rectangle', icon: '▭' },
    { name: 'Circle', icon: '●' },
    { name: 'Triangle', icon: '▲' },
    { name: 'Star', icon: '★' },
    { name: 'Arrow', icon: '→' },
    { name: 'Diamond', icon: '◆' },
  ];

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <Tabs defaultValue="shapes" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 m-2">
          <TabsTrigger value="shapes" className="p-2">
            <Shapes className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="colors" className="p-2">
            <Palette className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="text" className="p-2">
            <Type className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="layers" className="p-2">
            <Layers className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 px-4">
          <TabsContent value="shapes" className="mt-4">
            <h3 className="font-semibold mb-3">Shapes</h3>
            <div className="grid grid-cols-3 gap-2">
              {shapes.map((shape) => (
                <Button
                  key={shape.name}
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-gray-50"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify({
                      type: 'shape',
                      shape: shape.name.toLowerCase()
                    }));
                  }}
                >
                  <span className="text-2xl">{shape.icon}</span>
                  <span className="text-xs">{shape.name}</span>
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="colors" className="mt-4">
            <h3 className="font-semibold mb-3">Colors</h3>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify({
                      type: 'color',
                      color
                    }));
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-4">
            <h3 className="font-semibold mb-3">Text Elements</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start h-12"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'text',
                    textType: 'heading'
                  }));
                }}
              >
                <span className="font-bold text-lg">Heading</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-10"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'text',
                    textType: 'body'
                  }));
                }}
              >
                <span>Body Text</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-8"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'text',
                    textType: 'caption'
                  }));
                }}
              >
                <span className="text-sm">Caption</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="layers" className="mt-4">
            <h3 className="font-semibold mb-3">Layers</h3>
            <div className="space-y-1">
              <div className="p-2 bg-blue-50 border border-blue-200 rounded flex items-center justify-between">
                <span className="text-sm">Background</span>
                <div className="w-4 h-4 bg-white border rounded"></div>
              </div>
              <div className="p-2 hover:bg-gray-50 rounded flex items-center justify-between">
                <span className="text-sm">Text Layer</span>
                <div className="w-4 h-4 bg-gray-200 border rounded"></div>
              </div>
              <div className="p-2 hover:bg-gray-50 rounded flex items-center justify-between">
                <span className="text-sm">Shape Layer</span>
                <div className="w-4 h-4 bg-gray-200 border rounded"></div>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
