
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Grid, Shapes, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FramesTab } from './sidebar/FramesTab';
import { ElementsTab } from './sidebar/ElementsTab';
import { EffectsTab } from './sidebar/EffectsTab';

interface EditorSidebarProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export const EditorSidebar = ({ selectedTemplate, onSelectTemplate }: EditorSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-80 bg-editor-darker border-r border-editor-border flex flex-col rounded-xl">
      {/* Search Bar */}
      <div className="p-4 border-b border-editor-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search design elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-editor-dark border-editor-border text-white rounded-xl"
          />
        </div>
      </div>
      
      {/* Tabbed Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="frames" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4 bg-editor-dark grid grid-cols-3">
            <TabsTrigger value="frames" className="text-xs">
              <Grid className="w-3 h-3 mr-1" />
              Frames
            </TabsTrigger>
            <TabsTrigger value="elements" className="text-xs">
              <Shapes className="w-3 h-3 mr-1" />
              Elements
            </TabsTrigger>
            <TabsTrigger value="effects" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Effects
            </TabsTrigger>
          </TabsList>

          {/* Frames Tab */}
          <TabsContent value="frames" className="flex-1 mt-4">
            <FramesTab 
              selectedTemplate={selectedTemplate}
              onSelectTemplate={onSelectTemplate}
              searchQuery={searchQuery}
            />
          </TabsContent>

          {/* Elements Tab */}
          <TabsContent value="elements" className="flex-1 mt-4">
            <ElementsTab searchQuery={searchQuery} />
          </TabsContent>

          {/* Effects Tab */}
          <TabsContent value="effects" className="flex-1 mt-4">
            <EffectsTab searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
