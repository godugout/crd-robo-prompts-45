
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save } from 'lucide-react';
import type { CardMetadata } from '@/services/cardAnalyzer/CardMetadataAnalyzer';

interface CardFormData {
  title: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  rarity: string;
  tags: string[];
  sports_metadata: CardMetadata;
}

export interface CardDetailsFormProps {
  initialData: CardFormData;
  onSubmit: (data: CardFormData) => void;
  previewImage: string;
}

export const CardDetailsForm: React.FC<CardDetailsFormProps> = ({
  initialData,
  onSubmit,
  previewImage
}) => {
  const [formData, setFormData] = useState<CardFormData>(initialData);
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: keyof CardFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Form Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Card Details</h3>
          <p className="text-gray-400 text-sm mb-6">
            Complete your card information and publish to your collection
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-white">Card Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter card title"
              className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-white">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your card..."
              rows={3}
              className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Rarity */}
          <div className="space-y-2">
            <Label className="text-white">Rarity</Label>
            <Select value={formData.rarity} onValueChange={(value) => handleInputChange('rarity', value)}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="uncommon">Uncommon</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-white">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                size="icon"
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-200">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Sports Metadata (if available) */}
          {Object.keys(formData.sports_metadata).length > 0 && (
            <div className="space-y-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <h4 className="text-white font-medium">Detected Sports Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {formData.sports_metadata.player && (
                  <div>
                    <span className="text-gray-400">Player:</span>
                    <span className="text-white ml-2">{formData.sports_metadata.player}</span>
                  </div>
                )}
                {formData.sports_metadata.team && (
                  <div>
                    <span className="text-gray-400">Team:</span>
                    <span className="text-white ml-2">{formData.sports_metadata.team}</span>
                  </div>
                )}
                {formData.sports_metadata.year && (
                  <div>
                    <span className="text-gray-400">Year:</span>
                    <span className="text-white ml-2">{formData.sports_metadata.year}</span>
                  </div>
                )}
                {formData.sports_metadata.brand && (
                  <div>
                    <span className="text-gray-400">Brand:</span>
                    <span className="text-white ml-2">{formData.sports_metadata.brand}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            Create Card
          </Button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Preview</h3>
        </div>
        
        <Card className="bg-gray-800/50 border-gray-600 p-6">
          <div className="aspect-[2.5/3.5] w-full max-w-sm mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-xl">
            <img
              src={previewImage}
              alt="Card preview"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="mt-4 space-y-2">
            <h4 className="text-white font-semibold">{formData.title || 'Untitled Card'}</h4>
            {formData.description && (
              <p className="text-gray-400 text-sm">{formData.description}</p>
            )}
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`border-current ${
                  formData.rarity === 'legendary' ? 'text-yellow-400' :
                  formData.rarity === 'epic' ? 'text-purple-400' :
                  formData.rarity === 'rare' ? 'text-blue-400' :
                  formData.rarity === 'uncommon' ? 'text-green-400' :
                  'text-gray-400'
                }`}
              >
                {formData.rarity}
              </Badge>
              {formData.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-200 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
