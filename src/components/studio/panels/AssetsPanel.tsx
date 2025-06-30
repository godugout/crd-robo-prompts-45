
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Image as ImageIcon, 
  Type, 
  Shapes, 
  Palette,
  Download,
  Search,
  Star,
  Trash2
} from 'lucide-react';

interface AssetsPanelProps {
  onAddAsset?: (type: string, data: any) => void;
}

const assetCategories = [
  {
    name: 'Images',
    icon: ImageIcon,
    color: 'from-blue-500 to-cyan-500',
    count: 0
  },
  {
    name: 'Shapes',
    icon: Shapes,
    color: 'from-purple-500 to-pink-500',
    count: 12
  },
  {
    name: 'Text',
    icon: Type,
    color: 'from-green-500 to-emerald-500',
    count: 8
  },
  {
    name: 'Backgrounds',
    icon: Palette,
    color: 'from-orange-500 to-red-500',
    count: 15
  }
];

const sampleAssets = [
  { id: 1, name: 'Holographic Texture', type: 'background', preview: '🌈' },
  { id: 2, name: 'Chrome Border', type: 'shape', preview: '⭕' },
  { id: 3, name: 'Neon Glow', type: 'effect', preview: '✨' },
  { id: 4, name: 'Metallic Frame', type: 'shape', preview: '🔳' },
  { id: 5, name: 'Particle Effect', type: 'effect', preview: '💫' },
  { id: 6, name: 'Glass Texture', type: 'background', preview: '💎' }
];

export const AssetsPanel: React.FC<AssetsPanelProps> = ({
  onAddAsset
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Handle file upload logic here
      console.log('Uploading file:', file.name);
      onAddAsset?.('image', { file, name: file.name });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-blue-400">Assets</h3>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
          {sampleAssets.length} items
        </Badge>
      </div>

      {/* Upload Section */}
      <Card className="p-4 bg-black/20 border-white/10">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-white">Upload Assets</h4>
            <p className="text-xs text-gray-400">Add images, textures, or graphics</p>
          </div>
          <Button
            onClick={handleFileUpload}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-80 text-white"
          >
            Choose Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </Card>

      {/* Asset Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Categories</h4>
        <div className="grid grid-cols-2 gap-2">
          {assetCategories.map((category, index) => (
            <Card
              key={index}
              className="p-3 bg-black/20 border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                  <category.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">
                    {category.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {category.count} items
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Asset Library */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-300">Library</h4>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Search className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
          {sampleAssets.map((asset) => (
            <Card
              key={asset.id}
              className="p-3 bg-black/20 border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded flex items-center justify-center text-lg">
                    {asset.preview}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white">
                      {asset.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {asset.type}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 text-yellow-400 hover:text-yellow-300"
                  >
                    <Star className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 text-gray-400 hover:text-white"
                    onClick={() => onAddAsset?.(asset.type, asset)}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
