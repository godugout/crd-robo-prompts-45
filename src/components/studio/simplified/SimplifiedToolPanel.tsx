
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
  common: 'hsl(210, 40%, 98%)',
  uncommon: 'hsl(142, 76%, 36%)',
  rare: 'hsl(221, 83%, 53%)',
  epic: 'hsl(262, 83%, 58%)',
  legendary: 'hsl(45, 93%, 47%)'
};

export const SimplifiedToolPanel: React.FC<SimplifiedToolPanelProps> = ({
  selectedCard,
  onUpdateCard
}) => {
  const [activeTab, setActiveTab] = useState('design');
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!selectedCard) {
    return (
      <aside className="w-96 bg-gradient-to-b from-slate-950 to-slate-900 border-l border-slate-800 flex flex-col">
        <div className="p-8 flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-slate-800 rounded-3xl flex items-center justify-center">
              <Palette className="w-10 h-10 text-slate-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-slate-100 font-bold text-xl">Design Tools</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
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
    <aside className="w-96 bg-gradient-to-b from-slate-950 to-slate-900 border-l border-slate-800 flex flex-col">
      {/* Enhanced Panel Header */}
      <header className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Type className="w-5 h-5 text-slate-900" />
            </div>
            <h2 className="text-slate-100 font-bold text-xl">Card Editor</h2>
          </div>
          <Badge 
            className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ 
              backgroundColor: rarityColors[cardData.rarity as keyof typeof rarityColors],
              color: '#1e293b'
            }}
          >
            {cardData.rarity.toUpperCase()}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-slate-100 font-semibold text-lg truncate">
            {cardData.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span>Currently editing</span>
          </div>
        </div>
      </header>

      {/* Enhanced Tool Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-6 mt-6 bg-slate-800 p-1.5 rounded-xl shadow-inner">
          <TabsTrigger 
            value="design" 
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-900 text-slate-300 font-semibold transition-all duration-300 rounded-lg py-3"
          >
            <Palette className="w-4 h-4 mr-2" />
            Design
          </TabsTrigger>
          <TabsTrigger 
            value="effects" 
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-900 text-slate-300 font-semibold transition-all duration-300 rounded-lg py-3"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Effects
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <TabsContent value="design" className="space-y-6 mt-6">
            {/* Card Details Section */}
            <Card className="bg-slate-800/50 border-slate-700 p-6 space-y-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Type className="w-5 h-5 text-emerald-400" />
                <h4 className="text-slate-100 font-bold text-lg">Card Details</h4>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="text-slate-300 text-sm font-semibold mb-3 block">
                    Card Title
                  </label>
                  <Input
                    value={cardData.title}
                    onChange={(e) => handleFieldUpdate('title', e.target.value)}
                    className="bg-slate-900 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200 rounded-lg h-12"
                    placeholder="Enter your card title..."
                  />
                </div>
                
                <div>
                  <label className="text-slate-300 text-sm font-semibold mb-3 block">
                    Description
                  </label>
                  <Textarea
                    value={cardData.description || ''}
                    onChange={(e) => handleFieldUpdate('description', e.target.value)}
                    className="bg-slate-900 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200 rounded-lg h-24 resize-none"
                    placeholder="Describe your card..."
                  />
                </div>
                
                <div>
                  <label className="text-slate-300 text-sm font-semibold mb-3 block">
                    Rarity Level
                  </label>
                  <select
                    value={cardData.rarity}
                    onChange={(e) => handleFieldUpdate('rarity', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200"
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

            {/* Image Upload Section */}
            <Card className="bg-slate-800/50 border-slate-700 p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-5">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                <h4 className="text-slate-100 font-bold text-lg">Card Image</h4>
              </div>
              
              <div className="space-y-5">
                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-400/5 transition-all duration-300 group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="w-10 h-10 mx-auto mb-4 text-slate-500 group-hover:text-emerald-400 transition-colors duration-200" />
                    <p className="text-slate-100 text-base font-semibold mb-2">Upload New Photo</p>
                    <p className="text-slate-400 text-sm">PNG, JPG up to 10MB</p>
                  </label>
                </div>
                
                {selectedCard.currentPhoto && (
                  <div className="aspect-video rounded-lg overflow-hidden border-2 border-slate-700 shadow-lg">
                    <img 
                      src={selectedCard.currentPhoto} 
                      alt="Card preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Advanced Options */}
            <div className="pt-2">
              <Button
                onClick={() => setShowAdvanced(!showAdvanced)}
                variant="ghost"
                className="w-full text-slate-300 hover:text-slate-100 hover:bg-slate-800 justify-between py-4 rounded-lg"
              >
                <span className="text-sm font-semibold">Advanced Options</span>
                {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              
              {showAdvanced && (
                <Card className="bg-slate-800/30 border-slate-700 p-5 mt-4 rounded-lg">
                  <p className="text-xs text-slate-400 text-center">
                    Publishing settings, metadata, and other advanced options will appear here.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-6 mt-6">
            {/* Frame Selection */}
            <Card className="bg-slate-800/50 border-slate-700 p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-5">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h4 className="text-slate-100 font-bold text-lg">Card Frames</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {EXTRACTED_FRAMES.slice(0, 6).map((frame) => (
                  <button
                    key={frame.id}
                    className={`
                      aspect-video rounded-lg border-2 cursor-pointer transition-all duration-200 p-4 text-center group
                      ${cardData.template_id === frame.id 
                        ? 'border-emerald-400 bg-emerald-400/10 shadow-lg shadow-emerald-400/25' 
                        : 'border-slate-600 hover:border-emerald-400/50 hover:bg-slate-800/50'
                      }
                    `}
                    onClick={() => handleFieldUpdate('template_id', frame.id)}
                  >
                    <div className="text-slate-100 text-sm font-semibold truncate group-hover:text-emerald-400 transition-colors duration-200">
                      {frame.name}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Visual Effects */}
            <Card className="bg-slate-800/50 border-slate-700 p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-5">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h4 className="text-slate-100 font-bold text-lg">Visual Effects</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Holographic', color: '#8b5cf6' },
                  { name: 'Glow', color: '#3b82f6' },
                  { name: 'Chrome', color: '#6b7280' },
                  { name: 'Vintage', color: '#f59e0b' }
                ].map((effect) => (
                  <Button
                    key={effect.name}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 hover:border-emerald-400/50 text-sm h-12 transition-all duration-200 rounded-lg"
                    onClick={() => toast.success(`${effect.name} effect applied`)}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-3 border border-slate-400"
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

      {/* Enhanced Action Footer */}
      <footer className="p-6 border-t border-slate-800 space-y-4 bg-gradient-to-r from-slate-900 to-slate-800">
        <Button
          className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-slate-900 font-bold h-12 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-emerald-400/25 rounded-lg"
          onClick={() => toast.success(`"${cardData.title}" saved and published!`)}
        >
          <Save className="w-4 h-4 mr-2" />
          Save & Publish
        </Button>
        
        <Button
          variant="outline"
          className="w-full border-slate-600 bg-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-800 hover:border-slate-500 h-11 transition-all duration-200 rounded-lg"
          onClick={() => toast.success('Share link copied to clipboard!')}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Card
        </Button>
      </footer>
    </aside>
  );
};
