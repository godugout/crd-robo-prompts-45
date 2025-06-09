
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  Square, 
  Circle, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  Underline,
  Image as ImageIcon,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';

export const DesignTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>('text');
  const [fontSize, setFontSize] = useState([24]);
  const [borderRadius, setBorderRadius] = useState([8]);
  const [opacity, setOpacity] = useState([100]);

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    toast.success(`${tool.charAt(0).toUpperCase() + tool.slice(1)} tool selected`);
  };

  const addTextElement = () => {
    toast.success('Text element added to canvas');
  };

  const addShapeElement = (shape: string) => {
    toast.success(`${shape} added to canvas`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-semibold text-lg mb-2">Design Studio</h3>
        <p className="text-crd-lightGray text-sm mb-6">
          Professional design tools for card customization
        </p>
      </div>

      <Tabs value={selectedTool} onValueChange={setSelectedTool} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-editor-dark">
          <TabsTrigger 
            value="text" 
            className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-white"
          >
            <Type className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger 
            value="shapes" 
            className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-white"
          >
            <Square className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger 
            value="colors" 
            className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-white"
          >
            <Palette className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger 
            value="layout" 
            className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-white"
          >
            <Layers className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4 mt-4">
          <Card className="bg-editor-dark border-editor-border p-4">
            <div className="space-y-4">
              <Button
                onClick={addTextElement}
                className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Type className="w-4 h-4 mr-2" />
                Add Text Element
              </Button>
              
              <div className="space-y-3">
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Font Size</label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      min={8}
                      max={72}
                      step={1}
                      className="flex-1"
                    />
                    <Badge variant="outline" className="text-xs min-w-[40px]">
                      {fontSize[0]}px
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Text Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="border-editor-border text-white">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-editor-border text-white">
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-editor-border text-white">
                      <Underline className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Alignment</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="border-editor-border text-white">
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-editor-border text-white">
                      <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-editor-border text-white">
                      <AlignRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="shapes" className="space-y-4 mt-4">
          <Card className="bg-editor-dark border-editor-border p-4">
            <div className="space-y-4">
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Add Shapes</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => addShapeElement('rectangle')}
                    variant="outline"
                    className="border-editor-border text-white hover:bg-editor-border"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Rectangle
                  </Button>
                  <Button
                    onClick={() => addShapeElement('circle')}
                    variant="outline"
                    className="border-editor-border text-white hover:bg-editor-border"
                  >
                    <Circle className="w-4 h-4 mr-2" />
                    Circle
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Border Radius</label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={borderRadius}
                    onValueChange={setBorderRadius}
                    min={0}
                    max={50}
                    step={1}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="text-xs min-w-[40px]">
                    {borderRadius[0]}px
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4 mt-4">
          <Card className="bg-editor-dark border-editor-border p-4">
            <div className="space-y-4">
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Color Palette</label>
                <div className="grid grid-cols-6 gap-2">
                  {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded border-2 border-editor-border hover:border-crd-green transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => toast.success(`Color ${color} selected`)}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Custom Color</label>
                <Input
                  type="color"
                  defaultValue="#4ECDC4"
                  className="w-full h-10 bg-editor-tool border-editor-border"
                />
              </div>
              
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Opacity</label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={opacity}
                    onValueChange={setOpacity}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="text-xs min-w-[40px]">
                    {opacity[0]}%
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4 mt-4">
          <Card className="bg-editor-dark border-editor-border p-4">
            <div className="space-y-4">
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Background</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-editor-border text-white hover:bg-editor-border"
                    onClick={() => toast.success('Solid background applied')}
                  >
                    Solid
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-editor-border text-white hover:bg-editor-border"
                    onClick={() => toast.success('Gradient background applied')}
                  >
                    Gradient
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Layout Presets</label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-editor-border text-white hover:bg-editor-border"
                    onClick={() => toast.success('Centered layout applied')}
                  >
                    Centered Layout
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-editor-border text-white hover:bg-editor-border"
                    onClick={() => toast.success('Split layout applied')}
                  >
                    Split Layout
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
