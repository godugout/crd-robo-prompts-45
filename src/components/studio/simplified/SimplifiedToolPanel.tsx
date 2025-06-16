
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
  Type, Image as ImageIcon, Eye, EyeOff
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

const rarityColors = {
  common: '#6b7280',
  uncommon: '#10b981',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b'
};

export const SimplifiedToolPanel: React.FC<SimplifiedToolPanelProps> = ({
  selectedCard,
  onUpdateCard
}) => {
  const [activeTab, setActiveTab] = useState('design');
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!selectedCard) {
    return (
      <aside className="w-96 bg-[#1a1a1d]/90 backdrop-blur-sm border-l border-[#27272a] flex flex-col">
        <div className="p-8 flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-[#27272a] rounded-2xl flex items-center justify-center">
              <Palette className="w-8 h-8 text-[#71717a]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-semibold text-lg">Design Tools</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">
                Select a card from the grid to start customizing its design, effects, and content.
              </p>
            </div>
          </div>
        </div>
      </aside>
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

  return (
    <aside className="w-96 bg-[#1a1a1d]/90 backdrop-blur-sm border-l border-[#27272a] flex flex-col">
      {/* Panel Header */}
      <header className="p-6 border-b border-[#27272a]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-crd-green rounded-lg flex items-center justify-center">
              <Type className="w-4 h-4 text-black" />
            </div>
            <h2 className="text-white font-bold text-lg">Card Editor</h2>
          </div>
          <Badge 
            className="text-xs font-bold px-2 py-1"
            style={{ 
              backgroundColor: rarityColors[cardData.rarity as keyof typeof rarityColors],
              color: 'white'
            }}
          >
            {cardData.rarity.toUpperCase()}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-white font-medium truncate text-sm">
            {cardData.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
            <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse" />
            <span>Currently editing</span>
          </div>
        </div>
      </header>

      {/* Tool Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-6 mt-6 bg-[#27272a] p-1 rounded-lg">
          <TabsTrigger 
            value="design" 
            className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-[#a1a1aa] font-medium transition-all duration-200"
          >
            <Palette className="w-4 h-4 mr-2" />
            Design
          </TabsTrigger>
          <TabsTrigger 
            value="effects" 
            className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-[#a1a1aa] font-medium transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Effects
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <TabsContent value="design" className="space-y-6 mt-6">
            {/* Essential Card Details */}
            <Card className="bg-[#27272a]/50 border-[#3f3f46] p-5 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-4 h-4 text-crd-green" />
                <h4 className="text-white font-semibold text-sm">Card Details</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[#a1a1aa] text-xs font-medium mb-2 block">
                    Title
                  </label>
                  <Input
                    value={cardData.title}
                    onChange={(e) => handleFieldUpdate('title', e.target.value)}
                    className="bg-[#1a1a1d] border-[#3f3f46] text-white placeholder:text-[#71717a] focus:border-crd-green focus:ring-1 focus:ring-crd-green/50 transition-all duration-200"
                    placeholder="Enter card title..."
                  />
                </div>
                
                <div>
                  <label className="text-[#a1a1aa] text-xs font-medium mb-2 block">
                    Description
                  </label>
                  <Textarea
                    value={cardData.description || ''}
                    onChange={(e) => handleFieldUpdate('description', e.target.value)}
                    className="bg-[#1a1a1d] border-[#3f3f46] text-white placeholder:text-[#71717a] focus:border-crd-green focus:ring-1 focus:ring-crd-green/50 transition-all duration-200 h-20 resize-none"
                    placeholder="Describe your card..."
                  />
                </div>
                
                <div>
                  <label className="text-[#a1a1aa] text-xs font-medium mb-2 block">
                    Rarity
                  </label>
                  <select
                    value={cardData.rarity}
                    onChange={(e) => handleFieldUpdate('rarity', e.target.value)}
                    className="w-full bg-[#1a1a1d] border border-[#3f3f46] rounded-md px-3 py-2 text-white text-sm focus:border-crd-green focus:ring-1 focus:ring-crd-green/50 transition-all duration-200"
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

            {/* Image Upload */}
            <Card className="bg-[#27272a]/50 border-[#3f3f46] p-5">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-4 h-4 text-crd-green" />
                <h4 className="text-white font-semibold text-sm">Card Image</h4>
              </div>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-[#3f3f46] rounded-lg p-6 text-center hover:border-crd-green/50 transition-colors duration-200 group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-3 text-[#71717a] group-hover:text-crd-green transition-colors duration-200" />
                    <p className="text-white text-sm font-medium mb-1">Upload New Photo</p>
                    <p className="text-[#71717a] text-xs">PNG, JPG up to 10MB</p>
                  </label>
                </div>
                
                {selectedCard.currentPhoto && (
                  <div className="aspect-video rounded-lg overflow-hidden border border-[#3f3f46]">
                    <img 
                      src={selectedCard.currentPhoto} 
                      alt="Card preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Advanced Options Toggle */}
            <div className="pt-2">
              <Button
                onClick={() => setShowAdvanced(!showAdvanced)}
                variant="ghost"
                className="w-full text-[#a1a1aa] hover:text-white hover:bg-[#27272a]/50 justify-between"
              >
                <span className="text-sm">Advanced Options</span>
                {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              
              {showAdvanced && (
                <Card className="bg-[#27272a]/30 border-[#3f3f46] p-4 mt-3">
                  <p className="text-xs text-[#71717a] text-center">
                    Publishing settings, metadata, and other advanced options will appear here.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-6 mt-6">
            {/* Frame Selection */}
            <Card className="bg-[#27272a]/50 border-[#3f3f46] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-crd-green" />
                <h4 className="text-white font-semibold text-sm">Card Frames</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {EXTRACTED_FRAMES.slice(0, 6).map((frame) => (
                  <button
                    key={frame.id}
                    className={`
                      aspect-video rounded-lg border-2 cursor-pointer transition-all duration-200 p-3 text-center group
                      ${cardData.template_id === frame.id 
                        ? 'border-crd-green bg-crd-green/10 shadow-lg shadow-crd-green/25' 
                        : 'border-[#3f3f46] hover:border-crd-green/50 hover:bg-[#27272a]/50'
                      }
                    `}
                    onClick={() => handleFieldUpdate('template_id', frame.id)}
                  >
                    <div className="text-white text-xs font-medium truncate group-hover:text-crd-green transition-colors duration-200">
                      {frame.name}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Quick Effects */}
            <Card className="bg-[#27272a]/50 border-[#3f3f46] p-5">
              <div class="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-crd-green" />
                <h4 className="text-white font-semibold text-sm">Visual Effects</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Holographic', color: '#8b5cf6' },
                  { name: 'Glow', color: '#3b82f6' },
                  { name: 'Chrome', color: '#6b7280' },
                  { name: 'Vintage', color: '#f59e0b' }
                ].map((effect) => (
                  <Button
                    key={effect.name}
                    variant="outline"
                    className="border-[#3f3f46] text-[#a1a1aa] hover:text-white hover:bg-[#27272a]/50 hover:border-crd-green/50 text-xs h-10 transition-all duration-200"
                    onClick={() => toast.success(`${effect.name} effect applied`)}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-2 border border-white/20"
                      style={{ backgroundColor: effect.color }}
                    />
                    {effect.name}
                  </Button>
                ))}
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Action Footer */}
      <footer className="p-6 border-t border-[#27272a] space-y-3">
        <Button
          className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-semibold h-11 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-crd-green/25"
          onClick={() => toast.success(`"${cardData.title}" saved and published!`)}
        >
          <Save className="w-4 h-4 mr-2" />
          Save & Publish
        </Button>
        
        <Button
          variant="outline"
          className="w-full border-[#3f3f46] bg-transparent text-[#a1a1aa] hover:text-white hover:bg-[#27272a] hover:border-[#4a4a4a] h-10 transition-all duration-200"
          onClick={() => toast.success('Share link copied to clipboard!')}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Card
        </Button>
      </footer>
    </aside>
  );
};
