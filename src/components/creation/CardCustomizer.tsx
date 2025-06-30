
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Sparkles, Chrome, Zap } from 'lucide-react';
import { SimpleCardRenderer } from './SimpleCardRenderer';
import type { CardCreationState } from '@/types/cardCreation';

interface CardCustomizerProps {
  cardData: CardCreationState['cardData'];
  uploadedImage: string;
  onUpdateCardData: (updates: Partial<CardCreationState['cardData']>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CardCustomizer: React.FC<CardCustomizerProps> = ({
  cardData,
  uploadedImage,
  onUpdateCardData,
  onNext,
  onBack
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Controls Panel */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Customize Your Card</h2>
          <p className="text-gray-400">Add details and effects to make your card unique</p>
        </div>

        {/* Basic Info */}
        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Card Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <Input
                value={cardData.title}
                onChange={(e) => onUpdateCardData({ title: e.target.value })}
                placeholder="Enter card title"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <Textarea
                value={cardData.description}
                onChange={(e) => onUpdateCardData({ description: e.target.value })}
                placeholder="Describe your card"
                className="bg-gray-700 border-gray-600 text-white resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rarity</label>
              <Select
                value={cardData.rarity}
                onValueChange={(value) => onUpdateCardData({ rarity: value as any })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="uncommon">Uncommon</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Effects */}
        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Visual Effects</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <label className="text-sm font-medium text-gray-300">
                  Holographic ({Math.round(cardData.effects.holographic * 100)}%)
                </label>
              </div>
              <Slider
                value={[cardData.effects.holographic]}
                onValueChange={([value]) => 
                  onUpdateCardData({ effects: { ...cardData.effects, holographic: value } })
                }
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-yellow-400" />
                <label className="text-sm font-medium text-gray-300">
                  Metallic ({Math.round(cardData.effects.metallic * 100)}%)
                </label>
              </div>
              <Slider
                value={[cardData.effects.metallic]}
                onValueChange={([value]) => 
                  onUpdateCardData({ effects: { ...cardData.effects, metallic: value } })
                }
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Chrome className="w-4 h-4 text-blue-400" />
                <label className="text-sm font-medium text-gray-300">
                  Chrome ({Math.round(cardData.effects.chrome * 100)}%)
                </label>
              </div>
              <Slider
                value={[cardData.effects.chrome]}
                onValueChange={([value]) => 
                  onUpdateCardData({ effects: { ...cardData.effects, chrome: value } })
                }
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Particle Effects</label>
              <Switch
                checked={cardData.effects.particles}
                onCheckedChange={(checked) => 
                  onUpdateCardData({ effects: { ...cardData.effects, particles: checked } })
                }
              />
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Back
          </Button>
          <Button
            onClick={onNext}
            className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            Preview Card
          </Button>
        </div>
      </div>

      {/* Live 3D Preview */}
      <div className="h-96 lg:h-full">
        <SimpleCardRenderer
          imageUrl={uploadedImage}
          effects={cardData.effects}
        />
      </div>
    </div>
  );
};
