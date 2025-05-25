
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface Frame {
  id: string;
  name: string;
  preview: string;
  category: string;
  gradient: string;
}

interface FramesTabProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  searchQuery: string;
}

export const FramesTab = ({ selectedTemplate, onSelectTemplate, searchQuery }: FramesTabProps) => {
  const frames: Frame[] = [
    { 
      id: 'template1', 
      name: 'Cardshow Nostalgia', 
      preview: '/placeholder.svg',
      category: 'featured',
      gradient: 'from-green-500 to-blue-500'
    },
    { 
      id: 'template2', 
      name: 'Classic Cardboard', 
      preview: '/placeholder.svg',
      category: 'featured',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      id: 'template3', 
      name: 'Nifty Framework', 
      preview: '/placeholder.svg',
      category: 'popular',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'template4', 
      name: 'Synthwave Dreams', 
      preview: '/placeholder.svg',
      category: 'popular',
      gradient: 'from-cyan-500 to-purple-500'
    }
  ];

  const filteredFrames = frames.filter(frame => 
    frame.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-4">
        <h3 className="text-white font-medium text-sm uppercase tracking-wide">Card Frames</h3>
        <div className="grid grid-cols-2 gap-3">
          {filteredFrames.map((frame) => (
            <div 
              key={frame.id}
              className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${
                selectedTemplate === frame.id
                  ? 'ring-2 ring-crd-green shadow-lg scale-105' 
                  : 'hover:scale-102 hover:shadow-md'
              }`}
              onClick={() => {
                onSelectTemplate(frame.id);
                toast.success(`Frame "${frame.name}" applied`);
              }}
            >
              <div className={`aspect-[3/4] bg-gradient-to-br ${frame.gradient} flex items-center justify-center`}>
                <div className="text-white font-bold text-xs opacity-80">FRAME</div>
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-white text-xs font-medium truncate">{frame.name}</p>
              </div>
              {selectedTemplate === frame.id && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-crd-green rounded-full shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};
