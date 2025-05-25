
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileImage, Upload, Layers, Grid, Palette, Type, Shapes, Sparkles, Zap, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EditorSidebarProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export const EditorSidebar = ({ selectedTemplate, onSelectTemplate }: EditorSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const frames = [
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

  const elements = [
    { id: 'shape1', name: 'Circle', icon: '●', color: 'text-blue-400', type: 'shape' },
    { id: 'shape2', name: 'Square', icon: '■', color: 'text-green-400', type: 'shape' },
    { id: 'shape3', name: 'Triangle', icon: '▲', color: 'text-purple-400', type: 'shape' },
    { id: 'shape4', name: 'Star', icon: '★', color: 'text-yellow-400', type: 'shape' },
    { id: 'shape5', name: 'Diamond', icon: '◆', color: 'text-pink-400', type: 'shape' },
    { id: 'shape6', name: 'Hexagon', icon: '⬢', color: 'text-cyan-400', type: 'shape' },
    { id: 'text1', name: 'Title Text', color: 'text-white', type: 'text' },
    { id: 'text2', name: 'Subtitle', color: 'text-gray-300', type: 'text' },
    { id: 'bg1', name: 'Galaxy Nebula', gradient: 'from-purple-900 via-blue-900 to-purple-800', type: 'background' },
    { id: 'bg2', name: 'Sunset Glow', gradient: 'from-orange-500 via-red-500 to-pink-500', type: 'background' },
    { id: 'bg3', name: 'Ocean Deep', gradient: 'from-blue-600 via-cyan-500 to-teal-400', type: 'background' },
    { id: 'bg4', name: 'Forest Mist', gradient: 'from-green-600 via-emerald-500 to-green-400', type: 'background' }
  ];

  const effects = [
    { id: 'fx1', name: 'Holographic', icon: Sparkles, color: 'text-cyan-400', description: 'Rainbow shimmer effect' },
    { id: 'fx2', name: 'Neon Glow', icon: Zap, color: 'text-pink-400', description: 'Electric outline glow' },
    { id: 'fx3', name: 'Golden Hour', icon: Sun, color: 'text-yellow-400', description: 'Warm lighting effect' },
    { id: 'fx4', name: 'Moonlight', icon: Moon, color: 'text-blue-300', description: 'Cool silver glow' },
    { id: 'fx5', name: 'Fire Edge', icon: Sparkles, color: 'text-red-400', description: 'Burning border effect' },
    { id: 'fx6', name: 'Crystal Shine', icon: Sparkles, color: 'text-purple-300', description: 'Prismatic reflection' }
  ];

  const filteredFrames = frames.filter(frame => 
    frame.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredElements = elements.filter(element => 
    element.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEffects = effects.filter(effect => 
    effect.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <ScrollArea className="h-full px-4">
              <div className="space-y-4">
                <h3 className="text-white font-medium text-sm uppercase tracking-wide">Card Frames</h3>
                <div className="grid grid-cols-2 gap-3">
                  {filteredFrames.map((frame) => (
                    <div 
                      key={frame.id}
                      className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${
                        selectedTemplate === frame.id
                          ? 'ring-2 ring-crd-green shadow-lg scale-105' 
                          : 'hover:scale-102 hover:shadow-md'
                      }`}
                      onClick={() => {
                        onSelectTemplate(frame.id);
                        toast.success(`Frame "${frame.name}" applied`);
                      }}
                    >
                      <div className={`aspect-[3/4] bg-gradient-to-br ${frame.gradient} flex items-center justify-center`}>
                        <div className="text-white font-bold text-xs opacity-80">FRAME</div>
                      </div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-white text-xs font-medium truncate">{frame.name}</p>
                      </div>
                      {selectedTemplate === frame.id && (
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

          {/* Elements Tab */}
          <TabsContent value="elements" className="flex-1 mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-6">
                {/* Shapes Section */}
                <div>
                  <h3 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Shapes</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {filteredElements.filter(el => el.type === 'shape').map((shape) => (
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
                </div>

                {/* Text Elements Section */}
                <div>
                  <h3 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Text</h3>
                  <div className="space-y-2">
                    {filteredElements.filter(el => el.type === 'text').map((textEl) => (
                      <Button 
                        key={textEl.id}
                        variant="outline" 
                        className="w-full justify-start bg-editor-tool border-editor-border text-white hover:bg-editor-border rounded-lg"
                        onClick={() => toast.success(`${textEl.name} added`)}
                      >
                        <Type className="w-4 h-4 mr-2" />
                        Add {textEl.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Backgrounds Section */}
                <div>
                  <h3 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Backgrounds</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredElements.filter(el => el.type === 'background').map((bg) => (
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

                {/* Upload Section */}
                <div>
                  <h3 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Upload Assets</h3>
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
            </ScrollArea>
          </TabsContent>

          {/* Effects Tab */}
          <TabsContent value="effects" className="flex-1 mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4">
                <h3 className="text-white font-medium text-sm uppercase tracking-wide">Lighting & Effects</h3>
                <div className="grid grid-cols-2 gap-3">
                  {filteredEffects.map((effect) => {
                    const IconComponent = effect.icon;
                    return (
                      <div 
                        key={effect.id}
                        className="group cursor-pointer rounded-xl bg-editor-tool hover:bg-editor-border transition-colors p-4 flex flex-col items-center gap-3"
                        onClick={() => toast.success(`${effect.name} effect applied`)}
                      >
                        <IconComponent className={`w-8 h-8 ${effect.color}`} />
                        <div className="text-center">
                          <p className="text-white text-xs font-medium">{effect.name}</p>
                          <p className="text-gray-400 text-xs mt-1">{effect.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-editor-tool rounded-xl">
                  <h4 className="text-white font-medium text-sm mb-3">Effect Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-300 text-xs">Intensity</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        defaultValue="50"
                        className="w-full mt-1 accent-crd-green"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-xs">Blend Mode</label>
                      <select className="w-full mt-1 bg-editor-dark border border-editor-border rounded-lg px-3 py-2 text-white text-xs">
                        <option>Normal</option>
                        <option>Multiply</option>
                        <option>Screen</option>
                        <option>Overlay</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
