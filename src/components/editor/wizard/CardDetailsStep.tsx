
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus, Sparkles } from 'lucide-react';
import { CardDetailsValidation } from './CardDetailsValidation';
import type { CardData } from '@/hooks/useCardEditor';

interface CardDetailsStepProps {
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
  onCreatorAttributionUpdate: (key: string, value: any) => void;
  aiAnalysisComplete: boolean;
}

const RARITY_OPTIONS = [
  { value: 'common', label: 'Common', color: 'bg-crd-lightGray', description: 'Standard cards, widely available' },
  { value: 'uncommon', label: 'Uncommon', color: 'bg-crd-green', description: 'Notable quality, moderately rare' },
  { value: 'rare', label: 'Rare', color: 'bg-crd-blue', description: 'High quality, limited availability' },
  { value: 'epic', label: 'Epic', color: 'bg-purple-500', description: 'Exceptional quality, very rare' },
  { value: 'legendary', label: 'Legendary', color: 'bg-yellow-500', description: 'Ultimate quality, extremely rare' }
];

const SUGGESTED_TAGS = [
  'portrait', 'landscape', 'nature', 'urban', 'vintage', 'modern', 
  'sports', 'gaming', 'art', 'photography', 'digital', 'classic',
  'creative', 'professional', 'casual', 'action', 'peaceful', 'dynamic'
];

export const CardDetailsStep = ({ 
  cardData, 
  onFieldUpdate, 
  onCreatorAttributionUpdate,
  aiAnalysisComplete 
}: CardDetailsStepProps) => {
  const [newTag, setNewTag] = React.useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !cardData.tags.includes(newTag.trim()) && cardData.tags.length < 10) {
      onFieldUpdate('tags', [...cardData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onFieldUpdate('tags', cardData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSuggestedTagClick = (tag: string) => {
    if (!cardData.tags.includes(tag) && cardData.tags.length < 10) {
      onFieldUpdate('tags', [...cardData.tags, tag]);
    }
  };

  const availableSuggestedTags = SUGGESTED_TAGS.filter(tag => !cardData.tags.includes(tag));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-crd-white mb-2">Card Details</h2>
        <p className="text-crd-lightGray">
          {aiAnalysisComplete 
            ? 'Review and adjust the AI-generated details for your card'
            : 'Fill in the details to bring your card to life'
          }
        </p>
        {aiAnalysisComplete && (
          <Badge className="mt-2 bg-crd-green/20 text-crd-green border-crd-green">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Enhanced
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Title */}
          <div>
            <Label className="text-crd-lightGray text-sm font-medium mb-2 flex items-center">
              Card Title *
              <span className="ml-2 text-xs text-crd-lightGray">({cardData.title?.length || 0}/50)</span>
            </Label>
            <Input
              value={cardData.title}
              onChange={(e) => onFieldUpdate('title', e.target.value)}
              placeholder="Enter your card title..."
              maxLength={50}
              className="bg-editor-tool border-editor-border text-crd-white focus:border-crd-green"
            />
            {cardData.title && cardData.title.length < 3 && (
              <p className="text-red-400 text-xs mt-1">Title must be at least 3 characters</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label className="text-crd-lightGray text-sm font-medium mb-2 flex items-center">
              Description
              <span className="ml-2 text-xs text-crd-lightGray">({cardData.description?.length || 0}/200)</span>
            </Label>
            <Textarea
              value={cardData.description || ''}
              onChange={(e) => onFieldUpdate('description', e.target.value)}
              placeholder="Describe your card, tell its story..."
              maxLength={200}
              rows={3}
              className="bg-editor-tool border-editor-border text-crd-white focus:border-crd-green resize-none"
            />
          </div>

          {/* Rarity */}
          <div>
            <Label className="text-crd-lightGray text-sm font-medium mb-2">Rarity</Label>
            <Select 
              value={cardData.rarity} 
              onValueChange={(value) => onFieldUpdate('rarity', value)}
            >
              <SelectTrigger className="bg-editor-tool border-editor-border text-crd-white focus:border-crd-green">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-editor-dark border-editor-border">
                {RARITY_OPTIONS.map((rarity) => (
                  <SelectItem key={rarity.value} value={rarity.value} className="text-crd-white">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${rarity.color}`} />
                      <div>
                        <div className="font-medium">{rarity.label}</div>
                        <div className="text-xs text-crd-lightGray">{rarity.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-crd-lightGray text-sm font-medium mb-2">
              Tags ({cardData.tags.length}/10)
            </Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="bg-editor-tool border-editor-border text-crd-white focus:border-crd-green"
                  disabled={cardData.tags.length >= 10}
                />
                <Button
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || cardData.tags.length >= 10}
                  size="sm"
                  className="bg-crd-green hover:bg-crd-green/90 text-crd-dark"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Current Tags */}
              {cardData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cardData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-crd-green/30 text-crd-green hover:bg-crd-green/10 group"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Suggested Tags */}
              {availableSuggestedTags.length > 0 && cardData.tags.length < 10 && (
                <div>
                  <p className="text-xs text-crd-lightGray mb-2">Suggested tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSuggestedTags.slice(0, 8).map((tag) => (
                      <Button
                        key={tag}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSuggestedTagClick(tag)}
                        className="text-xs border border-editor-border text-crd-lightGray hover:text-white hover:border-crd-green/50"
                      >
                        + {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Price (Optional) */}
          <div>
            <Label className="text-crd-lightGray text-sm font-medium mb-2">Price (Optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray">$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="999.99"
                value={cardData.price || ''}
                onChange={(e) => onFieldUpdate('price', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="0.00"
                className="pl-8 bg-editor-tool border-editor-border text-crd-white focus:border-crd-green"
              />
            </div>
            <p className="text-xs text-crd-lightGray mt-1">
              Set a price if you plan to sell this card on the marketplace
            </p>
          </div>
        </div>

        {/* Validation Sidebar */}
        <div className="lg:col-span-1">
          <CardDetailsValidation cardData={cardData} />
        </div>
      </div>
    </div>
  );
};
