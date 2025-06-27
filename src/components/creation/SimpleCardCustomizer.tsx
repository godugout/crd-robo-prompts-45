
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardRenderer } from './CardRenderer';

const RARITIES = [
  { value: 'common', label: 'Common', color: 'text-gray-400' },
  { value: 'uncommon', label: 'Uncommon', color: 'text-green-400' },
  { value: 'rare', label: 'Rare', color: 'text-blue-400' },
  { value: 'epic', label: 'Epic', color: 'text-purple-400' },
  { value: 'legendary', label: 'Legendary', color: 'text-yellow-400' }
];

interface SimpleCardCustomizerProps {
  cardData: any;
  uploadedImage: string;
  onUpdateCardData: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const SimpleCardCustomizer: React.FC<SimpleCardCustomizerProps> = ({
  cardData,
  uploadedImage,
  onUpdateCardData,
  onNext,
  onBack
}) => {
  const canContinue = cardData.title.trim() !== '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Customization Panel */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Customize Your Card</h2>
          <p className="text-gray-400">Add details to make your card unique</p>
        </div>

        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Card Title *
              </label>
              <Input
                value={cardData.title}
                onChange={(e) => onUpdateCardData({ title: e.target.value })}
                placeholder="Enter your card title"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <Textarea
                value={cardData.description}
                onChange={(e) => onUpdateCardData({ description: e.target.value })}
                placeholder="Describe your card..."
                rows={3}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rarity
              </label>
              <Select 
                value={cardData.rarity} 
                onValueChange={(value) => onUpdateCardData({ rarity: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RARITIES.map((rarity) => (
                    <SelectItem key={rarity.value} value={rarity.value}>
                      <span className={rarity.color}>{rarity.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Back to Frames
          </Button>
          <Button
            onClick={onNext}
            disabled={!canContinue}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            Preview Card
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="flex items-center justify-center">
        <CardRenderer
          imageUrl={uploadedImage}
          frameId={cardData.frame}
          title={cardData.title || 'Card Title'}
          description={cardData.description || 'Card Description'}
          width={300}
          height={420}
          className="shadow-2xl"
        />
      </div>
    </div>
  );
};
