
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { QuickTextEdit } from './elements/QuickTextEdit';
import { ShapesSection } from './elements/ShapesSection';
import { BackgroundsSection } from './elements/BackgroundsSection';
import { UploadSection } from './elements/UploadSection';

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

  const shapes = filteredElements.filter(el => el.type === 'shape');
  const backgrounds = filteredElements.filter(el => el.type === 'background');

  const handleElementClick = (element: Element) => {
    if (onAddElement) {
      onAddElement(element.type, element.id);
    } else {
      toast.success(`${element.name} added to canvas`);
    }
  };

  const handleTextUpdate = (field: string, value: string) => {
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

        <QuickTextEdit 
          onTextUpdate={handleTextUpdate}
          onSwitchToPreview={switchToPreviewMode}
        />

        <ShapesSection 
          shapes={shapes}
          onShapeClick={handleElementClick}
        />

        <BackgroundsSection 
          backgrounds={backgrounds}
          onBackgroundClick={handleElementClick}
        />

        <UploadSection />

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
