
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EFFECT_CATEGORIES } from './effectCategories';

interface EffectCategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const EffectCategoryTabs: React.FC<EffectCategoryTabsProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <TabsList className="grid w-full grid-cols-4 bg-black/30 p-1">
      {EFFECT_CATEGORIES.map((category) => (
        <TabsTrigger
          key={category.id}
          value={category.id}
          onClick={() => onCategoryChange(category.id)}
          className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-white text-xs"
        >
          <div className="flex items-center gap-1">
            <category.icon className="w-3 h-3" />
            <span className="hidden sm:inline">{category.name}</span>
          </div>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
