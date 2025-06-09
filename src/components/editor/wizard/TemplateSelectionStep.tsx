
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Sparkles, Star } from 'lucide-react';
import type { TemplateConfig } from './wizardConfig';

interface TemplateSelectionStepProps {
  templates: TemplateConfig[];
  selectedTemplate: TemplateConfig | null;
  onTemplateSelect: (template: TemplateConfig) => void;
}

export const TemplateSelectionStep = ({ 
  templates, 
  selectedTemplate, 
  onTemplateSelect 
}: TemplateSelectionStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-crd-white mb-2">Choose Your Template</h2>
        <p className="text-crd-lightGray">Select a design template that matches your style</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedTemplate?.id === template.id
                ? 'bg-crd-green/10 border-crd-green shadow-lg'
                : 'bg-editor-dark border-editor-border hover:border-crd-green/50'
            }`}
            onClick={() => onTemplateSelect(template)}
          >
            <CardContent className="p-4">
              {/* Template Preview */}
              <div className="aspect-[3/4] bg-gradient-to-br from-crd-mediumGray to-crd-lightGray rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                {template.preview_url ? (
                  <img 
                    src={template.preview_url} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Palette className="w-12 h-12 text-crd-lightGray mx-auto mb-2" />
                    <span className="text-crd-lightGray text-sm">{template.name}</span>
                  </div>
                )}
                
                {/* Selection indicator */}
                {selectedTemplate?.id === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                    <span className="text-crd-dark text-sm">✓</span>
                  </div>
                )}
                
                {/* Premium indicator */}
                {template.is_premium && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-yellow-500 text-crd-dark font-bold">
                      <Star className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="space-y-2">
                <h3 className="text-crd-white font-semibold">{template.name}</h3>
                <p className="text-crd-lightGray text-sm line-clamp-2">{template.description}</p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-editor-border text-crd-lightGray">
                    {template.category}
                  </Badge>
                  <span className="text-xs text-crd-lightGray">{template.usage_count} uses</span>
                </div>
                
                {/* Template Tags */}
                {template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs border-editor-border text-crd-lightGray"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs border-editor-border text-crd-lightGray"
                      >
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Select Button */}
              <Button
                className={`w-full mt-4 transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'bg-crd-green hover:bg-crd-green/90 text-crd-dark'
                    : 'bg-editor-border hover:bg-editor-border/80 text-crd-white'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTemplateSelect(template);
                }}
              >
                {selectedTemplate?.id === template.id ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Selected
                  </>
                ) : (
                  'Select Template'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="bg-editor-tool p-4 rounded-lg">
          <div className="flex items-center gap-2 text-crd-green mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Template Selected</span>
          </div>
          <p className="text-crd-lightGray text-xs">
            You've selected "{selectedTemplate.name}" template. This will be applied to your card design.
          </p>
        </div>
      )}
    </div>
  );
};
