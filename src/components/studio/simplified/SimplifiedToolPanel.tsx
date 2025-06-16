
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, Sparkles, Upload, Save, Share2,
  Type, Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { EXTRACTED_FRAMES } from '../frames/ExtractedFrameConfigs';

interface GridCard {
  id: string;
  cardData: any;
  gridPosition: number;
  currentPhoto?: string;
}

interface SimplifiedToolPanelProps {
  selectedCard: GridCard | null;
  onUpdateCard: (cardId: string, field: string, value: any) => void;
}

export const SimplifiedToolPanel: React.FC<SimplifiedToolPanelProps> = ({
  selectedCard,
  onUpdateCard
}) => {
  const [activeTab, setActiveTab] = useState('design');

  if (!selectedCard) {
    return (
      <div className="w-80 bg-[#1a1a2e] border-l border-[#4a4a4a] p-6">
        <div className="text-center">
          <Palette className="w-12 h-12 mx-auto mb-4 text-crd-lightGray" />
          <h3 className="text-white font-semibold mb-2">Design Tools</h3>
          <p className="text-crd-lightGray text-sm">Select a card to start editing</p>
        </div>
      </div>
    );
  }

  const { cardData } = selectedCard;

  const handleFieldUpdate = (field: string, value: any) => {
    onUpdateCard(selectedCard.id, field, value);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdateCard(selectedCard.id, 'currentPhoto', url);
      onUpdateCard(selectedCard.id, 'image_url', url);
      toast.success('Photo uploaded successfully');
    }
  };

  const rarityColors = {
    common: '#6b7280',
    uncommon: '#10b981',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b'
  };

  return (
    <div className="w-80 bg-[#1a1a2e] border-l border-[#4a4a4a] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#4a4a4a]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold">Editing Card</h2>
          <Badge 
            style={{ 
              backgroundColor: rarityColors[cardData.rarity as keyof typeof rarityColors],
              color: 'white'
            }}
          >
            {cardData.rarity.toUpperCase()}
          </Badge>
        </div>
        <div className="text-crd-lightGray text-sm truncate">
          {cardData.title}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-2 m-4 bg-[#2c2c54]">
          <TabsTrigger value="design" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            <Palette className="w-4 h-4 mr-2" />
            Design
          </TabsTrigger>
          <TabsTrigger value="effects" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            <Sparkles className="w-4 h-4 mr-2" />
            Effects
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <TabsContent value="design" className="space-y-4 mt-0">
            {/* Basic Info */}
            <Card className="bg-[#2c2c54] border-[#4a4a4a] p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Type className="w-4 h-4 mr-2" />
                Card Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-crd-lightGray text-sm mb-1 block">Title</label>
                  <Input
                    value={cardData.title}
                    onChange={(e) => handleFieldUpdate('title', e.target.value)}
                    className="bg-[#1a1a2e] border-[#4a4a4a] text-white"
                  />
                </div>
                <div>
                  <label className="text-crd-lightGray text-sm mb-1 block">Description</label>
                  <Textarea
                    value={cardData.description || ''}
                    onChange={(e) => handleFieldUpdate('description', e.target.value)}
                    className="bg-[#1a1a2e] border-[#4a4a4a] text-white h-16"
                  />
                </div>
                <div>
                  <label className="text-crd-lightGray text-sm mb-1 block">Rarity</label>
                  <select
                    value={cardData.rarity}
                    onChange={(e) => handleFieldUpdate('rarity', e.target.value)}
                    className="w-full bg-[#1a1a2e] border border-[#4a4a4a] rounded px-3 py-2 text-white"
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

            {/* Photo Upload */}
            <Card className="bg-[#2c2c54] border-[#4a4a4a] p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Card Image
              </h3>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-[#4a4a4a] rounded-lg p-4 text-center hover:border-crd-green transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-crd-lightGray" />
                    <p className="text-white text-sm">Upload New Photo</p>
                    <p className="text-crd-lightGray text-xs">PNG, JPG up to 10MB</p>
                  </label>
                </div>
                {selectedCard.currentPhoto && (
                  <div className="aspect-video rounded overflow-hidden">
                    <img 
                      src={selectedCard.currentPhoto} 
                      alt="Card preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4 mt-0">
            {/* Frame Selection */}
            <Card className="bg-[#2c2c54] border-[#4a4a4a] p-4">
              <h3 className="text-white font-semibold mb-3">Card Frames</h3>
              <div className="grid grid-cols-2 gap-2">
                {EXTRACTED_FRAMES.slice(0, 6).map((frame) => (
                  <div
                    key={frame.id}
                    className={`
                      aspect-video rounded border-2 cursor-pointer transition-all p-2 text-center
                      ${cardData.template_id === frame.id 
                        ? 'border-crd-green bg-crd-green/10' 
                        : 'border-[#4a4a4a] hover:border-crd-green/50'
                      }
                    `}
                    onClick={() => handleFieldUpdate('template_id', frame.id)}
                  >
                    <div className="text-white text-xs font-medium truncate">
                      {frame.name}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Effects */}
            <Card className="bg-[#2c2c54] border-[#4a4a4a] p-4">
              <h3 className="text-white font-semibold mb-3">Quick Effects</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="border-[#4a4a4a] text-white hover:bg-[#4a4a4a] text-xs"
                  onClick={() => toast.success('Holographic effect applied')}
                >
                  Holographic
                </Button>
                <Button
                  variant="outline"
                  className="border-[#4a4a4a] text-white hover:bg-[#4a4a4a] text-xs"
                  onClick={() => toast.success('Glow effect applied')}
                >
                  Glow
                </Button>
                <Button
                  variant="outline"
                  className="border-[#4a4a4a] text-white hover:bg-[#4a4a4a] text-xs"
                  onClick={() => toast.success('Chrome effect applied')}
                >
                  Chrome
                </Button>
                <Button
                  variant="outline"
                  className="border-[#4a4a4a] text-white hover:bg-[#4a4a4a] text-xs"
                  onClick={() => toast.success('Vintage effect applied')}
                >
                  Vintage
                </Button>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#4a4a4a] space-y-2">
        <Button
          className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          onClick={() => toast.success(`"${cardData.title}" saved!`)}
        >
          <Save className="w-4 h-4 mr-2" />
          Save & Publish
        </Button>
        <Button
          variant="outline"
          className="w-full border-[#4a4a4a] text-white hover:bg-[#4a4a4a]"
          onClick={() => toast.success('Share link copied!')}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Card
        </Button>
      </div>
    </div>
  );
};
