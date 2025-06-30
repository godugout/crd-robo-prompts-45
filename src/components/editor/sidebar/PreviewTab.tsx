
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download, Share2, Sparkles, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { toast } from 'sonner';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';

interface PreviewTabProps {
  cardEditor: ReturnType<typeof useCardEditor>;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({ cardEditor }) => {
  const [zoom, setZoom] = useState(100);
  const [showImmersiveViewer, setShowImmersiveViewer] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);

  const handleDownload = async () => {
    try {
      if (!previewRef.current) {
        toast.error('Preview not found');
        return;
      }

      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to generate image');
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cardEditor.cardData.title.replace(/\s+/g, '_')}_preview.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('Preview downloaded successfully!');
      }, 'image/png');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download preview');
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success('Card link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    } else {
      toast.error('Sharing not supported in this browser');
    }
  };

  const handleViewImmersive = () => {
    if (!cardEditor.cardData.title?.trim()) {
      toast.error('Please add a card title before viewing in immersive mode');
      return;
    }
    setShowImmersiveViewer(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-editor-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-crd-white">Card Preview</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="text-crd-lightGray hover:text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-crd-lightGray min-w-[40px] text-center">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="text-crd-lightGray hover:text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
              className="text-crd-lightGray hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewImmersive}
            className="border-crd-mediumGray text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20"
          >
            <Sparkles className="w-3 h-3 mr-2" />
            3D View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="border-crd-mediumGray text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20"
          >
            <Download className="w-3 h-3 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-4 bg-editor-darker">
        <div className="h-full flex items-center justify-center">
          <div
            ref={previewRef}
            className="card-preview bg-white rounded-lg shadow-lg transition-transform duration-200"
            style={{
              transform: `scale(${zoom / 100})`,
              width: '300px',
              height: '420px',
              transformOrigin: 'center center'
            }}
          >
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
              <div className="text-center p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {cardEditor.cardData.title}
                </h3>
                {cardEditor.cardData.description && (
                  <p className="text-gray-600 text-sm">
                    {cardEditor.cardData.description}
                  </p>
                )}
                <div className="mt-3 text-xs text-gray-500">
                  {cardEditor.cardData.rarity} • {cardEditor.cardData.tags?.join(', ') || 'No tags'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Immersive Viewer */}
      {showImmersiveViewer && (
        <ImmersiveCardViewer
          card={cardEditor.cardData}
          isOpen={showImmersiveViewer}
          onClose={() => setShowImmersiveViewer(false)}
          onShare={handleShare}
          onDownload={handleDownload}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      )}
    </div>
  );
};
