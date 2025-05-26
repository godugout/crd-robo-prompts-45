
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, LayoutGrid, Grid } from "lucide-react";

type ViewMode = 'feed' | 'grid' | 'masonry';

interface CardsViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const CardsViewModeToggle: React.FC<CardsViewModeToggleProps> = ({
  value,
  onChange,
}) => {
  return (
    <ToggleGroup 
      type="single" 
      value={value} 
      onValueChange={(val) => val && onChange(val as ViewMode)}
      className="bg-crd-medium-dark border border-crd-medium rounded-lg p-1 gap-1"
    >
      <ToggleGroupItem 
        value="feed" 
        aria-label="Feed View"
        className="data-[state=on]:bg-crd-blue data-[state=on]:text-white text-crd-light hover:text-crd-lightest hover:bg-crd-medium transition-all duration-200 h-10 w-10 rounded-md"
      >
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="grid" 
        aria-label="Grid View"
        className="data-[state=on]:bg-crd-blue data-[state=on]:text-white text-crd-light hover:text-crd-lightest hover:bg-crd-medium transition-all duration-200 h-10 w-10 rounded-md"
      >
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="masonry" 
        aria-label="Masonry View"
        className="data-[state=on]:bg-crd-blue data-[state=on]:text-white text-crd-light hover:text-crd-lightest hover:bg-crd-medium transition-all duration-200 h-10 w-10 rounded-md"
      >
        <Grid className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
