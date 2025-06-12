
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Type, Plus, X } from 'lucide-react';

interface TextElement {
  id: string;
  type: 'name' | 'title' | 'stats';
  content: string;
  position: { x: number; y: number };
}

interface TextElementsStepProps {
  selectedFrame?: string;
  textElements?: TextElement[];
  onTextElementsChange: (elements: TextElement[]) => void;
}

export const TextElementsStep: React.FC<TextElementsStepProps> = ({
  selectedFrame,
  textElements = [],
  onTextElementsChange
}) => {
  const [activeElement, setActiveElement] = useState<string | null>(null);

  const addTextElement = (type: TextElement['type']) => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      type,
      content: type === 'name' ? 'Player Name' : type === 'title' ? 'Card Title' : 'Stats',
      position: { x: 50, y: type === 'name' ? 20 : type === 'title' ? 80 : 50 }
    };
    onTextElementsChange([...textElements, newElement]);
    setActiveElement(newElement.id);
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    const updated = textElements.map(element =>
      element.id === id ? { ...element, ...updates } : element
    );
    onTextElementsChange(updated);
  };

  const removeTextElement = (id: string) => {
    const filtered = textElements.filter(element => element.id !== id);
    onTextElementsChange(filtered);
    if (activeElement === id) {
      setActiveElement(null);
    }
  };

  return (
    <div className="flex h-full">
      {/* Text Controls */}
      <div className="w-80 bg-editor-dark border-r border-editor-border p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Add Text Elements</h3>
          <p className="text-gray-400 text-sm">
            Add essential text like names, titles, or stats. This step is optional.
          </p>
        </div>

        {/* Add Text Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            onClick={() => addTextElement('name')}
            className="w-full justify-start bg-editor-darker hover:bg-editor-border text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Name/Player
          </Button>
          <Button
            onClick={() => addTextElement('title')}
            className="w-full justify-start bg-editor-darker hover:bg-editor-border text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Title/Position
          </Button>
          <Button
            onClick={() => addTextElement('stats')}
            className="w-full justify-start bg-editor-darker hover:bg-editor-border text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Stats/Info
          </Button>
        </div>

        {/* Text Elements List */}
        {textElements.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center">
              <Type className="w-4 h-4 mr-2" />
              Text Elements
            </h4>
            {textElements.map((element) => (
              <div
                key={element.id}
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  activeElement === element.id
                    ? 'border-crd-green bg-crd-green/10'
                    : 'border-gray-600 bg-editor-darker hover:border-gray-500'
                }`}
                onClick={() => setActiveElement(element.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium capitalize">
                    {element.type}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTextElement(element.id);
                    }}
                    className="text-gray-400 hover:text-red-400 h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <Input
                  value={element.content}
                  onChange={(e) => updateTextElement(element.id, { content: e.target.value })}
                  className="bg-editor-dark border-gray-600 text-white text-sm"
                  placeholder={`Enter ${element.type}...`}
                />
              </div>
            ))}
          </div>
        )}

        {textElements.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Type className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No text elements added</p>
            <p className="text-xs mt-1">Click the buttons above to add text</p>
          </div>
        )}
      </div>

      {/* Live Preview */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="aspect-[5/7] w-80 bg-gray-800 rounded-lg border border-gray-700 relative overflow-hidden">
          {/* Card background placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800"></div>
          
          {/* Text elements */}
          {textElements.map((element) => (
            <div
              key={element.id}
              className={`absolute text-white transition-all duration-200 cursor-pointer ${
                activeElement === element.id ? 'ring-1 ring-crd-green' : ''
              }`}
              style={{
                left: `${element.position.x}%`,
                top: `${element.position.y}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: element.type === 'name' ? '18px' : element.type === 'title' ? '14px' : '12px',
                fontWeight: element.type === 'name' ? 'bold' : 'normal'
              }}
              onClick={() => setActiveElement(element.id)}
            >
              {element.content}
            </div>
          ))}
          
          {/* Helper text */}
          {textElements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Type className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Add text elements to see preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
