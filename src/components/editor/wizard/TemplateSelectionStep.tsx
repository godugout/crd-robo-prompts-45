
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface TemplateSelectionStepProps {
  templates: DesignTemplate[];
  selectedTemplate: DesignTemplate | null;
  onTemplateSelect: (template: DesignTemplate) => void;
}

export const TemplateSelectionStep = ({ templates, selectedTemplate, onTemplateSelect }: TemplateSelectionStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Choose Your Template</h2>
        <p className="text-crd-lightGray">Select a design style that fits your vision</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className={`p-4 rounded-xl cursor-pointer transition-all border ${
              selectedTemplate?.id === template.id
                ? 'ring-2 ring-crd-green bg-editor-tool border-crd-green'
                : 'bg-editor-tool hover:bg-editor-border border-editor-border'
            }`}
          >
            <div className={`h-32 rounded-lg bg-gradient-to-br mb-3 ${
              template.id === 'classic' ? 'from-blue-500 to-purple-500' :
              template.id === 'vintage' ? 'from-amber-500 to-orange-500' :
              template.id === 'modern' ? 'from-green-500 to-teal-500' :
              'from-pink-500 to-purple-500'
            }`} />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">{template.name}</h3>
                {template.is_premium && (
                  <Badge className="bg-yellow-500 text-black">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-crd-lightGray text-sm">{template.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{template.usage_count} uses</span>
                <span>{template.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
