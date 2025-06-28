
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useTags } from '@/components/memory/hooks/useTags';

interface CardDetailsFormProps {
  cardData: {
    title: string;
    description: string;
    rarity: string;
  };
  onUpdateCardData: (updates: any) => void;
}

const RARITIES = [
  { value: 'common', label: 'Common', color: 'text-gray-400' },
  { value: 'uncommon', label: 'Uncommon', color: 'text-green-400' },
  { value: 'rare', label: 'Rare', color: 'text-blue-400' },
  { value: 'epic', label: 'Epic', color: 'text-purple-400' },
  { value: 'legendary', label: 'Legendary', color: 'text-yellow-400' }
];

export const CardDetailsForm: React.FC<CardDetailsFormProps> = ({
  cardData,
  onUpdateCardData
}) => {
  const { tags, handleTagInput, handlePaste, removeTag, hasMaxTags } = useTags([], { maxTags: 5 });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Card Details</h3>
        <p className="text-gray-400">Add information to bring your card to life</p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">
            Card Title *
          </Label>
          <Input
            id="title"
            value={cardData.title}
            onChange={(e) => onUpdateCardData({ title: e.target.value })}
            placeholder="Enter your card title..."
            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
          />
          <p className="text-xs text-gray-400">
            Choose a memorable name for your card
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">
            Description
          </Label>
          <Textarea
            id="description"
            value={cardData.description}
            onChange={(e) => onUpdateCardData({ description: e.target.value })}
            placeholder="Describe your card..."
            rows={3}
            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 resize-none"
          />
          <p className="text-xs text-gray-400">
            Tell the story behind your card (optional)
          </p>
        </div>

        {/* Rarity */}
        <div className="space-y-2">
          <Label className="text-white">Rarity</Label>
          <Select 
            value={cardData.rarity} 
            onValueChange={(value) => onUpdateCardData({ rarity: value })}
          >
            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {RARITIES.map(rarity => (
                <SelectItem 
                  key={rarity.value} 
                  value={rarity.value}
                  className="text-white hover:bg-gray-700"
                >
                  <span className={rarity.color}>{rarity.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-400">
            Rarity affects the card's visual treatment and value
          </p>
        </div>

        {/* Enhanced Tags with Multi-delimiter Support */}
        <div className="space-y-2">
          <Label className="text-white">Tags</Label>
          <Input
            onKeyDown={handleTagInput}
            onPaste={handlePaste}
            placeholder={hasMaxTags ? "Maximum 5 tags reached" : "Add tags (use commas to separate multiple tags)"}
            disabled={hasMaxTags}
            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
          />
          <p className="text-xs text-gray-400">
            Add up to 5 tags. Separate multiple tags with commas, semicolons, or paste from clipboard
          </p>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-crd-green text-crd-green hover:bg-crd-green/10 group cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X className="w-3 h-3 ml-1 group-hover:text-red-400" />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Summary */}
      <Card className="p-4 bg-black/30 border-white/20">
        <h4 className="text-white font-medium mb-3">Card Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Title:</span>
            <span className="text-white">{cardData.title || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Rarity:</span>
            <span className={RARITIES.find(r => r.value === cardData.rarity)?.color || 'text-white'}>
              {RARITIES.find(r => r.value === cardData.rarity)?.label || cardData.rarity}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Tags:</span>
            <span className="text-white">{tags.length}/5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Description:</span>
            <span className="text-white">{cardData.description ? 'Added' : 'Optional'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
