
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileImage, Upload, Layers, Grid, Palette, Type, Shapes, Sparkles } from 'lucide-react';
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

  const backgrounds = [
    { id: 'bg1', name: 'Galaxy Nebula', gradient: 'from-purple-900 via-blue-900 to-purple-800' },
    { id: 'bg2', name: 'Sunset Glow', gradient: 'from-orange-500 via-red-500 to-pink-500' },
    { id: 'bg3', name: 'Ocean Deep', gradient: 'from-blue-600 via-cyan-500 to-teal-400' },
    { id: 'bg4', name: 'Forest Mist', gradient: 'from-green-600 via-emerald-500 to-green-400' },
    { id: 'bg5', name: 'Midnight Sky', gradient: 'from-gray-900 via-purple-900 to-violet-800' },
    { id: 'bg6', name: 'Fire Storm', gradient: 'from-red-600 via-orange-600 to-yellow-500' }
  ];

  const effects = [
    { id: 'fx1', name: 'Holographic', icon: Sparkles, color: 'text-cyan-400' },
    { id: 'fx2', name: 'Neon Glow', icon: Palette, color: 'text-pink-400' },
    { id: 'fx3', name: 'Retro Wave', icon: Grid, color: 'text-purple-400' },
    { id: 'fx4', name: 'Metal Shine', icon: Layers, color: 'text-gray-400' }
  ];

  const shapes = [
    { id: 'shape1', name: 'Circle', icon: '●', color: 'text-blue-400' },
    { id: 'shape2', name: 'Square', icon: '■', color: 'text-green-400' },
    { id: 'shape3', name: 'Triangle', icon: '▲', color: 'text-purple-400' },
    { id: 'shape4', name: 'Star', icon: '★', color: 'text-yellow-400' },
    { id: 'shape5', name: 'Diamond', icon: '◆', color: 'text-pink-400' },
    { id: 'shape6', name: 'Hexagon', icon: '⬢', color: 'text-cyan-400' }
  ];

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Tabs defaultValue="templates" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4 bg-editor-dark grid grid-cols-4">
            <TabsTrigger value="templates" className="text-xs">
              <Grid className="w-3 h-3 mr-1" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="backgrounds" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              Styles
            </TabsTrigger>
            <TabsTrigger value="elements" className="text-xs">
              <Shapes className="w-3 h-3 mr-1" />
              Elements
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-xs">
              <Upload className="w-3 h-3 mr-1" />
              Assets
            </TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="flex-1 mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4">
                <h3 className="text-white font-medium text-sm uppercase tracking-wide">Card Templates</h3>
                <div className="grid grid-cols-2 gap-3">
                  {filteredTemplates.map((template) => (
                    <div 
                      key={template.id}
                      className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? 'ring-2 ring-crd-green shadow-lg scale-105' 
                          : 'hover:scale-102 hover:shadow-md'
                      }`}
                      onClick={() => {
                        onSelectTemplate(template.id);
                        toast.success(`Template "${template.name}" applied`);
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

          {/* Backgrounds & Effects Tab */}
          <TabsContent value="backgrounds" className="flex-1 mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Backgrounds</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {backgrounds.map((bg) => (
                      <div 
                        key={bg.id}
                        className="group cursor-pointer rounded-lg overflow-hidden aspect-square transition-all hover:scale-105 hover:shadow-lg"
                        onClick={() => toast.success(`${bg.name} background applied`)}
                      >
                        <div className={`w-full h-full bg-gradient-to-br ${bg.gradient} flex items-center justify-center`}>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium text-center">
                            {bg.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Effects</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {effects.map((effect) => (
                      <div 
                        key={effect.id}
                        className="group cursor-pointer rounded-xl bg-editor-tool hover:bg-editor-border transition-colors p-4 flex flex-col items-center gap-2"
                        onClick={() => toast.success(`${effect.name} effect applied`)}
                      >
                        <effect.icon className={`w-8 h-8 ${effect.color}`} />
                        <p className="text-white text-xs font-medium text-center">{effect.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Elements Tab */}
          <TabsContent value="elements" className="flex-1 mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4">
                <h3 className="text-white font-medium text-sm uppercase tracking-wide">Shapes & Elements</h3>
                <div className="grid grid-cols-3 gap-3">
                  {shapes.map((shape) => (
                    <div 
                      key={shape.id}
                      className="group cursor-pointer rounded-xl bg-editor-tool hover:bg-editor-border transition-colors p-4 flex flex-col items-center gap-2"
                      onClick={() => toast.success(`${shape.name} added to canvas`)}
                    >
                      <div className={`text-2xl ${shape.color} font-bold`}>
                        {shape.icon}
                      </div>
                      <p className="text-white text-xs font-medium text-center">{shape.name}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Text Elements</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-editor-tool border-editor-border text-white hover:bg-editor-border rounded-lg"
                      onClick={() => toast.success('Title text added')}
                    >
                      <Type className="w-4 h-4 mr-2" />
                      Add Title
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-editor-tool border-editor-border text-white hover:bg-editor-border rounded-lg"
                      onClick={() => toast.success('Subtitle text added')}
                    >
                      <Type className="w-4 h-4 mr-2" />
                      Add Subtitle
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="flex-1 mt-4">
            <div className="px-4">
              <div className="space-y-4">
                <h3 className="text-white font-medium text-sm uppercase tracking-wide">Upload Assets</h3>
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

                <div className="space-y-2">
                  <h4 className="text-white font-medium text-xs uppercase tracking-wide">Recent Uploads</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-square bg-editor-tool rounded-lg flex items-center justify-center cursor-pointer hover:bg-editor-border transition-colors">
                      <FileImage className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="aspect-square bg-editor-tool rounded-lg flex items-center justify-center cursor-pointer hover:bg-editor-border transition-colors">
                      <FileImage className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
