
export type TemplateCategory = 'Nostalgia' | 'Celebration' | 'Protest' | 'Community';

export interface OakTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  thumbnail: string;
  preview?: string;
  completionPercentage: number;
  era?: string;
  description?: string;
  tags: string[];
  isTrending?: boolean;
  lastUsed?: Date;
  isFavorite?: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
}

export interface TemplateFilterState {
  selectedCategory: TemplateCategory | 'All';
  searchQuery: string;
  showOnlyFavorites: boolean;
  sortBy: 'name' | 'recent' | 'trending' | 'completion';
}
