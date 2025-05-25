
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileImage, Upload, Layers, Grid, Palette, Type, Shapes } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EditorSidebarProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export const EditorSidebar = ({ selectedTemplate, onSelectTemplate }: EditorSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const templates = [
    { 
      id: 'template1', 
      name: 'Cardshow Nostalgia', 
      preview: '/placeholder.svg',
      category: 'featured',
      gradient: 'from-green-500 to-blue-500'
    },
    { 
      id: 'template2', 
      name: 'Classic Cardboard', 
      preview: '/placeholder.svg',
      category: 'featured',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      id: 'template3', 
      name: 'Nifty Framework', 
      preview: '/placeholder.svg',
      category: 'popular',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'template4', 
      name: 'Synthwave Dreams', 
      preview: '/placeholder.svg',
      category: 'popular',
      gradient: 'from-cyan-500 to-purple-500'
    }
  ];

  const assets = [
    { id: 'asset1', name: 'Galaxy Background', preview: '/placeholder.svg', category: 'backgrounds' },
    { id: 'asset2', name: 'Tech Grid', preview: '/placeholder.svg', category: 'backgrounds' },
    { id: 'asset3', name: 'Lightning Effect', preview: '/placeholder.svg', category: 'effects' },
    { id: 'asset4', name: 'Particle Burst', preview: '/placeholder.svg', category: 'effects' }
  ];

  const designElements = [
    { id: 'shape1', name: 'Circle', icon: '●', color: 'text-blue-400' },
    { id: 'shape2', name: 'Square', icon: '■', color: 'text-green-400' },
    { id: 'shape3', name: 'Triangle', icon: '▲', color: 'text-purple-400' },
    { id: 'text1', name: 'Title Text', icon: 'T', color: 'text-orange-400' }
  ];

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-editor-darker border-r border-editor-border flex flex-col rounded-xl">
      {/* Search Bar */}
      <div className="p-4 border-b border-editor-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates, assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-editor-dark border-editor-border text-white rounded-xl"
          />
        </div>
      </div>
      
      {/* Tabbed Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="templates" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4 bg-editor-dark grid grid-cols-4">
            <TabsTrigger value="templates" className="text-xs">
              <Grid className="w-3 h-3 mr-1" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="assets" className="text-xs">
              <FileImage className="w-3 h-3 mr-1" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="elements" className="text-xs">
              <Shapes className="w-3 h-3 mr-1" />
              Elements
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-xs">
              <Upload className="w-3 h-3 mr-1" />
              Upload
            </TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="flex-1 mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4">
                <h3 className="text-white font-medium text-sm uppercase tracking-wide">Featured Templates</h3>
                <div className="grid grid-cols-2 gap-3">
                  {filteredTemplates.filter(t => t.category === 'featured').map((template) => (
                    <div 
                      key={template.id}
                      className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? 'ring-2 ring-crd-green shadow-lg scale-105' 
                          : 'hover:scale-102 hover:shadow-md'
                      }`}
                      onClick={() => {
                        onSelectTemplate(template.id);
                        toast.success(`Template "${template.name}" selected`);
                      }}
                    >
                      <div className={`aspect-[3/4] bg-gradient-to-br ${template.gradient} flex items-center justify-center`}>
                        <div className="text-white font-bold text-xs opacity-80">PREVIEW</div>
                      </div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-white text-xs font-medium truncate">{template.name}</p>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-crd-green rounded-full shadow-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <h3 className="text-white font-medium text-sm uppercase tracking-wide mt-6">Popular Templates</h3>
                <div className="grid grid-cols-2 gap-3">
                  {filteredTemplates.filter(t => t.category === 'popular').map((template) => (
                    <div 
                      key={template.id}
                      className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? 'ring-2 ring-crd-green shadow-lg scale-105' 
                          : 'hover:scale-102 hover:shadow-md'
                      }`}
                      onClick={() => {
                        onSelectTemplate(template.id);
                        toast.success(`Template "${template.name}" selected`);
                      }}
                    >
                      <div className={`aspect-[3/4] bg-gradient-to-br ${template.gradient} flex items-center justify-center`}>
                        <div className="text-white font-bold text-xs opacity-80">PREVIEW</div>
                      </div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-white text-xs font-medium truncate">{template.name}</p>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-crd-green rounded-full shadow-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="flex-1 mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4">
                <h3 className="text-white font-medium text-sm uppercase tracking-wide">Backgrounds</h3>
                <div className="grid grid-cols-2 gap-3">
                  {filteredAssets.filter(a => a.category === 'backgrounds').map((asset) => (
                    <div 
                      key={asset.id}
                      className="group cursor-pointer rounded-xl overflow-hidden bg-editor-tool hover:bg-editor-border transition-colors"
                      onClick={() => toast.success(`"${asset.name}" added to canvas`)}
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                        <FileImage className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="p-2">
                        <p className="text-white text-xs font-medium truncate">{asset.name}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-white font-medium text-sm uppercase tracking-wide mt-6">Effects</h3>
                <div className="grid grid-cols-2 gap-3">
                  {filteredAssets.filter(a => a.category === 'effects').map((asset) => (
                    <div 
                      key={asset.id}
                      className="group cursor-pointer rounded-xl overflow-hidden bg-editor-tool hover:bg-editor-border transition-colors"
                      onClick={() => toast.success(`"${asset.name}" added to canvas`)}
                    >
                      <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <Palette className="w-8 h-8 text-white/80" />
                      </div>
                      <div className="p-2">
                        <p className="text-white text-xs font-medium truncate">{asset.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Elements Tab */}
          <TabsContent value="elements" className="flex-1 mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4">
                <h3 className="text-white font-medium text-sm uppercase tracking-wide">Design Elements</h3>
                <div className="grid grid-cols-3 gap-3">
                  {designElements.map((element) => (
                    <div 
                      key={element.id}
                      className="group cursor-pointer rounded-xl bg-editor-tool hover:bg-editor-border transition-colors p-4 flex flex-col items-center gap-2"
                      onClick={() => toast.success(`"${element.name}" added to canvas`)}
                    >
                      <div className={`text-2xl ${element.color} font-bold`}>
                        {element.icon}
                      </div>
                      <p className="text-white text-xs font-medium text-center">{element.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="flex-1 mt-4">
            <div className="px-4">
              <div className="space-y-4">
                <h3 className="text-white font-medium text-sm uppercase tracking-wide">Upload Files</h3>
                <div className="p-6 border-2 border-dashed border-editor-border rounded-xl text-center">
                  <Upload className="w-12 h-12 text-crd-lightGray mb-4 mx-auto" />
                  <p className="text-white font-medium mb-2">Upload Your Assets</p>
                  <p className="text-xs text-crd-lightGray mb-4">
                    Drag files here or click to browse
                  </p>
                  <Button className="bg-crd-green hover:bg-crd-green/90 rounded-lg">
                    Browse Files
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
