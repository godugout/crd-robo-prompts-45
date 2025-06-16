
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageCropper } from '../ImageCropper';
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
      <DialogContent className="max-w-4xl bg-editor-dark border-editor-border">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Crop className="w-5 h-5" />
            Crop Image
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
          <ImageCropper
            imageUrl={imageUrl}
            onCropComplete={handleCropComplete}
            aspectRatio={2.5 / 3.5}
            className="max-h-[60vh]"
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
