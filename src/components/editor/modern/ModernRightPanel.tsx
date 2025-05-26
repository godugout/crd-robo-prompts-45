
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useModernEditor } from './context/ModernEditorContext';
import { Settings, Palette, Type, Image } from 'lucide-react';

export const ModernRightPanel = () => {
  const { selectedElement, cardEditor } = useModernEditor();

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 m-2">
          <TabsTrigger value="properties">
            <Settings className="w-4 h-4 mr-2" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="card">
            <Image className="w-4 h-4 mr-2" />
            Card
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 px-4">
          <TabsContent value="properties" className="mt-4 space-y-6">
            {selectedElement ? (
              <>
                <div>
                  <h3 className="font-semibold mb-3">Element Properties</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="element-x">X Position</Label>
                      <Input
                        id="element-x"
                        type="number"
                        value={Math.round(selectedElement.left || 0)}
                        onChange={(e) => {
                          if (selectedElement) {
                            selectedElement.set({ left: parseInt(e.target.value) });
                            selectedElement.canvas?.renderAll();
                          }
                        }}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="element-y">Y Position</Label>
                      <Input
                        id="element-y"
                        type="number"
                        value={Math.round(selectedElement.top || 0)}
                        onChange={(e) => {
                          if (selectedElement) {
                            selectedElement.set({ top: parseInt(e.target.value) });
                            selectedElement.canvas?.renderAll();
                          }
                        }}
                        className="mt-1"
                      />
                    </div>

                    {selectedElement.type === 'rect' && (
                      <>
                        <div>
                          <Label htmlFor="element-width">Width</Label>
                          <Input
                            id="element-width"
                            type="number"
                            value={Math.round(selectedElement.width || 0)}
                            onChange={(e) => {
                              if (selectedElement) {
                                selectedElement.set({ width: parseInt(e.target.value) });
                                selectedElement.canvas?.renderAll();
                              }
                            }}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="element-height">Height</Label>
                          <Input
                            id="element-height"
                            type="number"
                            value={Math.round(selectedElement.height || 0)}
                            onChange={(e) => {
                              if (selectedElement) {
                                selectedElement.set({ height: parseInt(e.target.value) });
                                selectedElement.canvas?.renderAll();
                              }
                            }}
                            className="mt-1"
                          />
                        </div>
                      </>
                    )}

                    {selectedElement.type === 'circle' && (
                      <div>
                        <Label htmlFor="element-radius">Radius</Label>
                        <Input
                          id="element-radius"
                          type="number"
                          value={Math.round(selectedElement.radius || 0)}
                          onChange={(e) => {
                            if (selectedElement) {
                              selectedElement.set({ radius: parseInt(e.target.value) });
                              selectedElement.canvas?.renderAll();
                            }
                          }}
                          className="mt-1"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="element-opacity">Opacity</Label>
                      <Slider
                        value={[(selectedElement.opacity || 1) * 100]}
                        onValueChange={(value) => {
                          if (selectedElement) {
                            selectedElement.set({ opacity: value[0] / 100 });
                            selectedElement.canvas?.renderAll();
                          }
                        }}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <span className="text-sm text-gray-500">{Math.round((selectedElement.opacity || 1) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select an element to edit its properties</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="card" className="mt-4 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Card Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-title">Title</Label>
                  <Input
                    id="card-title"
                    value={cardEditor.cardData.title || ''}
                    onChange={(e) => cardEditor.updateCardField('title', e.target.value)}
                    placeholder="Enter card title..."
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="card-description">Description</Label>
                  <textarea
                    id="card-description"
                    value={cardEditor.cardData.description || ''}
                    onChange={(e) => cardEditor.updateCardField('description', e.target.value)}
                    placeholder="Enter card description..."
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md resize-none h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="card-rarity">Rarity</Label>
                  <select
                    id="card-rarity"
                    value={cardEditor.cardData.rarity || 'common'}
                    onChange={(e) => cardEditor.updateCardField('rarity', e.target.value as any)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
