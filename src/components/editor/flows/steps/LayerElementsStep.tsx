
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Award, Zap, Star, X } from 'lucide-react';

interface LayerElement {
  id: string;
  type: 'logo' | 'nameplate' | 'effect';
  elementId: string;
  position: { x: number; y: number };
}

interface ElementOption {
  id: string;
  name: string;
  type: 'logo' | 'nameplate' | 'effect';
  icon: React.ComponentType<{ className?: string }>;
  preview: string;
}

const ELEMENT_OPTIONS: ElementOption[] = [
  { id: 'team-logo', name: 'Team Logo', type: 'logo', icon: Award, preview: '🏆' },
  { id: 'league-logo', name: 'League Logo', type: 'logo', icon: Star, preview: '⭐' },
  { id: 'name-plate-classic', name: 'Classic Nameplate', type: 'nameplate', icon: Layers, preview: '📝' },
  { id: 'name-plate-modern', name: 'Modern Nameplate', type: 'nameplate', icon: Layers, preview: '🏷️' },
  { id: 'hologram-effect', name: 'Hologram Effect', type: 'effect', icon: Zap, preview: '✨' },
  { id: 'chrome-effect', name: 'Chrome Effect', type: 'effect', icon: Zap, preview: '🔆' }
];

interface LayerElementsStepProps {
  selectedFrame?: string;
  layerElements?: LayerElement[];
  onLayerElementsChange: (elements: LayerElement[]) => void;
}

export const LayerElementsStep: React.FC<LayerElementsStepProps> = ({
  selectedFrame,
  layerElements = [],
  onLayerElementsChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'logo', 'nameplate', 'effect'];

  const filteredElements = ELEMENT_OPTIONS.filter(element =>
    selectedCategory === 'All' || element.type === selectedCategory
  );

  const addElement = (elementOption: ElementOption) => {
    const newElement: LayerElement = {
      id: `layer-${Date.now()}`,
      type: elementOption.type,
      elementId: elementOption.id,
      position: { 
        x: elementOption.type === 'logo' ? 85 : elementOption.type === 'nameplate' ? 50 : 50,
        y: elementOption.type === 'logo' ? 15 : elementOption.type === 'nameplate' ? 85 : 50
      }
    };
    onLayerElementsChange([...layerElements, newElement]);
  };

  const removeElement = (id: string) => {
    const filtered = layerElements.filter(element => element.id !== id);
    onLayerElementsChange(filtered);
  };

  const getElementOption = (elementId: string) => {
    return ELEMENT_OPTIONS.find(option => option.id === elementId);
  };

  return (
    <div className="flex h-full">
      {/* Element Library */}
      <div className="w-80 bg-editor-dark border-r border-editor-border p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Layer Elements</h3>
          <p className="text-gray-400 text-sm">
            Add logos, nameplates, and effects to enhance your card. This step is optional.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-editor-darker border border-gray-600 rounded text-white text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'All' ? 'All Elements' : category.charAt(0).toUpperCase() + category.slice(1) + 's'}
              </option>
            ))}
          </select>
        </div>

        {/* Elements Grid */}
        <ScrollArea className="h-60 mb-6">
          <div className="grid grid-cols-2 gap-3">
            {filteredElements.map((element) => (
              <Button
                key={element.id}
                onClick={() => addElement(element)}
                className="h-auto p-3 bg-editor-darker hover:bg-editor-border text-white flex flex-col items-center gap-2"
              >
                <div className="text-2xl">{element.preview}</div>
                <span className="text-xs text-center">{element.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Added Elements */}
        {layerElements.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-3 flex items-center">
              <Layers className="w-4 h-4 mr-2" />
              Added Elements
            </h4>
            <div className="space-y-2">
              {layerElements.map((element) => {
                const option = getElementOption(element.elementId);
                return (
                  <div
                    key={element.id}
                    className="flex items-center justify-between p-2 bg-editor-darker rounded border border-gray-600"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{option?.preview}</span>
                      <span className="text-white text-sm">{option?.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeElement(element.id)}
                      className="text-gray-400 hover:text-red-400 h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Live Preview */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="aspect-[5/7] w-80 bg-gray-800 rounded-lg border border-gray-700 relative overflow-hidden">
          {/* Card background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800"></div>
          
          {/* Layer elements */}
          {layerElements.map((element) => {
            const option = getElementOption(element.elementId);
            return (
              <div
                key={element.id}
                className="absolute text-2xl cursor-pointer transition-transform hover:scale-110"
                style={{
                  left: `${element.position.x}%`,
                  top: `${element.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {option?.preview}
              </div>
            );
          })}
          
          {/* Helper text */}
          {layerElements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Add elements to see preview</p>
                <p className="text-xs mt-1">Elements will layer on top of your image</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
