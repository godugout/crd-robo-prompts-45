
import React, { useState } from 'react';
import { LayeredTemplatePreview } from './LayeredTemplatePreview';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Layers, Grid, List } from 'lucide-react';
import { OAK_LAYERED_TEMPLATES } from '@/data/oakLayeredTemplates';
import { LayeredTemplate } from '@/types/layeredTemplate';

interface EnhancedTemplateGalleryProps {
  selectedTemplate?: string;
  onSelectTemplate: (template: LayeredTemplate) => void;
}

export const EnhancedTemplateGallery: React.FC<EnhancedTemplateGalleryProps> = ({
  selectedTemplate,
  onSelectTemplate
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'layers'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'nostalgia', 'celebration', 'protest', 'community'];
  
  const filteredTemplates = selectedCategory === 'all' 
    ? OAK_LAYERED_TEMPLATES 
    : OAK_LAYERED_TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#ffd700] mb-2">
            4-Layer Oakland A's Templates
          </h2>
          <p className="text-white/80">
            Each template includes Image, Frame, Stickers, and Effects layers
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'layers' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('layers')}
          >
            <Layers className="w-4 h-4 mr-2" />
            Layers
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className={`cursor-pointer transition-colors ${
              selectedCategory === category 
                ? 'bg-crd-green text-black' 
                : 'border-[#ffd700] text-[#ffd700] hover:bg-[#ffd700] hover:text-black'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        ))}
      </div>

      {/* Templates Grid */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 lg:grid-cols-4' 
          : 'grid-cols-1 lg:grid-cols-2'
      }`}>
        {filteredTemplates.map((template) => (
          <LayeredTemplatePreview
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onSelect={() => onSelectTemplate(template)}
            compact={viewMode === 'grid'}
          />
        ))}
      </div>

      {/* Layer Information Panel */}
      <div className="bg-editor-dark border border-editor-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#ffd700] mb-4 flex items-center">
          <Layers className="w-5 h-5 mr-2" />
          4-Layer System Explained
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4">
            <h4 className="font-medium text-blue-400 mb-2">🖼️ Image Layer</h4>
            <p className="text-sm text-white/70">
              Your uploaded photo serves as the background foundation for the card.
            </p>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
            <h4 className="font-medium text-green-400 mb-2">🖼️ Frame Layer</h4>
            <p className="text-sm text-white/70">
              Card design with cutout areas, borders, padding, and 2-3 text placement zones.
            </p>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4">
            <h4 className="font-medium text-yellow-400 mb-2">⭐ Stickers Layer</h4>
            <p className="text-sm text-white/70">
              Name plates, trophies, logos, borders, and preset skin combinations.
            </p>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-500/30 rounded p-4">
            <h4 className="font-medium text-purple-400 mb-2">✨ Effects Layer</h4>
            <p className="text-sm text-white/70">
              Visual effects like hologram, ice, starlight, prism that enhance the card's look.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
