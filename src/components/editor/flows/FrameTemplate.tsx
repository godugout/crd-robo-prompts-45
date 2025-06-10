
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

export interface FrameTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_url?: string;
  cutout_areas: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'photo' | 'text' | 'logo';
    placeholder?: string;
  }>;
  default_colors: {
    background: string;
    border: string;
    text: string;
  };
  effects?: string[];
  tags: string[];
}

interface FrameTemplatePreviewProps {
  template: FrameTemplate;
  isSelected: boolean;
  onSelect: () => void;
}

export const FrameTemplatePreview: React.FC<FrameTemplatePreviewProps> = ({
  template,
  isSelected,
  onSelect
}) => {
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-crd-green scale-105 bg-editor-tool' 
          : 'bg-editor-dark hover:bg-editor-tool'
      } border-editor-border`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        {/* Frame Preview */}
        <div className="aspect-[3/4] bg-gradient-to-br from-crd-mediumGray to-crd-lightGray rounded-lg mb-4 relative overflow-hidden">
          {template.preview_url ? (
            <img 
              src={template.preview_url} 
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full relative"
              style={{ backgroundColor: template.default_colors.background }}
            >
              {/* Render cutout areas as placeholders */}
              {template.cutout_areas.map((area) => (
                <div
                  key={area.id}
                  className={`absolute border-2 border-dashed rounded ${
                    area.type === 'photo' ? 'border-crd-blue bg-crd-blue/10' :
                    area.type === 'text' ? 'border-crd-green bg-crd-green/10' :
                    'border-crd-orange bg-crd-orange/10'
                  }`}
                  style={{
                    left: `${area.x}%`,
                    top: `${area.y}%`,
                    width: `${area.width}%`,
                    height: `${area.height}%`,
                  }}
                >
                  <div className="flex items-center justify-center h-full text-xs text-crd-lightGray">
                    {area.placeholder || area.type}
                  </div>
                </div>
              ))}
              
              {/* Frame border */}
              <div 
                className="absolute inset-2 border-4 rounded"
                style={{ borderColor: template.default_colors.border }}
              />
            </div>
          )}
          
          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-crd-dark" />
            </div>
          )}
        </div>

        {/* Template Info */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-crd-white font-semibold text-sm">{template.name}</h3>
            <Badge variant="outline" className="text-xs border-editor-border text-crd-lightGray">
              {template.category}
            </Badge>
          </div>
          
          <p className="text-crd-lightGray text-xs mb-3">{template.description}</p>
          
          {/* Features */}
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs border-crd-blue/30 text-crd-blue">
              {template.cutout_areas.filter(a => a.type === 'photo').length} Photo
            </Badge>
            <Badge variant="outline" className="text-xs border-crd-green/30 text-crd-green">
              {template.cutout_areas.filter(a => a.type === 'text').length} Text
            </Badge>
            {template.effects && template.effects.length > 0 && (
              <Badge variant="outline" className="text-xs border-crd-purple/30 text-crd-purple">
                Effects
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
