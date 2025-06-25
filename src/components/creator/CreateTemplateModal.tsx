
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCardTemplates } from '@/hooks/creator/useCardTemplates';
import { X } from 'lucide-react';

interface CreateTemplateModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ open, onClose }) => {
  const { createTemplate } = useCardTemplates();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    tags: [] as string[],
    is_premium: false,
  });
  const [currentTag, setCurrentTag] = useState('');

  const categories = [
    'Sports Cards',
    'Trading Cards',
    'Business Cards',
    'Art Cards',
    'Gaming Cards',
    'Custom Cards',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      return;
    }

    try {
      await createTemplate.mutateAsync({
        ...formData,
        template_data: {},
        preview_images: [],
      });
      onClose();
      setFormData({
        name: '',
        description: '',
        category: '',
        price: 0,
        tags: [],
        is_premium: false,
      });
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-crd-dark border-crd-mediumGray text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-crd-mediumGray border-crd-lightGray text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-crd-mediumGray border-crd-lightGray">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-crd-mediumGray border-crd-lightGray text-white"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="bg-crd-mediumGray border-crd-lightGray text-white"
            />
          </div>

          <div className="space-y-4">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="bg-crd-mediumGray border-crd-lightGray text-white"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer flex items-center gap-1"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_premium"
              checked={formData.is_premium}
              onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="is_premium">Premium Template</Label>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-crd-green hover:bg-green-600 text-black flex-1"
              disabled={createTemplate.isPending}
            >
              {createTemplate.isPending ? 'Creating...' : 'Create Template'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
