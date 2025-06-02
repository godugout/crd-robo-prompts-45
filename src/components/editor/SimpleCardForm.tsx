
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSimpleCardEditor } from '@/hooks/useSimpleCardEditor';
import { useDropzone } from 'react-dropzone';
import { uploadCardImage } from '@/lib/cardImageUploader';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { CardRarity } from '@/types/card';

export const SimpleCardForm = () => {
  const { user } = useAuth();
  const { cardData, updateField, saveCard, publishCard, isSaving } = useSimpleCardEditor();
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length || !user) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    try {
      const result = await uploadCardImage({
        file,
        cardId: cardData.id || 'temp',
        userId: user.id
      });

      if (result) {
        updateField('image_url', result.url);
        if (result.thumbnailUrl) {
          updateField('thumbnail_url', result.thumbnailUrl);
        }
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  const addTag = () => {
    if (tagInput.trim() && !cardData.tags.includes(tagInput.trim()) && cardData.tags.length < 10) {
      updateField('tags', [...cardData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateField('tags', cardData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please sign in to create cards
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload */}
          <div>
            <Label>Card Image</Label>
            <div
              {...getRootProps()}
              className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              {cardData.image_url ? (
                <div className="space-y-2">
                  <img 
                    src={cardData.image_url} 
                    alt="Card preview" 
                    className="max-h-40 mx-auto rounded"
                  />
                  <p className="text-sm text-gray-600">Click or drag to replace image</p>
                </div>
              ) : (
                <div>
                  {isUploading ? (
                    <p>Uploading...</p>
                  ) : (
                    <p>Drag and drop an image here, or click to select</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={cardData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter card title"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={cardData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Enter card description"
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Rarity */}
          <div>
            <Label>Rarity</Label>
            <Select 
              value={cardData.rarity} 
              onValueChange={(value) => updateField('rarity', value as CardRarity)}
            >
              <SelectTrigger className="mt-1">
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

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="mt-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag and press Enter"
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              {cardData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cardData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={saveCard} 
              disabled={isSaving || !cardData.title.trim()}
              className="flex-1"
            >
              {isSaving ? 'Saving...' : 'Save Card'}
            </Button>
            <Button 
              onClick={publishCard} 
              disabled={isSaving || !cardData.title.trim()}
              variant="outline"
              className="flex-1"
            >
              Save & Publish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
