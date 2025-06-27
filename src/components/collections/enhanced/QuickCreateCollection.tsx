
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Sparkles, Lock, Globe, Users } from 'lucide-react';

interface QuickCreateCollectionProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const QuickCreateCollection: React.FC<QuickCreateCollectionProps> = ({
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: 'private',
    tags: [] as string[],
    template: ''
  });
  const [newTag, setNewTag] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess();
    } catch (error) {
      console.error('Error creating collection:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const visibilityOptions = [
    { value: 'private', label: 'Private', icon: Lock, description: 'Only you can see this collection' },
    { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can discover and view' },
    { value: 'shared', label: 'Shared', icon: Users, description: 'Share with specific people' }
  ];

  const templates = [
    { id: 'blank', name: 'Blank Collection', description: 'Start from scratch' },
    { id: 'sports', name: 'Sports Collection', description: 'Perfect for sports cards' },
    { id: 'pokemon', name: 'Trading Cards', description: 'Classic trading card layout' },
    { id: 'art', name: 'Art Gallery', description: 'Showcase artistic creations' }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white text-xl">Create New Collection</CardTitle>
            <p className="text-gray-400 text-sm mt-1">Organize your cards into a beautiful collection</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Collection Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter collection name..."
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your collection..."
                  rows={3}
                  className="bg-gray-800 border-gray-600 text-white resize-none"
                />
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Choose Template
              </label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      formData.template === template.id
                        ? 'ring-2 ring-crd-green bg-crd-green/10 border-crd-green'
                        : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, template: template.id }))}
                  >
                    <CardContent className="p-3">
                      <h4 className="text-white font-medium text-sm">{template.name}</h4>
                      <p className="text-gray-400 text-xs mt-1">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Visibility
              </label>
              <div className="grid grid-cols-1 gap-2">
                {visibilityOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Card
                      key={option.value}
                      className={`cursor-pointer transition-all ${
                        formData.visibility === option.value
                          ? 'ring-2 ring-crd-green bg-crd-green/10 border-crd-green'
                          : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, visibility: option.value }))}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-gray-400" />
                          <div>
                            <h4 className="text-white font-medium text-sm">{option.label}</h4>
                            <p className="text-gray-400 text-xs">{option.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tags (Optional)
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag..."
                  className="bg-gray-800 border-gray-600 text-white flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || formData.tags.length >= 5}
                  size="sm"
                  className="bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-crd-green text-crd-green hover:bg-crd-green/10 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Add up to 5 tags to help organize your collection
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.title.trim() || isCreating}
                className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Collection
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
