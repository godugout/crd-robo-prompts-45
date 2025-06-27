
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Folder, Users, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface QuickCreateCollectionProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const QuickCreateCollection: React.FC<QuickCreateCollectionProps> = ({
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'private',
    tags: [] as string[]
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

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Collection name is required');
      return;
    }

    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Collection created successfully!');
      setIsCreating(false);
      onSuccess();
    }, 1000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Folder className="w-5 h-5 text-crd-green" />
            Create New Collection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Collection Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Collection Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter collection name..."
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your collection..."
              rows={3}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label className="text-white">Visibility</Label>
            <Select 
              value={formData.visibility} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="private" className="text-white hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Private - Only you can see
                  </div>
                </SelectItem>
                <SelectItem value="public" className="text-white hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Public - Everyone can see
                  </div>
                </SelectItem>
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
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add a tag..."
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 flex-1"
              />
              <Button
                onClick={handleAddTag}
                disabled={!newTag.trim() || formData.tags.length >= 5}
                size="sm"
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-crd-green text-crd-green hover:bg-crd-green/10 group cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-1 group-hover:text-red-400" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!formData.name.trim() || isCreating}
            className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            {isCreating ? 'Creating...' : 'Create Collection'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
