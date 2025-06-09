
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import type { DesignState } from '@/hooks/useStudioState';

interface DesignToolsProps {
  designState: DesignState;
  onUpdateDesign: (updates: Partial<DesignState>) => void;
  onAddElement: (type: string) => void;
}

export const DesignTools: React.FC<DesignToolsProps> = ({
  designState,
  onUpdateDesign,
  onAddElement
}) => {
  const handleToolSelect = (tool: string) => {
    onUpdateDesign({ selectedTool: tool });
    toast.success(`${tool.charAt(0).toUpperCase() + tool.slice(1)} tool selected`);
  };

  const handleFontChange = (property: string, value: any) => {
    onUpdateDesign({ [property]: value });
  };

  const toggleTextStyle = (style: 'fontWeight' | 'fontStyle' | 'textDecoration') => {
    const currentValue = designState[style];
    let newValue;
    
    switch (style) {
      case 'fontWeight':
        newValue = currentValue === 'bold' ? 'normal' : 'bold';
        break;
      case 'fontStyle':
        newValue = currentValue === 'italic' ? 'normal' : 'italic';
        break;
      case 'textDecoration':
        newValue = currentValue === 'underline' ? 'none' : 'underline';
        break;
      default:
        newValue = currentValue;
    }
    
    onUpdateDesign({ [style]: newValue });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-semibold text-lg mb-2">Design Studio</h3>
        <p className="text-crd-lightGray text-sm mb-6">
          Professional design tools for card customization
        </p>
      </div>

      <Tabs value={designState.selectedTool} onValueChange={handleToolSelect} className="w-full">
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
                onClick={() => onAddElement('text')}
                className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Type className="w-4 h-4 mr-2" />
                Add Text Element
              </Button>
              
              <div className="space-y-3">
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Font Family</label>
                  <Select value={designState.fontFamily} onValueChange={(value) => handleFontChange('fontFamily', value)}>
                    <SelectTrigger className="bg-editor-tool border-editor-border text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Font Size</label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[designState.fontSize]}
                      onValueChange={(value) => handleFontChange('fontSize', value[0])}
                      min={8}
                      max={72}
                      step={1}
                      className="flex-1"
                    />
                    <Badge variant="outline" className="text-xs min-w-[40px]">
                      {designState.fontSize}px
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Text Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={designState.fontWeight === 'bold' ? 'default' : 'outline'} 
                      size="sm" 
                      className={designState.fontWeight === 'bold' ? 'bg-crd-green text-black' : 'border-editor-border text-white'}
                      onClick={() => toggleTextStyle('fontWeight')}
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant={designState.fontStyle === 'italic' ? 'default' : 'outline'} 
                      size="sm" 
                      className={designState.fontStyle === 'italic' ? 'bg-crd-green text-black' : 'border-editor-border text-white'}
                      onClick={() => toggleTextStyle('fontStyle')}
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant={designState.textDecoration === 'underline' ? 'default' : 'outline'} 
                      size="sm" 
                      className={designState.textDecoration === 'underline' ? 'bg-crd-green text-black' : 'border-editor-border text-white'}
                      onClick={() => toggleTextStyle('textDecoration')}
                    >
                      <Underline className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Alignment</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <Button 
                        key={align}
                        variant={designState.textAlign === align ? 'default' : 'outline'} 
                        size="sm" 
                        className={designState.textAlign === align ? 'bg-crd-green text-black' : 'border-editor-border text-white'}
                        onClick={() => handleFontChange('textAlign', align)}
                      >
                        {align === 'left' && <AlignLeft className="w-4 h-4" />}
                        {align === 'center' && <AlignCenter className="w-4 h-4" />}
                        {align === 'right' && <AlignRight className="w-4 h-4" />}
                      </Button>
                    ))}
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
                    onClick={() => onAddElement('rectangle')}
                    variant="outline"
                    className="border-editor-border text-white hover:bg-editor-border"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Rectangle
                  </Button>
                  <Button
                    onClick={() => onAddElement('circle')}
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
                    value={[designState.borderRadius]}
                    onValueChange={(value) => onUpdateDesign({ borderRadius: value[0] })}
                    min={0}
                    max={50}
                    step={1}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="text-xs min-w-[40px]">
                    {designState.borderRadius}px
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
                <label className="text-crd-lightGray text-sm mb-2 block">Background Color</label>
                <Input
                  type="color"
                  value={designState.backgroundColor}
                  onChange={(e) => onUpdateDesign({ backgroundColor: e.target.value })}
                  className="w-full h-10 bg-editor-tool border-editor-border"
                />
              </div>

              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Primary Color</label>
                <Input
                  type="color"
                  value={designState.primaryColor}
                  onChange={(e) => onUpdateDesign({ primaryColor: e.target.value })}
                  className="w-full h-10 bg-editor-tool border-editor-border"
                />
              </div>

              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Text Color</label>
                <Input
                  type="color"
                  value={designState.textColor}
                  onChange={(e) => onUpdateDesign({ textColor: e.target.value })}
                  className="w-full h-10 bg-editor-tool border-editor-border"
                />
              </div>
              
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Opacity</label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[designState.opacity]}
                    onValueChange={(value) => onUpdateDesign({ opacity: value[0] })}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="text-xs min-w-[40px]">
                    {designState.opacity}%
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
                <label className="text-crd-lightGray text-sm mb-2 block">Layout Presets</label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-editor-border text-white hover:bg-editor-border"
                    onClick={() => {
                      onUpdateDesign({ textAlign: 'center' });
                      toast.success('Centered layout applied');
                    }}
                  >
                    Centered Layout
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-editor-border text-white hover:bg-editor-border"
                    onClick={() => {
                      onUpdateDesign({ textAlign: 'left' });
                      toast.success('Split layout applied');
                    }}
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
