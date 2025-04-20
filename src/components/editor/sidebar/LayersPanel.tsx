
import React from 'react';
import { Plus, Copy, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image, Square } from 'lucide-react';
import { toast } from 'sonner';
import { SidebarSection } from '../SidebarSection';

export const LayersPanel = () => {
  return (
    <SidebarSection title="Layers">
      <div className="space-y-2">
        <div className="p-2 rounded bg-editor-darker flex items-center justify-between">
          <span className="text-cardshow-white text-sm">Background</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-cardshow-lightGray hover:text-cardshow-white" onClick={() => toast('Add to background')}>
              <Plus size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-cardshow-lightGray hover:text-cardshow-white" onClick={() => toast('Delete background')}>
              <X size={14} />
            </Button>
          </div>
        </div>
        
        <div className="p-2 rounded bg-editor-tool flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-cardshow-green hover:bg-cardshow-green text-white px-1 py-0 h-4">
              <Image size={10} className="mr-1" />
              <span className="text-[10px]">IMG</span>
            </Badge>
            <span className="text-cardshow-white text-sm">Card Art</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-cardshow-lightGray hover:text-cardshow-white" onClick={() => toast('Duplicate card art')}>
              <Copy size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-cardshow-lightGray hover:text-cardshow-white" onClick={() => toast('Delete card art')}>
              <X size={14} />
            </Button>
          </div>
        </div>
        
        <div className="p-2 rounded bg-editor-darker flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-cardshow-orange hover:bg-cardshow-orange text-white px-1 py-0 h-4">
              <Square size={10} className="mr-1" />
              <span className="text-[10px]">FRM</span>
            </Badge>
            <span className="text-cardshow-white text-sm">Frame</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-cardshow-lightGray hover:text-cardshow-white" onClick={() => toast('Duplicate frame')}>
              <Copy size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-cardshow-lightGray hover:text-cardshow-white" onClick={() => toast('Delete frame')}>
              <X size={14} />
            </Button>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 text-xs font-medium border-dashed border-editor-border hover:bg-editor-darker"
          onClick={() => toast('Adding new layer')}
        >
          <Plus size={14} className="mr-1" />
          Add Layer
        </Button>
      </div>
    </SidebarSection>
  );
};
