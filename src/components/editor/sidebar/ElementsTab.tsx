
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Type, Upload } from 'lucide-react';
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
}

export const ElementsTab = ({ searchQuery, onAddElement }: ElementsTabProps) => {
  const elements: Element[] = [
    { id: 'circle', name: 'Circle', icon: '●', color: 'text-blue-400', type: 'shape' },
    { id: 'square', name: 'Square', icon: '■', color: 'text-green-400', type: 'shape' },
    { id: 'triangle', name: 'Triangle', icon: '▲', color: 'text-purple-400', type: 'shape' },
    { id: 'star', name: 'Star', icon: '★', color: 'text-yellow-400', type: 'shape' },
    { id: 'diamond', name: 'Diamond', icon: '◆', color: 'text-pink-400', type: 'shape' },
    { id: 'hexagon', name: 'Hexagon', icon: '⬢', color: 'text-cyan-400', type: 'shape' },
    { id: 'title', name: 'Title Text', color: 'text-white', type: 'text' },
    { id: 'subtitle', name: 'Subtitle', color: 'text-gray-300', type: 'text' },
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

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-6">
        {/* Shapes Section */}
        <div>
          <h3 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Shapes</h3>
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

        {/* Text Elements Section */}
        <div>
          <h3 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Text</h3>
          <div className="space-y-2">
            {filteredElements.filter(el => el.type === 'text').map((textEl) => (
              <Button 
                key={textEl.id}
                variant="outline" 
                className="w-full justify-start bg-editor-tool border-editor-border text-white hover:bg-editor-border rounded-lg"
                onClick={() => handleElementClick(textEl)}
              >
                <Type className="w-4 h-4 mr-2" />
                Add {textEl.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Backgrounds Section */}
        <div>
          <h3 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Backgrounds</h3>
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
          <h3 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Upload Assets</h3>
          <div className="p-6 border-2 border-dashed border-editor-border rounded-xl text-center">
            <Upload className="w-12 h-12 text-crd-lightGray mb-4 mx-auto" />
            <p className="text-white font-medium mb-2">Upload Your Assets</p>
            <p className="text-xs text-crd-lightGray mb-4">
              Drag files here or click to browse
            </p>
            <Button className="bg-crd-green hover:bg-crd-green/90 rounded-lg">
              Browse Files
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
