
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, X } from 'lucide-react';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    description: string;
    visibility: 'private' | 'public';
  }) => void;
  isLoading?: boolean;
}

export const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  isLoading = false
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'public'>('private');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      name: name.trim(),
      description: description.trim(),
      visibility
    });

    // Reset form
    setName('');
    setDescription('');
    setVisibility('private');
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while loading
    onClose();
    // Reset form
    setName('');
    setDescription('');
    setVisibility('private');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-crd-dark border-crd-mediumGray">
        <DialogHeader>
          <DialogTitle className="text-crd-white flex items-center justify-between">
            Create New Collection
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isLoading}
              className="text-crd-lightGray hover:text-crd-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-crd-white">
              Collection Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter collection name..."
              className="bg-crd-darkGray border-crd-mediumGray text-crd-white"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-crd-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your collection..."
              className="bg-crd-darkGray border-crd-mediumGray text-crd-white min-h-[80px]"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility" className="text-crd-white">
              Visibility
            </Label>
            <Select
              value={visibility}
              onValueChange={(value: 'private' | 'public') => setVisibility(value)}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-crd-darkGray border-crd-mediumGray text-crd-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-crd-dark border-crd-mediumGray">
                <SelectItem value="private" className="text-crd-white">
                  Private - Only you can see this collection
                </SelectItem>
                <SelectItem value="public" className="text-crd-white">
                  Public - Anyone can discover this collection
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 border-crd-mediumGray text-crd-lightGray hover:text-crd-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Collection'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
