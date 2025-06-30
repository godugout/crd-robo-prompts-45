
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Type, 
  Shapes, 
  Image as ImageIcon, 
  Upload, 
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';

interface ElementsStepProps {
  cardData: any;
  onUpdateCardData: (updates: any) => void;
  onComplete: () => void;
}

export const ElementsStep: React.FC<ElementsStepProps> = ({
  cardData,
  onUpdateCardData,
  onComplete
}) => {
  const [activeTab, setActiveTab] = useState('text');

  const shapes = [
    { id: 'circle', name: 'Circle', icon: '●', color: 'text-blue-400' },
    { id: 'square', name: 'Square', icon: '■', color: 'text-green-400' },
    { id: 'triangle', name: 'Triangle', icon: '▲', color: 'text-purple-400' },
    { id: 'star', name: 'Star', icon: '★', color: 'text-yellow-400' },
    { id: 'diamond', name: 'Diamond', icon: '◆', color: 'text-pink-400' },
    { id: 'hexagon', name: 'Hexagon', icon: '⬢', color: 'text-cyan-400' }
  ];

  const backgrounds = [
    { id: 'galaxy-nebula', name: 'Galaxy Nebula', gradient: 'from-purple-900 via-blue-900 to-purple-800' },
    { id: 'sunset-glow', name: 'Sunset Glow', gradient: 'from-orange-500 via-red-500 to-pink-500' },
    { id: 'ocean-deep', name: 'Ocean Deep', gradient: 'from-blue-600 via-cyan-500 to-teal-400' },
    { id: 'forest-mist', name: 'Forest Mist', gradient: 'from-green-600 via-emerald-500 to-green-400' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdateCardData({ image_url: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Customize Elements</h3>
        <p className="text-gray-400 text-sm">Add text, shapes, and images to personalize your card</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-black/30">
          <TabsTrigger value="text" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
            <Type className="w-4 h-4 mr-2" />
            Text
          </TabsTrigger>
          <TabsTrigger value="shapes" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
            <Shapes className="w-4 h-4 mr-2" />
            Shapes
          </TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <ImageIcon className="w-4 h-4 mr-2" />
            Images
          </TabsTrigger>
          <TabsTrigger value="backgrounds" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <Palette className="w-4 h-4 mr-2" />
            Backgrounds
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Card Title</label>
              <Input
                value={cardData.title || ''}
                onChange={(e) => onUpdateCardData({ title: e.target.value })}
                placeholder="Enter card title..."
                className="bg-black/40 border-white/20 text-white"
              />
            </div>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={cardData.description || ''}
                onChange={(e) => onUpdateCardData({ description: e.target.value })}
                placeholder="Enter card description..."
                className="bg-black/40 border-white/20 text-white resize-none"
                rows={3}
              />
            </div>

            {/* Text Formatting */}
            <div className="space-y-3">
              <label className="text-white text-sm font-medium">Text Formatting</label>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="border-white/20 text-white">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white">
                  <Underline className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-white/20 mx-2"></div>
                <Button variant="outline" size="sm" className="border-white/20 text-white">
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white">
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white">
                  <AlignRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shapes" className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium mb-3 block">Add Shapes</label>
            <div className="grid grid-cols-3 gap-3">
              {shapes.map(shape => (
                <Button
                  key={shape.id}
                  variant="outline"
                  className="h-16 border-white/20 text-white hover:bg-white/10 flex flex-col items-center"
                >
                  <span className={`text-2xl ${shape.color}`}>{shape.icon}</span>
                  <span className="text-xs mt-1">{shape.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-3 block">Upload Image</label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-sm mb-4">Drag and drop an image, or click to browse</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="backgrounds" className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium mb-3 block">Background Styles</label>
            <div className="grid grid-cols-2 gap-3">
              {backgrounds.map(bg => (
                <div
                  key={bg.id}
                  className="aspect-square rounded-lg cursor-pointer border-2 border-white/20 hover:border-white/40 transition-colors overflow-hidden"
                >
                  <div className={`w-full h-full bg-gradient-to-br ${bg.gradient} flex items-center justify-center`}>
                    <span className="text-white text-xs font-medium text-center px-2">{bg.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Continue Button */}
      <div className="pt-4 border-t border-white/10">
        <Button 
          onClick={onComplete}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
        >
          Continue to Preview
        </Button>
      </div>
    </div>
  );
};
