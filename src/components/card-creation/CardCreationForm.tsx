
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDropzone } from 'react-dropzone';
import { useCardCreation } from '@/hooks/useCardCreation';
import { Upload, X, Plus } from 'lucide-react';
import type { CardRarity } from '@/types/card';

const RARITIES: { value: CardRarity; label: string; color: string }[] = [
  { value: 'common', label: 'Common', color: 'text-gray-600' },
  { value: 'uncommon', label: 'Uncommon', color: 'text-green-600' },
  { value: 'rare', label: 'Rare', color: 'text-blue-600' },
  { value: 'epic', label: 'Epic', color: 'text-purple-600' },
  { value: 'legendary', label: 'Legendary', color: 'text-yellow-600' }
];

export const CardCreationForm: React.FC = () => {
  const {
    cardData,
    updateCardData,
    uploadImage,
    createCard,
    addTag,
    removeTag,
    isCreating
  } = useCardCreation();

  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0];
    setIsUploading(true);
    await uploadImage(file);
    setIsUploading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    disabled: isUploading
  });

  const handleAddTag = () => {
    if (tagInput.trim()) {
      addTag(tagInput);
      setTagInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleCreateCard = async () => {
    const success = await createCard();
    if (success) {
      // Could redirect to card gallery or show success message
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload */}
          <div>
            <Label className="text-lg font-medium">Card Image</Label>
            <div
              {...getRootProps()}
              className={`mt-2 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              {cardData.image_url ? (
                <div className="space-y-4">
                  <img 
                    src={cardData.image_url} 
                    alt="Card preview" 
                    className="max-h-64 mx-auto rounded-lg shadow-lg"
                  />
                  <p className="text-sm text-gray-600">
                    {isUploading ? 'Uploading...' : 'Click or drag to replace image'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium">
                      {isUploading ? 'Uploading...' : 'Upload Card Image'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Drag and drop an image here, or click to select
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-lg font-medium">Title *</Label>
                <Input
                  id="title"
                  value={cardData.title}
                  onChange={(e) => updateCardData({ title: e.target.value })}
                  placeholder="Enter card title"
                  className="mt-1 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-lg font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={cardData.description}
                  onChange={(e) => updateCardData({ description: e.target.value })}
                  placeholder="Describe your card..."
                  className="mt-1 min-h-[120px]"
                  rows={5}
                />
              </div>

              <div>
                <Label className="text-lg font-medium">Rarity</Label>
                <Select 
                  value={cardData.rarity} 
                  onValueChange={(value) => updateCardData({ rarity: value as CardRarity })}
                >
                  <SelectTrigger className="mt-1">
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

            {/* Tags */}
            <div>
              <Label className="text-lg font-medium">Tags</Label>
              <div className="mt-1 space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddTag}
                    variant="outline"
                    disabled={!tagInput.trim() || cardData.tags.length >= 10}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {cardData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {cardData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  {cardData.tags.length}/10 tags used
                </p>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <div className="pt-4 border-t">
            <Button 
              onClick={handleCreateCard}
              disabled={isCreating || !cardData.title.trim() || !cardData.image_url}
              className="w-full md:w-auto px-8 py-3 text-lg"
              size="lg"
            >
              {isCreating ? 'Creating Card...' : 'Create Card'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
