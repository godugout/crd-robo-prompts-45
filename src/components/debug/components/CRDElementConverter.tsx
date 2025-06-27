
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, Settings } from 'lucide-react';

interface PSDLayer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'group';
  visible: boolean;
  opacity: number;
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  zIndex: number;
  imageData?: string;
}

interface CRDElementDraft {
  id: string;
  layerId: string;
  name: string;
  type: 'border' | 'logo' | 'label' | 'decorative' | 'corner' | 'accent';
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  zIndex: number;
  opacity: number;
  rotation: number;
  scale: number;
  imageUrl: string;
}

interface CRDElementConverterProps {
  layers: PSDLayer[];
  elements: CRDElementDraft[];
  onElementsChange: (elements: CRDElementDraft[]) => void;
}

export const CRDElementConverter: React.FC<CRDElementConverterProps> = ({
  layers,
  elements,
  onElementsChange
}) => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const updateElement = (elementId: string, updates: Partial<CRDElementDraft>) => {
    const updatedElements = elements.map(element =>
      element.id === elementId ? { ...element, ...updates } : element
    );
    onElementsChange(updatedElements);
  };

  const selectedElement = elements.find(el => el.id === selectedElementId);
  const correspondingLayer = selectedElement ? layers.find(layer => layer.id === selectedElement.layerId) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Layer to Element Mapping */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white">Layer → Element Mapping</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {elements.map((element) => {
            const layer = layers.find(l => l.id === element.layerId);
            return (
              <div 
                key={element.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedElementId === element.id
                    ? 'border-crd-green bg-crd-green/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => setSelectedElementId(element.id)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xs text-gray-400">
                    {layer?.name || 'Unknown Layer'}
                  </div>
                  <ArrowRight className="w-3 h-3 text-gray-500" />
                  <div className="text-xs text-crd-green font-medium">
                    {element.type.toUpperCase()}
                  </div>
                </div>
                
                <div className="text-sm text-white font-medium mb-1">
                  {element.name}
                </div>
                
                <div className="text-xs text-gray-400">
                  {element.dimensions.width} × {element.dimensions.height} px
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Element Properties Editor */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Element Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedElement ? (
            <div className="space-y-6">
              {/* Basic Properties */}
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Element Name</Label>
                  <Input
                    value={selectedElement.name}
                    onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Element Type</Label>
                  <Select
                    value={selectedElement.type}
                    onValueChange={(value: CRDElementDraft['type']) => 
                      updateElement(selectedElement.id, { type: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="border">Border</SelectItem>
                      <SelectItem value="logo">Logo</SelectItem>
                      <SelectItem value="label">Label</SelectItem>
                      <SelectItem value="decorative">Decorative</SelectItem>
                      <SelectItem value="corner">Corner</SelectItem>
                      <SelectItem value="accent">Accent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Position & Dimensions */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Position & Size</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-gray-300 text-xs">X Position</Label>
                    <Input
                      type="number"
                      value={selectedElement.position.x}
                      onChange={(e) => updateElement(selectedElement.id, {
                        position: { ...selectedElement.position, x: parseInt(e.target.value) || 0 }
                      })}
                      className="bg-gray-700 border-gray-600 text-white text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-xs">Y Position</Label>
                    <Input
                      type="number"
                      value={selectedElement.position.y}
                      onChange={(e) => updateElement(selectedElement.id, {
                        position: { ...selectedElement.position, y: parseInt(e.target.value) || 0 }
                      })}
                      className="bg-gray-700 border-gray-600 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-gray-300 text-xs">Width</Label>
                    <Input
                      type="number"
                      value={selectedElement.dimensions.width}
                      onChange={(e) => updateElement(selectedElement.id, {
                        dimensions: { ...selectedElement.dimensions, width: parseInt(e.target.value) || 0 }
                      })}
                      className="bg-gray-700 border-gray-600 text-white text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-xs">Height</Label>
                    <Input
                      type="number"
                      value={selectedElement.dimensions.height}
                      onChange={(e) => updateElement(selectedElement.id, {
                        dimensions: { ...selectedElement.dimensions, height: parseInt(e.target.value) || 0 }
                      })}
                      className="bg-gray-700 border-gray-600 text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Transform Properties */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Transform</h4>
                
                <div>
                  <Label className="text-gray-300 text-xs">Z-Index: {selectedElement.zIndex}</Label>
                  <Slider
                    value={[selectedElement.zIndex]}
                    onValueChange={([value]) => updateElement(selectedElement.id, { zIndex: value })}
                    min={0}
                    max={20}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-xs">Opacity: {Math.round(selectedElement.opacity * 100)}%</Label>
                  <Slider
                    value={[selectedElement.opacity]}
                    onValueChange={([value]) => updateElement(selectedElement.id, { opacity: value })}
                    min={0}
                    max={1}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-xs">Rotation: {selectedElement.rotation}°</Label>
                  <Slider
                    value={[selectedElement.rotation]}
                    onValueChange={([value]) => updateElement(selectedElement.id, { rotation: value })}
                    min={-180}
                    max={180}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-xs">Scale: {selectedElement.scale}x</Label>
                  <Slider
                    value={[selectedElement.scale]}
                    onValueChange={([value]) => updateElement(selectedElement.id, { scale: value })}
                    min={0.1}
                    max={2}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <Label className="text-gray-300">Image URL</Label>
                <Input
                  value={selectedElement.imageUrl}
                  onChange={(e) => updateElement(selectedElement.id, { imageUrl: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="/path/to/image.png"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Select an element to edit properties</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white">Element Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedElement && correspondingLayer ? (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="text-white font-medium mb-2">Original Layer</h4>
                {correspondingLayer.imageData ? (
                  <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-700">
                    <img 
                      src={correspondingLayer.imageData}
                      alt={correspondingLayer.name}
                      className="w-full h-32 object-contain"
                    />
                  </div>
                ) : (
                  <div className="border border-gray-600 rounded-lg h-32 flex items-center justify-center bg-gray-700">
                    <span className="text-gray-400 text-sm">No preview available</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-crd-green" />
              </div>

              <div className="text-center">
                <h4 className="text-white font-medium mb-2">CRD Element</h4>
                <div className="border border-crd-green rounded-lg overflow-hidden bg-gray-700">
                  {selectedElement.imageUrl ? (
                    <img 
                      src={selectedElement.imageUrl}
                      alt={selectedElement.name}
                      className="w-full h-32 object-contain"
                      style={{
                        transform: `rotate(${selectedElement.rotation}deg) scale(${selectedElement.scale})`,
                        opacity: selectedElement.opacity
                      }}
                    />
                  ) : (
                    <div className="h-32 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image URL set</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Select an element to preview</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
