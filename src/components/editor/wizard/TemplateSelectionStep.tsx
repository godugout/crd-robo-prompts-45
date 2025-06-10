
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Palette, ArrowRight } from 'lucide-react';
import { TemplatePreview } from './TemplatePreview';
import { TemplateFilters } from './TemplateFilters';
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(templates.map(t => t.category))).sort();
  }, [templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      // Category filter
      if (selectedCategory && template.category !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          template.name.toLowerCase().includes(search) ||
          template.description.toLowerCase().includes(search) ||
          template.tags.some(tag => tag.toLowerCase().includes(search))
        );
      }
      
      // Premium filter
      if (showPremiumOnly && !template.is_premium) {
        return false;
      }
      
      return true;
    });
  }, [templates, selectedCategory, searchTerm, showPremiumOnly]);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    setShowPremiumOnly(false);
  };

  const handleTemplateSelect = (template: TemplateConfig) => {
    onTemplateSelect(template);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-crd-white mb-2">Choose Your Template</h2>
        <p className="text-crd-lightGray">Select a design template that matches your style and vision</p>
      </div>

      {/* Template Filters */}
      <TemplateFilters
        categories={categories}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        showPremiumOnly={showPremiumOnly}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchTerm}
        onPremiumToggle={setShowPremiumOnly}
        onClearFilters={handleClearFilters}
      />

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-crd-lightGray text-sm">
          Showing {filteredTemplates.length} of {templates.length} templates
        </p>
        
        {selectedTemplate && (
          <Badge className="bg-crd-green/20 text-crd-green border-crd-green">
            <Sparkles className="w-3 h-3 mr-1" />
            {selectedTemplate.name} Selected
          </Badge>
        )}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <TemplatePreview
              key={template.id}
              template={template}
              isSelected={selectedTemplate?.id === template.id}
              onSelect={() => handleTemplateSelect(template)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Palette className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
          <h3 className="text-crd-white font-medium mb-2">No templates found</h3>
          <p className="text-crd-lightGray text-sm mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="border-editor-border text-crd-lightGray hover:text-white"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Selection Guidance */}
      {selectedTemplate && (
        <div className="bg-editor-tool p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex-shrink-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-crd-green" />
            </div>
            <div className="flex-1">
              <h3 className="text-crd-white font-medium mb-1">
                Perfect choice! "{selectedTemplate.name}" template selected
              </h3>
              <p className="text-crd-lightGray text-sm mb-3">
                This {selectedTemplate.category.toLowerCase()} template has been used {selectedTemplate.usage_count} times and will give your card a professional look.
              </p>
              
              {/* Template Features */}
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.tags.slice(0, 4).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs border-crd-green/30 text-crd-green"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <ArrowRight className="w-5 h-5 text-crd-green" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Start Hint */}
      {!selectedTemplate && filteredTemplates.length > 0 && (
        <div className="bg-editor-darker p-4 rounded-lg border border-editor-border">
          <div className="flex items-center gap-2 text-crd-lightGray text-sm">
            <Sparkles className="w-4 h-4" />
            <span>💡 Tip: Popular templates like "Classic Portrait" and "Modern Minimal" work great for most photos</span>
          </div>
        </div>
      )}
    </div>
  );
};
