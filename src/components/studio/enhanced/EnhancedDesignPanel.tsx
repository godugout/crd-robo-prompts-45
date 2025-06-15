
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Type, Square, Circle, Palette, Image as ImageIcon, 
  Upload, Layers, Sparkles, Brush, Grid, Star,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline
} from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedDesignPanelProps {
  onUpdateCard: (field: string, value: any) => void;
  onAddElement: (type: string, data: any) => void;
  selectedCard?: any;
}

const CARD_FONTS = [
  'Arial Black', 'Impact', 'Oswald', 'Roboto Condensed', 'Bebas Neue',
  'Montserrat', 'Playfair Display', 'Cinzel', 'Orbitron'
];

const GRADIENT_PRESETS = [
  { name: 'Holographic', value: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)' },
  { name: 'Gold Rush', value: 'linear-gradient(135deg, #ffd700, #ffb347, #ff8c00)' },
  { name: 'Ice Cold', value: 'linear-gradient(180deg, #e0f6ff, #87ceeb, #4682b4)' },
  { name: 'Fire Storm', value: 'linear-gradient(45deg, #ff4500, #ff6347, #ffa500)' },
  { name: 'Mystic Purple', value: 'linear-gradient(225deg, #6a0dad, #9370db, #dda0dd)' }
];

const TEXTURE_PATTERNS = [
  { name: 'Carbon Fiber', class: 'bg-gray-900' },
  { name: 'Chrome', class: 'bg-gradient-to-r from-gray-400 to-gray-600' },
  { name: 'Hologram', class: 'bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500' },
  { name: 'Metallic', class: 'bg-gradient-radial from-yellow-400 to-yellow-700' }
];

export const EnhancedDesignPanel: React.FC<EnhancedDesignPanelProps> = ({
  onUpdateCard,
  onAddElement,
  selectedCard
}) => {
  const [activeTab, setActiveTab] = useState('elements');
  const [selectedFont, setSelectedFont] = useState('Impact');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#1a1a1a');

  const handleAddText = () => {
    onAddElement('text', {
      content: 'New Text',
      font: selectedFont,
      size: fontSize,
      color: textColor,
      position: { x: 50, y: 50 }
    });
    toast.success('Text element added');
  };

  const handleAddShape = (shapeType: string) => {
    onAddElement('shape', {
      type: shapeType,
      fill: backgroundColor,
      position: { x: 100, y: 100 },
      size: { width: 100, height: 100 }
    });
    toast.success(`${shapeType} shape added`);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdateCard('image_url', url);
      toast.success('Card image updated');
    }
  };

  return (
    <div className="w-80 bg-editor-darker border-r border-editor-border flex flex-col">
      <div className="p-4 border-b border-editor-border">
        <h2 className="text-white font-bold text-lg mb-2">Design Studio</h2>
        <p className="text-crd-lightGray text-sm">Professional card creation tools</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4 bg-editor-dark m-2">
          <TabsTrigger value="elements" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            <Type className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="media" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            <ImageIcon className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="effects" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            <Sparkles className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="layers" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            <Layers className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <TabsContent value="elements" className="space-y-6 mt-0">
            {/* Text Tools */}
            <Card className="bg-editor-dark border-editor-border p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Type className="w-4 h-4 mr-2" />
                Typography
              </h3>
              <div className="space-y-4">
                <Button
                  onClick={handleAddText}
                  className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                >
                  Add Text Element
                </Button>
                
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Font Family</label>
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full bg-editor-tool border border-editor-border rounded px-3 py-2 text-white"
                  >
                    {CARD_FONTS.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Font Size</label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[fontSize]}
                      onValueChange={(value) => setFontSize(value[0])}
                      min={12}
                      max={96}
                      step={2}
                      className="flex-1"
                    />
                    <Badge variant="outline" className="min-w-[50px] text-center">
                      {fontSize}px
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Underline className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Shape Tools */}
            <Card className="bg-editor-dark border-editor-border p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Square className="w-4 h-4 mr-2" />
                Shapes & Elements
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleAddShape('rectangle')}
                  variant="outline"
                  className="border-editor-border text-white hover:bg-editor-border"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Rectangle
                </Button>
                <Button
                  onClick={() => handleAddShape('circle')}
                  variant="outline"
                  className="border-editor-border text-white hover:bg-editor-border"
                >
                  <Circle className="w-4 h-4 mr-2" />
                  Circle
                </Button>
                <Button
                  onClick={() => handleAddShape('star')}
                  variant="outline"
                  className="border-editor-border text-white hover:bg-editor-border"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Star
                </Button>
                <Button
                  onClick={() => handleAddShape('diamond')}
                  variant="outline"
                  className="border-editor-border text-white hover:bg-editor-border"
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Diamond
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6 mt-0">
            <Card className="bg-editor-dark border-editor-border p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Media Upload
              </h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-editor-border rounded-lg p-6 text-center hover:border-crd-green transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-crd-lightGray" />
                    <p className="text-white font-medium">Upload Card Image</p>
                    <p className="text-crd-lightGray text-sm">PNG, JPG up to 10MB</p>
                  </label>
                </div>
                
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Background Textures</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TEXTURE_PATTERNS.map((texture, index) => (
                      <div
                        key={index}
                        className={`h-12 rounded cursor-pointer border-2 border-transparent hover:border-crd-green ${texture.class}`}
                        onClick={() => {
                          onUpdateCard('background_texture', texture.name);
                          toast.success(`${texture.name} texture applied`);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="effects" className="space-y-6 mt-0">
            <Card className="bg-editor-dark border-editor-border p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Visual Effects
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Gradient Presets</label>
                  <div className="space-y-2">
                    {GRADIENT_PRESETS.map((gradient, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded hover:bg-editor-border cursor-pointer"
                        onClick={() => {
                          onUpdateCard('background_gradient', gradient.value);
                          toast.success(`${gradient.name} gradient applied`);
                        }}
                      >
                        <div 
                          className="w-8 h-8 rounded border border-editor-border"
                          style={{ background: gradient.value }}
                        />
                        <span className="text-white text-sm">{gradient.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Glow Effect</label>
                  <Slider
                    defaultValue={[0]}
                    max={20}
                    step={1}
                    className="w-full"
                    onValueChange={(value) => onUpdateCard('glow_intensity', value[0])}
                  />
                </div>

                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Shadow Depth</label>
                  <Slider
                    defaultValue={[5]}
                    max={30}
                    step={1}
                    className="w-full"
                    onValueChange={(value) => onUpdateCard('shadow_depth', value[0])}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="layers" className="space-y-6 mt-0">
            <Card className="bg-editor-dark border-editor-border p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                Layer Management
              </h3>
              <div className="space-y-2">
                {['Background', 'Main Image', 'Title Text', 'Border Effects'].map((layer, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-editor-tool rounded">
                    <span className="text-white text-sm">{layer}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <span className="text-xs">👁</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <span className="text-xs">🔒</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
