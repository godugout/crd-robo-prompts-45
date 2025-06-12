
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Star, Calendar, Tag } from 'lucide-react';
import { OakTemplate } from '@/types/oakTemplates';

interface TemplatePreviewModalProps {
  template: OakTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate?: (template: OakTemplate) => void;
  onFavorite?: (template: OakTemplate) => void;
}

const CATEGORY_COLORS = {
  'Nostalgia': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Celebration': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Protest': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Community': 'bg-blue-500/20 text-blue-300 border-blue-500/30'
};

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onSelectTemplate,
  onFavorite
}) => {
  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700 text-white p-0">
        <div className="flex h-[600px]">
          {/* Image Preview */}
          <div className="flex-1 relative">
            <img
              src={template.preview || template.thumbnail}
              alt={template.name}
              className="w-full h-full object-cover"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 p-0 bg-black/70 hover:bg-black/90 text-white rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Template Details */}
          <div className="w-80 p-6 bg-gray-800 flex flex-col">
            <div className="flex-1">
              {/* Header */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white mb-2">
                  {template.name}
                </h2>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={CATEGORY_COLORS[template.category]}>
                    {template.category}
                  </Badge>
                  <Badge className="bg-black/70 text-white">
                    {template.completionPercentage}%
                  </Badge>
                </div>
              </div>

              {/* Description */}
              {template.description && (
                <div className="mb-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {template.description}
                  </p>
                </div>
              )}

              {/* Era */}
              {template.era && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Era:</span>
                    <span className="text-[#ffd700]">{template.era}</span>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Colors</h4>
                <div className="flex gap-2">
                  <div
                    className="w-8 h-8 rounded border border-gray-600"
                    style={{ backgroundColor: template.colors.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-8 h-8 rounded border border-gray-600"
                    style={{ backgroundColor: template.colors.secondary }}
                    title="Secondary"
                  />
                  {template.colors.accent && (
                    <div
                      className="w-8 h-8 rounded border border-gray-600"
                      style={{ backgroundColor: template.colors.accent }}
                      title="Accent"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => {
                  onSelectTemplate?.(template);
                  onClose();
                }}
                className="w-full bg-[#ffd700] text-[#0f4c3a] hover:bg-[#ffd700]/90 font-medium"
              >
                Use This Template
              </Button>
              
              <Button
                variant="outline"
                onClick={() => onFavorite?.(template)}
                className="w-full border-gray-600 text-gray-300 hover:border-[#ffd700] hover:text-[#ffd700]"
              >
                <Star className={`w-4 h-4 mr-2 ${template.isFavorite ? 'fill-current text-[#ffd700]' : ''}`} />
                {template.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
