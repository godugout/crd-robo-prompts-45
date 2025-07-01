
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { savePSDAsCard } from '@/services/psdCardSaver';
import { Save, Sparkles } from 'lucide-react';

interface SavePSDCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  processedPSD: EnhancedProcessedPSD;
  selectedLayerIds: string[];
}

export const SavePSDCardDialog: React.FC<SavePSDCardDialogProps> = ({
  isOpen,
  onClose,
  processedPSD,
  selectedLayerIds
}) => {
  const [title, setTitle] = useState(processedPSD.fileName.replace('.psd', ''));
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      await savePSDAsCard({
        title: title.trim(),
        description: description.trim() || undefined,
        imageUrl: processedPSD.flattenedImageUrl,
        thumbnailUrl: processedPSD.thumbnailUrl,
        processedPSD,
        selectedLayerIds
      });
      
      onClose();
    } catch (error) {
      // Error handling is done in the service
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-crd-green" />
            Save to CRD Catalog
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
            <img 
              src={processedPSD.thumbnailUrl || processedPSD.flattenedImageUrl} 
              alt="Card preview"
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="text-sm text-slate-300">
                {processedPSD.width} × {processedPSD.height}px
              </p>
              <p className="text-xs text-slate-400">
                {processedPSD.layers.length} layers • {selectedLayerIds.length} selected
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="card-title" className="text-slate-300">
                Card Title *
              </Label>
              <Input
                id="card-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter card title"
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="card-description" className="text-slate-300">
                Description (Optional)
              </Label>
              <Textarea
                id="card-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your reconstructed card..."
                className="bg-slate-800 border-slate-600 text-white h-20"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim() || isSaving}
              className="flex-1 bg-crd-green text-black hover:bg-crd-green/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Card'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
