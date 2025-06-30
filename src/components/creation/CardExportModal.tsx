
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Share2, X } from 'lucide-react';
import { CardRenderer } from './CardRenderer';
import { toast } from 'sonner';

interface CardExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: {
    title: string;
    description: string;
    imageUrl: string;
    frameId: string;
  };
}

export const CardExportModal: React.FC<CardExportModalProps> = ({
  isOpen,
  onClose,
  cardData
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const exportCard = async (format: 'png' | 'jpg' = 'png', scale: number = 2) => {
    if (!cardRef.current) return;

    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: 'transparent',
        scale,
        useCORS: true,
        allowTaint: true,
        width: 300 * scale,
        height: 420 * scale
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${cardData.title.replace(/\s+/g, '_')}.${format}`;
      link.href = canvas.toDataURL(`image/${format}`, format === 'jpg' ? 0.9 : 1.0);
      link.click();

      toast.success(`Card exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: cardData.title,
          text: `Check out my card: ${cardData.title}`,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Card URL copied to clipboard!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Export Your Card
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Preview */}
          <div className="flex justify-center">
            <div ref={cardRef}>
              <CardRenderer
                imageUrl={cardData.imageUrl}
                frameId={cardData.frameId}
                title={cardData.title}
                description={cardData.description}
                width={200}
                height={280}
              />
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <h4 className="font-medium text-white">Export Options</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => exportCard('png', 2)}
                disabled={isExporting}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Download className="w-4 h-4 mr-2" />
                PNG (High Quality)
              </Button>
              <Button
                onClick={() => exportCard('jpg', 2)}
                disabled={isExporting}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                JPG (Smaller)
              </Button>
            </div>
            
            <Button
              onClick={shareCard}
              variant="outline"
              className="w-full border-crd-green text-crd-green hover:bg-crd-green/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Card
            </Button>
          </div>

          {isExporting && (
            <div className="text-center text-sm text-gray-400">
              Preparing your card for download...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
