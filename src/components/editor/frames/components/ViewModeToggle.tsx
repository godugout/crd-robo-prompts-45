
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, Layout, Eye } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: 'carousel' | 'gallery' | 'showcase';
  onViewModeChange: (mode: 'carousel' | 'gallery' | 'showcase') => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="absolute top-4 right-4 z-20 flex gap-2">
      <Button
        onClick={() => onViewModeChange('showcase')}
        variant={viewMode === 'showcase' ? 'default' : 'outline'}
        size="sm"
        className={`${
          viewMode === 'showcase'
            ? 'bg-crd-green text-black'
            : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
        } backdrop-blur-sm`}
      >
        <Eye className="w-4 h-4 mr-1" />
        Showcase
      </Button>
      <Button
        onClick={() => onViewModeChange('carousel')}
        variant={viewMode === 'carousel' ? 'default' : 'outline'}
        size="sm"
        className={`${
          viewMode === 'carousel'
            ? 'bg-crd-green text-black'
            : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
        } backdrop-blur-sm`}
      >
        <Layout className="w-4 h-4 mr-1" />
        Carousel
      </Button>
      <Button
        onClick={() => onViewModeChange('gallery')}
        variant={viewMode === 'gallery' ? 'default' : 'outline'}
        size="sm"
        className={`${
          viewMode === 'gallery'
            ? 'bg-crd-green text-black'
            : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
        } backdrop-blur-sm`}
      >
        <Grid3X3 className="w-4 h-4 mr-1" />
        Gallery
      </Button>
    </div>
  );
};
