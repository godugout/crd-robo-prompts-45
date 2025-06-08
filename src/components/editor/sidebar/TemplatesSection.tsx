
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateCard } from './TemplateCard';
import { DEFAULT_TEMPLATES } from '../wizard/wizardConfig';

interface TemplatesSectionProps {
  selectedTemplate: string;
  onSelectTemplate: (id: string) => void;
  searchQuery: string;
}

export const TemplatesSection = ({ 
  selectedTemplate, 
  onSelectTemplate,
  searchQuery 
}: TemplatesSectionProps) => {
  const filteredTemplates = DEFAULT_TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTemplatesByCategory = (category: string) => {
    return filteredTemplates.filter(t => t.category === category);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="classic">
        <TabsList className="bg-editor-darker w-full grid grid-cols-4">
          <TabsTrigger value="classic" className="text-xs">Classic</TabsTrigger>
          <TabsTrigger value="modern" className="text-xs">Modern</TabsTrigger>
          <TabsTrigger value="full-bleed" className="text-xs">Photo</TabsTrigger>
          <TabsTrigger value="social" className="text-xs">Social</TabsTrigger>
        </TabsList>
        
        <TabsContent value="classic" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {getTemplatesByCategory('classic').map((template) => (
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
        
        <TabsContent value="modern" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {getTemplatesByCategory('modern').map((template) => (
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
        
        <TabsContent value="full-bleed" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {getTemplatesByCategory('full-bleed').map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  onSelect={onSelectTemplate}
                />
              ))}
              {getTemplatesByCategory('full-bleed').length === 0 && (
                <div className="text-center text-crd-lightGray py-8">
                  <p>No photo templates found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="social" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {getTemplatesByCategory('full-bleed').filter(t => t.template_data.supports_stickers).map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  onSelect={onSelectTemplate}
                />
              ))}
              <div className="text-xs text-crd-lightGray p-3 bg-editor-darker rounded">
                💡 Social templates let you add stickers and custom elements to your photos!
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
