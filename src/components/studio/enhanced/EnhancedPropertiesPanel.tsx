
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, Eye, EyeOff, Lock, Unlock, Copy, Trash2,
  RotateCcw, Save, Share2, Download, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';

interface EnhancedPropertiesPanelProps {
  selectedCard?: {
    id: string;
    cardData: CardData;
  };
  onUpdateCard: (cardId: string, field: string, value: any) => void;
  onSaveCard: () => void;
  onPublishCard: () => void;
}

export const EnhancedPropertiesPanel: React.FC<EnhancedPropertiesPanelProps> = ({
  selectedCard,
  onUpdateCard,
  onSaveCard,
  onPublishCard
}) => {
  const [activeSection, setActiveSection] = useState('properties');

  if (!selectedCard) {
    return (
      <div className="w-96 bg-editor-dark border-l border-editor-border p-6">
        <div className="text-center">
          <Settings className="w-12 h-12 mx-auto mb-4 text-crd-lightGray" />
          <h3 className="text-white font-semibold mb-2">Card Properties</h3>
          <p className="text-crd-lightGray text-sm">Select a card to edit its properties</p>
        </div>
      </div>
    );
  }

  const { cardData } = selectedCard;

  const handleFieldUpdate = (field: string, value: any) => {
    onUpdateCard(selectedCard.id, field, value);
  };

  const rarityColors = {
    common: '#6b7280',
    uncommon: '#10b981',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b'
  };

  return (
    <div className="w-96 bg-editor-dark border-l border-editor-border overflow-y-auto">
      <div className="p-6 border-b border-editor-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Card Editor</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Lock className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge 
            variant="outline" 
            className="text-xs"
            style={{ borderColor: rarityColors[cardData.rarity as keyof typeof rarityColors] }}
          >
            {cardData.rarity.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {cardData.visibility.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Properties */}
        <Card className="bg-editor-darker border-editor-border p-4">
          <h3 className="text-white font-semibold mb-4">Card Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Card Title</label>
              <Input
                value={cardData.title}
                onChange={(e) => handleFieldUpdate('title', e.target.value)}
                className="bg-editor-tool border-editor-border text-white"
                placeholder="Enter card title..."
              />
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Description</label>
              <Textarea
                value={cardData.description || ''}
                onChange={(e) => handleFieldUpdate('description', e.target.value)}
                className="bg-editor-tool border-editor-border text-white h-20"
                placeholder="Card description..."
              />
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Rarity</label>
              <select
                value={cardData.rarity}
                onChange={(e) => handleFieldUpdate('rarity', e.target.value)}
                className="w-full bg-editor-tool border border-editor-border rounded px-3 py-2 text-white"
              >
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Advanced Effects */}
        <Card className="bg-editor-darker border-editor-border p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Advanced Effects
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Holographic Intensity</label>
              <Slider
                defaultValue={[50]}
                max={100}
                step={5}
                className="w-full"
                onValueChange={(value) => handleFieldUpdate('holographic_intensity', value[0])}
              />
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Glow Effect</label>
              <Slider
                defaultValue={[25]}
                max={100}
                step={5}
                className="w-full"
                onValueChange={(value) => handleFieldUpdate('glow_effect', value[0])}
              />
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Border Thickness</label>
              <Slider
                defaultValue={[3]}
                max={10}
                step={1}
                className="w-full"
                onValueChange={(value) => handleFieldUpdate('border_thickness', value[0])}
              />
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Shadow Depth</label>
              <Slider
                defaultValue={[15]}
                max={50}
                step={2}
                className="w-full"
                onValueChange={(value) => handleFieldUpdate('shadow_depth', value[0])}
              />
            </div>
          </div>
        </Card>

        {/* Layer Controls */}
        <Card className="bg-editor-darker border-editor-border p-4">
          <h3 className="text-white font-semibold mb-4">Layer Controls</h3>
          <div className="space-y-3">
            {['Background', 'Main Image', 'Title Text', 'Border Effects', 'Holographic Overlay'].map((layer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-editor-tool rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded border"></div>
                  <span className="text-white text-sm">{layer}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:text-crd-green">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:text-crd-green">
                    <Lock className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:text-red-400">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Publishing Options */}
        <Card className="bg-editor-darker border-editor-border p-4">
          <h3 className="text-white font-semibold mb-4">Publishing</h3>
          <div className="space-y-4">
            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Edition Size</label>
              <Input
                type="number"
                value={cardData.edition_size || 1}
                onChange={(e) => handleFieldUpdate('edition_size', parseInt(e.target.value))}
                className="bg-editor-tool border-editor-border text-white"
              />
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Visibility</label>
              <select
                value={cardData.visibility}
                onChange={(e) => handleFieldUpdate('visibility', e.target.value)}
                className="w-full bg-editor-tool border border-editor-border rounded px-3 py-2 text-white"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="shared">Shared Link</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onSaveCard}
            className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-semibold py-3"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          
          <Button
            onClick={onPublishCard}
            className="w-full bg-crd-orange hover:bg-crd-orange/90 text-white font-semibold py-3"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Publish Card
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="border-editor-border text-white hover:bg-editor-border"
              onClick={() => toast.success('Card duplicated')}
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
            <Button
              variant="outline"
              className="border-editor-border text-white hover:bg-editor-border"
              onClick={() => toast.success('Card exported')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
