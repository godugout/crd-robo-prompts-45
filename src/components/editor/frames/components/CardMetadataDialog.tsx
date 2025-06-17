
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface CardMetadataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  rarity: string;
  onSave: (data: { title: string; description: string; rarity: string }) => void;
}

export const CardMetadataDialog: React.FC<CardMetadataDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  rarity,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title,
    description,
    rarity
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ title, description, rarity });
    }
  }, [isOpen, title, description, rarity]);

  const handleSave = () => {
    onSave(formData);
  };

  const handleCancel = () => {
    setFormData({ title, description, rarity });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center justify-between">
            Edit Card Details
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="card-title" className="text-sm font-medium text-gray-700">
              Card Title
            </Label>
            <Input
              id="card-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="border-gray-300 focus:border-crd-green focus:ring-crd-green"
              placeholder="Enter card title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="card-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="border-gray-300 focus:border-crd-green focus:ring-crd-green min-h-[80px]"
              placeholder="Enter card description..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-rarity" className="text-sm font-medium text-gray-700">
              Rarity
            </Label>
            <Select 
              value={formData.rarity} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, rarity: value }))}
            >
              <SelectTrigger className="border-gray-300 focus:border-crd-green focus:ring-crd-green">
                <SelectValue placeholder="Select rarity" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 z-50">
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
