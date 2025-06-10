
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Users } from 'lucide-react';
import type { TemplateConfig } from './wizardConfig';

interface TemplatePreviewProps {
  template: TemplateConfig;
  isSelected: boolean;
  onSelect: () => void;
}

export const TemplatePreview = ({ template, isSelected, onSelect }: TemplatePreviewProps) => {
  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-crd-green scale-105' 
          : 'hover:scale-102'
      }`}
      onClick={onSelect}
    >
      {/* Card Preview Container */}
      <div className="aspect-[3/4] bg-gradient-to-br from-crd-mediumGray to-crd-lightGray rounded-xl overflow-hidden shadow-lg">
        {/* Template Preview */}
        <div className="w-full h-full relative">
          {template.preview_url ? (
            <img 
              src={template.preview_url} 
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col justify-between p-4">
              {/* Mock template layout based on template data */}
              <div className="space-y-3">
                {template.template_data.layout === 'portrait' && (
                  <>
                    <div className="h-32 bg-crd-white/20 rounded border-2 border-crd-white/30" />
                    <div className="h-4 bg-crd-white/20 rounded" />
                    <div className="h-3 bg-crd-white/20 rounded w-3/4" />
                  </>
                )}
                {template.template_data.layout === 'minimal' && (
                  <>
                    <div className="h-40 bg-crd-white/10 rounded" />
                    <div className="h-3 bg-crd-white/20 rounded w-1/2" />
                  </>
                )}
                {template.template_data.layout === 'gaming' && (
                  <>
                    <div className="h-36 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded border border-yellow-400/50" />
                    <div className="h-4 bg-yellow-400/30 rounded" />
                  </>
                )}
                {template.template_data.layout === 'vintage' && (
                  <>
                    <div className="h-32 bg-sepia-200/30 rounded border-4 border-amber-800/30" />
                    <div className="h-4 bg-amber-800/30 rounded" />
                  </>
                )}
              </div>
              
              {/* Template effects preview */}
              {template.template_data.effects?.includes('holographic') && (
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-rainbow-400/20 to-transparent pointer-events-none" />
              )}
              {template.template_data.effects?.includes('glow') && (
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(59,130,246,0.3)] pointer-events-none" />
              )}
            </div>
          )}
          
          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
              <span className="text-crd-dark text-sm font-bold">✓</span>
            </div>
          )}
          
          {/* Premium Badge */}
          {template.is_premium && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-yellow-500 text-crd-dark font-bold">
                <Star className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Template Info */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-crd-white font-semibold text-sm">{template.name}</h3>
          <div className="flex items-center gap-1 text-xs text-crd-lightGray">
            <Users className="w-3 h-3" />
            <span>{template.usage_count}</span>
          </div>
        </div>
        
        <p className="text-crd-lightGray text-xs line-clamp-2">{template.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 2).map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs border-editor-border text-crd-lightGray px-1 py-0"
            >
              {tag}
            </Badge>
          ))}
          {template.tags.length > 2 && (
            <Badge
              variant="outline"
              className="text-xs border-editor-border text-crd-lightGray px-1 py-0"
            >
              +{template.tags.length - 2}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
