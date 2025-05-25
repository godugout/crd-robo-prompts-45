
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Zap, Star, Grid, TrendingUp, Users } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Items', icon: LayoutGrid },
  { id: 'sports', name: 'Sports', icon: Zap },
  { id: 'comics', name: 'Comics', icon: Star },
  { id: 'games', name: 'Games', icon: Grid },
  { id: 'music', name: 'Music', icon: TrendingUp },
  { id: 'art', name: 'Art', icon: Users },
];

interface CardsCategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CardsCategoryFilter: React.FC<CardsCategoryFilterProps> = ({
  activeCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={`${
              activeCategory === category.id
                ? 'bg-crd-blue text-white'
                : 'text-crd-lightGray border-crd-mediumGray hover:border-crd-blue'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {category.name}
          </Button>
        );
      })}
    </div>
  );
};
