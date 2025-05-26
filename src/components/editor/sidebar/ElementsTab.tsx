
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Type, Upload, ArrowRight, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Element {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  type: 'shape' | 'text' | 'background';
  gradient?: string;
}

interface ElementsTabProps {
  searchQuery: string;
  onAddElement?: (elementType: string, elementId: string) => void;
  onElementsComplete?: () => void;
}

export const ElementsTab = ({ searchQuery, onAddElement, onElementsComplete }: ElementsTabProps) => {
  const [cardText, setCardText] = useState({
    title: 'Card Title',
    subtitle: 'Subtitle text',
    description: 'Card description goes here...'
  });

  const elements: Element[] = [
    { id: 'circle', name: 'Circle', icon: '●', color: 'text-blue-400', type: 'shape' },
    { id: 'square', name: 'Square', icon: '■', color: 'text-green-400', type: 'shape' },
    { id: 'triangle', name: 'Triangle', icon: '▲', color: 'text-purple-400', type: 'shape' },
    { id: 'star', name: 'Star', icon: '★', color: 'text-yellow-400', type: 'shape' },
    { id: 'diamond', name: 'Diamond', icon: '◆', color: 'text-pink-400', type: 'shape' },
    { id: 'hexagon', name: 'Hexagon', icon: '⬢', color: 'text-cyan-400', type: 'shape' },
    { id: 'galaxy-nebula', name: 'Galaxy Nebula', gradient: 'from-purple-900 via-blue-900 to-purple-800', type: 'background' },
    { id: 'sunset-glow', name: 'Sunset Glow', gradient: 'from-orange-500 via-red-500 to-pink-500', type: 'background' },
    { id: 'ocean-deep', name: 'Ocean Deep', gradient: 'from-blue-600 via-cyan-500 to-teal-400', type: 'background' },
    { id: 'forest-mist', name: 'Forest Mist', gradient: 'from-green-600 via-emerald-500 to-green-400', type: 'background' }
  ];

  const filteredElements = elements.filter(element => 
    element.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleElementClick = (element: Element) => {
    if (onAddElement) {
      onAddElement(element.type, element.id);
    } else {
      toast.success(`${element.name} added to canvas`);
    }
  };

  const handleTextUpdate = (field: keyof typeof cardText, value: string) => {
    setCardText(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Send update to the main preview area
    window.dispatchEvent(new CustomEvent('cardTextUpdate', { 
      detail: { field, value } 
    }));
  };

  const switchToPreviewMode = () => {
    // Signal the main canvas to switch to preview mode
    window.dispatchEvent(new CustomEvent('switchToPreview'));
    toast.success('Switched to preview mode - edit text directly on the card!');
  };

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Customize Elements</h3>
          <p className="text-crd-lightGray text-sm">
            Edit text and add elements to personalize your card
          </p>
        </div>

        {/* Quick Text Edit Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium text-sm uppercase tracking-wide">Quick Text Edit</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={switchToPreviewMode}
              className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview Mode
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-white text-sm font-medium">Card Title</label>
              <Input
                value={cardText.title}
                onChange={(e) => handleTextUpdate('title', e.target.value)}
                className="mt-1 bg-editor-dark border-editor-border text-white"
                placeholder="Enter card title..."
              />
            </div>
            
            <div>
              <label className="text-white text-sm font-medium">Subtitle</label>
              <Input
                value={cardText.subtitle}
                onChange={(e) => handleTextUpdate('subtitle', e.target.value)}
                className="mt-1 bg-editor-dark border-editor-border text-white"
                placeholder="Enter subtitle..."
              />
            </div>
            
            <div>
              <label className="text-white text-sm font-medium">Description</label>
              <Textarea
                value={cardText.description}
                onChange={(e) => handleTextUpdate('description', e.target.value)}
                className="mt-1 bg-editor-dark border-editor-border text-white resize-none"
                placeholder="Enter card description..."
                rows={3}
              />
            </div>
          </div>

          <div className="p-3 bg-crd-green/10 border border-crd-green/30 rounded-lg">
            <p className="text-crd-green text-xs">
              💡 Tip: Use Preview Mode to edit text directly on the card for real-time visual feedback!
            </p>
          </div>
        </div>

        {/* Shapes Section */}
        <div>
          <h4 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Add Shapes</h4>
          <div className="grid grid-cols-3 gap-3">
            {filteredElements.filter(el => el.type === 'shape').map((shape) => (
              <div 
                key={shape.id}
                className="group cursor-pointer rounded-xl bg-editor-tool hover:bg-editor-border transition-colors p-4 flex flex-col items-center gap-2"
                onClick={() => handleElementClick(shape)}
              >
                <div className={`text-2xl ${shape.color} font-bold`}>
                  {shape.icon}
                </div>
                <p className="text-white text-xs font-medium text-center">{shape.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Backgrounds Section */}
        <div>
          <h4 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Backgrounds</h4>
          <div className="grid grid-cols-2 gap-2">
            {filteredElements.filter(el => el.type === 'background').map((bg) => (
              <div 
                key={bg.id}
                className="group cursor-pointer rounded-lg overflow-hidden aspect-square transition-all hover:scale-105 hover:shadow-lg"
                onClick={() => handleElementClick(bg)}
              >
                <div className={`w-full h-full bg-gradient-to-br ${bg.gradient} flex items-center justify-center`}>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium text-center">
                    {bg.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div>
          <h4 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Upload Assets</h4>
          <div className="p-6 border-2 border-dashed border-editor-border rounded-xl text-center">
            <Upload className="w-12 h-12 text-crd-lightGray mb-4 mx-auto" />
            <p className="text-white font-medium mb-2">Upload Your Assets</p>
            <p className="text-xs text-crd-lightGray mb-4">
              Drag files here or click to browse
            </p>
            <Button className="bg-crd-green hover:bg-crd-green/90 rounded-lg text-black">
              Browse Files
            </Button>
          </div>
        </div>

        {/* Continue Button */}
        <div className="pt-4 border-t border-editor-border">
          <Button 
            className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium" 
            onClick={onElementsComplete}
          >
            Continue to Preview
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};
