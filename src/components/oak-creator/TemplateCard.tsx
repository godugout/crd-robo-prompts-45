
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Clock } from 'lucide-react';
import { OakTemplate } from '@/types/oakTemplates';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: OakTemplate;
  isSelected?: boolean;
  onSelect?: (template: OakTemplate) => void;
  onPreview?: (template: OakTemplate) => void;
  onFavorite?: (template: OakTemplate) => void;
}

const CATEGORY_COLORS = {
  'Nostalgia': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Celebration': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Protest': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Community': 'bg-blue-500/20 text-blue-300 border-blue-500/30'
};

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected = false,
  onSelect,
  onPreview,
  onFavorite
}) => {
  return (
    <div
      className={cn(
        "group cursor-pointer bg-gray-800 rounded-lg overflow-hidden border transition-all duration-200 hover:scale-105",
        isSelected 
          ? "border-[#ffd700] ring-2 ring-[#ffd700]/50" 
          : "border-gray-700 hover:border-[#ffd700]"
      )}
      onClick={() => onSelect?.(template)}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
        />
        
        {/* Completion Badge */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-black/70 text-white text-xs">
            {template.completionPercentage}%
          </Badge>
        </div>

        {/* Indicators */}
        <div className="absolute top-2 right-2 flex gap-1">
          {template.isTrending && (
            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
          )}
          {template.isFavorite && (
            <div className="w-6 h-6 rounded-full bg-[#ffd700] flex items-center justify-center">
              <Star className="w-3 h-3 text-[#0f4c3a] fill-current" />
            </div>
          )}
          {template.lastUsed && (
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <Clock className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview?.(template);
              }}
              className="px-3 py-1 bg-white/90 text-black text-xs rounded hover:bg-white transition-colors"
            >
              Preview
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite?.(template);
              }}
              className="px-3 py-1 bg-[#ffd700] text-[#0f4c3a] text-xs rounded hover:bg-[#ffd700]/90 transition-colors"
            >
              {template.isFavorite ? 'Unfavorite' : 'Favorite'}
            </button>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white text-sm font-medium line-clamp-1">
            {template.name}
          </h3>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <Badge className={CATEGORY_COLORS[template.category]}>
            {template.category}
          </Badge>
          {template.era && (
            <span className="text-gray-400 text-xs">
              {template.era}
            </span>
          )}
        </div>

        {template.description && (
          <p className="text-gray-400 text-xs line-clamp-2 mb-2">
            {template.description}
          </p>
        )}

        {/* Tags */}
        {template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
            {template.tags.length > 2 && (
              <span className="text-gray-500 text-xs">
                +{template.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
