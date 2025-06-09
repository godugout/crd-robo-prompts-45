
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';

interface CardDetailsStepProps {
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
  onCreatorAttributionUpdate: (key: string, value: any) => void;
  aiAnalysisComplete: boolean;
}

const RARITY_OPTIONS = [
  { value: 'common', label: 'Common', color: 'bg-crd-lightGray' },
  { value: 'uncommon', label: 'Uncommon', color: 'bg-crd-green' },
  { value: 'rare', label: 'Rare', color: 'bg-crd-blue' },
  { value: 'epic', label: 'Epic', color: 'bg-purple-500' },
  { value: 'legendary', label: 'Legendary', color: 'bg-yellow-500' }
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-crd-white mb-2">Card Details</h2>
        <p className="text-crd-lightGray">
          {aiAnalysisComplete 
            ? 'Review and adjust the AI-generated details for your card'
            : 'Fill in the details for your card'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Fields */}
        <div className="space-y-6">
          {/* Card Title */}
          <div>
            <Label className="text-crd-lightGray text-sm font-medium mb-2">Card Title *</Label>
            <Input
              value={cardData.title}
              onChange={(e) => onFieldUpdate('title', e.target.value)}
              placeholder="Enter your card title..."
              className="bg-editor-tool border-editor-border text-crd-white"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-crd-lightGray text-sm font-medium mb-2">Description</Label>
            <Textarea
              value={cardData.description || ''}
              onChange={(e) => onFieldUpdate('description', e.target.value)}
              placeholder="Describe your card..."
              rows={3}
              className="bg-editor-tool border-editor-border text-crd-white"
            />
          </div>

          {/* Rarity */}
          <div>
            <Label className="text-crd-lightGray text-sm font-medium mb-2">Rarity</Label>
            <Select 
              value={cardData.rarity} 
              onValueChange={(value) => onFieldUpdate('rarity', value)}
            >
              <SelectTrigger className="bg-editor-tool border-editor-border text-crd-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RARITY_OPTIONS.map((rarity) => (
                  <SelectItem key={rarity.value} value={rarity.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${rarity.color}`} />
                      <span>{rarity.label}</span>
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
                  className="bg-editor-tool border-editor-border text-crd-white"
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
              
              {cardData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cardData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-editor-border text-crd-lightGray hover:bg-editor-border group"
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
            </div>
          </div>

          {/* Price (Optional) */}
          <div>
            <Label className="text-crd-lightGray text-sm font-medium mb-2">Price (Optional)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={cardData.price || ''}
              onChange={(e) => onFieldUpdate('price', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="0.00"
              className="bg-editor-tool border-editor-border text-crd-white"
            />
          </div>
        </div>

        {/* Live Preview */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-64 h-[22rem] bg-gradient-to-br from-crd-lightGray to-crd-mediumGray rounded-xl overflow-hidden shadow-2xl">
              {cardData.image_url ? (
                <img 
                  src={cardData.image_url} 
                  alt="Card preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-crd-lightGray">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-crd-mediumGray rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🖼️</span>
                    </div>
                    <p className="text-sm">Your image here</p>
                  </div>
                </div>
              )}
              
              {/* Card overlay with details */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-crd-dark/90 to-transparent p-4">
                <h3 className="text-crd-white font-bold text-lg truncate">{cardData.title}</h3>
                {cardData.description && (
                  <p className="text-crd-lightGray text-sm line-clamp-2 mt-1">{cardData.description}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    RARITY_OPTIONS.find(r => r.value === cardData.rarity)?.color || 'bg-crd-lightGray'
                  } text-crd-white`}>
                    {RARITY_OPTIONS.find(r => r.value === cardData.rarity)?.label}
                  </span>
                  {cardData.price && (
                    <span className="text-crd-green font-bold">${cardData.price}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
