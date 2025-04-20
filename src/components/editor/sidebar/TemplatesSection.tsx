
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateCard } from './TemplateCard';

interface Template {
  id: string;
  name: string;
  color: string;
  category: string;
}

interface TemplatesSectionProps {
  templates: Template[];
  selectedTemplate: string;
  onSelectTemplate: (id: string) => void;
  searchQuery: string;
}

export const TemplatesSection = ({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate,
  searchQuery 
}: TemplatesSectionProps) => {
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="featured">
        <TabsList className="bg-editor-darker w-full">
          <TabsTrigger value="featured" className="flex-1">Featured</TabsTrigger>
          <TabsTrigger value="popular" className="flex-1">Popular</TabsTrigger>
          <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
        </TabsList>
        <TabsContent value="featured" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredTemplates
                .filter(t => t.category === 'featured')
                .map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    onSelect={onSelectTemplate}
                  />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="popular" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredTemplates
                .filter(t => t.category === 'popular')
                .map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    onSelect={onSelectTemplate}
                  />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="recent" className="mt-4">
          <div className="flex flex-col items-center justify-center py-8 text-cardshow-lightGray">
            <p>No recent templates</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
