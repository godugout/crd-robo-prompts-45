
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryType {
  name: string;
  value: string;
}

interface FilterControlsProps {
  categories?: CategoryType[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  onFilterClick?: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  categories = [
    { name: 'All Items', value: 'all' },
    { name: 'Sports', value: 'sports' },
    { name: 'Comics', value: 'comics' },
    { name: 'Games', value: 'games' },
    { name: 'Music', value: 'music' },
    { name: 'Art', value: 'art' }
  ],
  activeCategory = 'all',
  onCategoryChange = () => {},
  onFilterClick = () => {}
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-2">
        <Button variant="outline" className="bg-crd-dark text-crd-white border-crd-mediumGray rounded-md">
          Recently added
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="m6 9 6 6 6-6"/></svg>
        </Button>

        <div className="flex rounded-md overflow-hidden ml-4">
          {categories.map((category, index) => (
            <Button 
              key={category.value}
              variant={category.value === activeCategory ? "default" : "outline"}
              className={`
                ${category.value === activeCategory ? 'bg-crd-blue text-crd-white' : 'bg-transparent text-crd-lightGray border-crd-mediumGray'} 
                ${index === 0 ? 'rounded-l-md rounded-r-none' : index === categories.length - 1 ? 'rounded-r-md rounded-l-none' : 'rounded-none'}
              `}
              onClick={() => onCategoryChange(category.value)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      <Button className="bg-crd-blue text-crd-white rounded-md flex items-center gap-2" onClick={onFilterClick}>
        <Filter size={16} />
        Filter
        <span className="ml-1 bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs">×</span>
      </Button>
    </div>
  );
};
