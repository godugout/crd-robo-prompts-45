
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCardTemplates } from '@/hooks/creator/useCardTemplates';
import { Upload } from 'lucide-react';

interface CreateTemplateModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ open, onClose }) => {
  const { createTemplate } = useCardTemplates();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 9.99,
    category: '',
    tags: [] as string[],
    is_premium: false,
    template_data: {},
    preview_images: [] as string[],
  });

  const [currentTag, setCurrentTag] = useState('');

  const categories = [
    'Sports Cards',
    'Trading Cards',
    'Fantasy Art',
    'Abstract',
    'Vintage',
    'Modern',
    'Minimalist',
    'Gaming',
    'Photography',
    'Artistic',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createTemplate.mutateAsync(formData);
      onClose();
      setFormData({
        name: '',
        description: '',
        price: 9.99,
        category: '',
        tags: [],
        is_premium: false,
        template_data: {},
        preview_images: [],
      });
    } catch (error) {
      console.error('Template creation failed:', error);
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
      <DialogContent className="bg-crd-dark border-crd-mediumGray max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Template</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Template Name *</Label>
              <Input
                id="name"
                required
                placeholder="Enter template name"
                className="bg-crd-mediumGray border-crd-lightGray text-white"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-white">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                min="0.99"
                step="0.01"
                required
                className="bg-crd-mediumGray border-crd-lightGray text-white"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your template and what makes it special..."
              className="bg-crd-mediumGray border-crd-lightGray text-white"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-white">Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                className="bg-crd-mediumGray border-crd-lightGray text-white"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-crd-mediumGray text-white px-2 py-1 rounded text-sm cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Label className="text-white">Premium Template</Label>
              <p className="text-sm text-crd-lightGray">
                Premium templates get featured placement and higher visibility
              </p>
            </div>
            <Switch
              checked={formData.is_premium}
              onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Preview Images</Label>
            <div className="border-2 border-dashed border-crd-mediumGray rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-crd-lightGray mx-auto mb-2" />
              <p className="text-crd-lightGray">
                Upload preview images of your template
              </p>
              <Button type="button" variant="outline" className="mt-2">
                Choose Files
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-crd-green hover:bg-green-600 text-black flex-1"
              disabled={createTemplate.isPending}
            >
              {createTemplate.isPending ? 'Creating...' : 'Create Template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
