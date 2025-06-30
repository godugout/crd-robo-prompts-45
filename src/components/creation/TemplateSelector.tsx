
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, Clock, Star } from 'lucide-react';
import { OakTemplate } from '@/types/oakTemplates';

interface TemplateSelectorProps {
  templates: OakTemplate[];
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

const CATEGORIES = ['All', 'Nostalgia', 'Celebration', 'Community', 'Protest'] as const;

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const trendingTemplates = templates.filter(t => t.isTrending);
  const recentTemplates = templates.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Choose Your Template</h3>
        <p className="text-gray-400">Select a style that matches your vision</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-600 text-white"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category 
                  ? "bg-crd-green text-black" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Suggestions */}
      {searchTerm === '' && (
        <div className="space-y-4">
          {trendingTemplates.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-crd-green" />
                <h4 className="text-white font-medium">Trending Now</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {trendingTemplates.slice(0, 3).map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    onSelect={onTemplateSelect}
                    compact
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-400" />
              <h4 className="text-white font-medium">Recently Added</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {recentTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  onSelect={onTemplateSelect}
                  compact
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Templates Grid */}
      <div>
        <h4 className="text-white font-medium mb-4">
          {searchTerm ? `Search Results (${filteredTemplates.length})` : 'All Templates'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={onTemplateSelect}
            />
          ))}
        </div>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No templates found matching your criteria</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

interface TemplateCardProps {
  template: OakTemplate;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
  compact?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  isSelected, 
  onSelect, 
  compact = false 
}) => {
  return (
    <Card 
      className={`
        cursor-pointer transition-all duration-300 overflow-hidden
        ${isSelected 
          ? 'ring-2 ring-crd-green bg-crd-green/10 border-crd-green' 
          : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:border-gray-500'
        }
      `}
      onClick={() => onSelect(template.id)}
    >
      <div className="aspect-[3/4] relative">
        <img 
          src={template.thumbnail} 
          alt={template.name}
          className="w-full h-full object-cover"
        />
        {template.isTrending && (
          <Badge className="absolute top-2 right-2 bg-crd-green text-black">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        )}
        {template.completionPercentage && (
          <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
            {template.completionPercentage}% Complete
          </div>
        )}
      </div>
      
      {!compact && (
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white font-semibold text-sm">{template.name}</h3>
            <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
              {template.category}
            </Badge>
          </div>
          <p className="text-gray-400 text-xs mb-3 line-clamp-2">{template.description}</p>
          
          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="text-gray-400 text-xs">+{template.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
