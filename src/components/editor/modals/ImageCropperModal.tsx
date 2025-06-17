
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EnhancedImageCropper } from '../crop/EnhancedImageCropper';
import { Crop, X } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onCropComplete
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = async (croppedImageUrl: string) => {
    setIsProcessing(true);
    try {
      onCropComplete(croppedImageUrl);
      onClose();
    } catch (error) {
      console.error('Crop failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-editor-dark border-editor-border overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Crop className="w-5 h-5" />
            Enhanced Crop Image
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:bg-editor-border"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg">
            <strong>Enhanced Crop Controls:</strong>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• Drag corners to resize while maintaining 2.5:3.5 aspect ratio</li>
              <li>• Use rotation handle above crop area</li>
              <li>• Quick actions: Center, Fit, and Reset</li>
              <li>• Undo/Redo support for all changes</li>
            </ul>
          </div>
          
          <EnhancedImageCropper
            imageUrl={imageUrl}
            onCropComplete={handleCropComplete}
            aspectRatio={2.5 / 3.5}
            className="max-h-[70vh] overflow-hidden"
            compact={true}
          />
          
          <div className="flex justify-end gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-editor-border text-white"
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
