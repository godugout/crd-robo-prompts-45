
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CardRarity } from '@/types/card';

const RARITIES: { value: CardRarity; label: string; color: string }[] = [
  { value: 'common', label: 'Common', color: 'text-gray-400' },
  { value: 'uncommon', label: 'Uncommon', color: 'text-green-400' },
  { value: 'rare', label: 'Rare', color: 'text-blue-400' },
  { value: 'epic', label: 'Epic', color: 'text-purple-400' },
  { value: 'legendary', label: 'Legendary', color: 'text-yellow-400' }
];

interface CustomizeStepProps {
  cardTitle: string;
  cardDescription: string;
  cardRarity: CardRarity;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onRarityChange: (rarity: CardRarity) => void;
}

export const CustomizeStep: React.FC<CustomizeStepProps> = ({
  cardTitle,
  cardDescription,
  cardRarity,
  onTitleChange,
  onDescriptionChange,
  onRarityChange
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <label className="block text-sm font-medium text-crd-lightGray mb-2">
          Card Title *
        </label>
        <Input
          value={cardTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter your card title"
          className="bg-[#353945] border-crd-mediumGray text-crd-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-crd-lightGray mb-2">
          Description
        </label>
        <Textarea
          value={cardDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe your card..."
          rows={3}
          className="bg-[#353945] border-crd-mediumGray text-crd-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-crd-lightGray mb-2">
          Rarity
        </label>
        <Select 
          value={cardRarity} 
          onValueChange={(value) => onRarityChange(value as CardRarity)}
        >
          <SelectTrigger className="bg-[#353945] border-crd-mediumGray text-crd-white">
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
  );
};
