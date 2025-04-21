
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, LayoutGrid, Grid, GalleryHorizontal } from "lucide-react";

type ViewMode = 'feed' | 'grid' | 'masonry' | 'gallery';

interface CardsViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const CardsViewModeToggle: React.FC<CardsViewModeToggleProps> = ({
  value,
  onChange,
}) => {
  return (
    <ToggleGroup type="single" value={value} onValueChange={(val) => val && onChange(val as ViewMode)}>
      <ToggleGroupItem value="feed" aria-label="Feed View">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid View">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="masonry" aria-label="Masonry View">
        <Grid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="gallery" aria-label="Gallery View">
        <GalleryHorizontal className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
