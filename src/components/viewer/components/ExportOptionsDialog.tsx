
import React, { useState } from 'react';
import { Download, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface ExportOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cardTitle: string;
  cardElementRef: React.RefObject<HTMLDivElement>;
}

export const ExportOptionsDialog: React.FC<ExportOptionsDialogProps> = ({
  isOpen,
  onClose,
  cardTitle,
  cardElementRef
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleExport = async () => {
    if (!cardElementRef.current) {
      toast.error('Card not ready for export');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate progress
      setExportProgress(30);

      // Capture the card element
      const canvas = await html2canvas(cardElementRef.current, {
        backgroundColor: 'transparent',
        scale: 3,
        useCORS: true,
        allowTaint: true
      });

      setExportProgress(70);

      // Add simple watermark
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText('CRD', canvas.width - 20, 20);
        ctx.restore();
      }

      setExportProgress(90);

      // Download the image
      const link = document.createElement('a');
      link.download = `${cardTitle.replace(/\s+/g, '_')}_card.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      setExportProgress(100);
      toast.success('Card exported successfully!');
      setTimeout(() => {
        onClose();
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export card');
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  if (isExporting) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-editor-dark border-editor-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Exporting Card...
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-center space-y-2">
              <div className="text-crd-lightGray text-sm">Creating high-resolution image...</div>
              <Progress value={exportProgress} className="w-full" />
              <div className="text-white text-sm">{exportProgress}%</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-editor-dark border-editor-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Export "{cardTitle}"
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-crd-lightGray hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center space-y-4">
            <Image className="w-16 h-16 text-crd-green mx-auto" />
            <div>
              <h3 className="text-white font-medium mb-2">High-Resolution PNG Export</h3>
              <p className="text-crd-lightGray text-sm">
                Export your card as a high-quality PNG image with transparent background.
              </p>
            </div>
          </div>

          <div className="bg-editor-tool p-4 rounded-lg">
            <h4 className="text-white font-medium text-sm mb-2">Export Details</h4>
            <div className="space-y-1 text-xs text-crd-lightGray">
              <div>• Format: PNG (transparent background)</div>
              <div>• Resolution: 3x scale (high quality)</div>
              <div>• Watermark: Small "CRD" logo included</div>
              <div>• Output: Ready for sharing or printing</div>
            </div>
          </div>

          <Button
            onClick={handleExport}
            className="w-full bg-crd-green hover:bg-crd-green/80 text-black"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
