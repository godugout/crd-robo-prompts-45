
import React from 'react';
import { Image, Type, Square, LayoutGrid, Star } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SidebarSection } from '../SidebarSection';

export const DesignElements = () => {
  return (
    <SidebarSection title="Card Design Elements">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-cardshow-lightGray uppercase">Background</Label>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i}
                className={`aspect-square rounded cursor-pointer hover:ring-1 hover:ring-cardshow-blue transition-all ${
                  i === 0 ? 'bg-gradient-to-br from-editor-darker to-editor-tool border-2 border-cardshow-green' :
                  i === 1 ? 'bg-gradient-to-br from-purple-800 to-blue-600' :
                  i === 2 ? 'bg-gradient-to-br from-red-600 to-orange-500' :
                  i === 3 ? 'bg-gradient-to-br from-green-600 to-teal-500' :
                  'bg-gradient-to-br from-blue-700 to-indigo-800'
                }`}
                onClick={() => toast(`Background ${i+1} selected`)}
              ></div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-xs text-cardshow-lightGray uppercase">Elements</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button variant="outline" size="icon" className="p-2 rounded bg-editor-darker hover:bg-editor-tool text-cardshow-lightGray" onClick={() => toast('Image tool selected')}>
              <Image size={20} />
            </Button>
            <Button variant="outline" size="icon" className="p-2 rounded bg-editor-darker hover:bg-editor-tool text-cardshow-lightGray" onClick={() => toast('Text tool selected')}>
              <Type size={20} />
            </Button>
            <Button variant="outline" size="icon" className="p-2 rounded bg-editor-darker hover:bg-editor-tool text-cardshow-lightGray" onClick={() => toast('Shape tool selected')}>
              <Square size={20} />
            </Button>
            <Button variant="outline" size="icon" className="p-2 rounded bg-editor-darker hover:bg-editor-tool text-cardshow-lightGray" onClick={() => toast('Grid tool selected')}>
              <LayoutGrid size={20} />
            </Button>
            <Button variant="outline" size="icon" className="p-2 rounded bg-editor-darker hover:bg-editor-tool text-cardshow-lightGray" onClick={() => toast('Sticker tool selected')}>
              <Star size={20} />
            </Button>
          </div>
        </div>
      </div>
    </SidebarSection>
  );
};
