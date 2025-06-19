
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Share2, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: {
    uploadedImage: string;
    selectedFrame: string;
    effectValues: Record<string, any>;
  };
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  cardData
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'pdf'>('png');
  const [exportQuality, setExportQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');

  const handleExport = async (type: 'download' | 'share' | 'save') => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      switch (type) {
        case 'download':
          toast.success('Card downloaded successfully!');
          break;
        case 'share':
          toast.success('Card shared to gallery!');
          break;
        case 'save':
          toast.success('Card saved to collection!');
          break;
      }
      
      onClose();
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getExportSize = () => {
    switch (exportQuality) {
      case 'low': return '512x512';
      case 'medium': return '1024x1024';
      case 'high': return '2048x2048';
      case 'ultra': return '4096x4096';
      default: return '2048x2048';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-editor-dark border-editor-border">
        <DialogHeader>
          <DialogTitle className="text-white">Export Your Card</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-editor-tool">
            <TabsTrigger value="quick">Quick Export</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-4">
            <div className="text-center space-y-4">
              <div className="w-32 h-40 mx-auto bg-gradient-to-br from-gray-600 to-gray-800 rounded border-2 border-gray-500 flex items-center justify-center">
                <span className="text-gray-300 text-sm">Preview</span>
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={() => handleExport('download')}
                  disabled={isExporting}
                  className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download (PNG, High Quality)
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleExport('save')}
                    disabled={isExporting}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('share')}
                    disabled={isExporting}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              {/* Format Selection */}
              <div>
                <label className="text-white font-medium mb-2 block">Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['png', 'jpg', 'pdf'] as const).map((format) => (
                    <Button
                      key={format}
                      variant={exportFormat === format ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setExportFormat(format)}
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quality Selection */}
              <div>
                <label className="text-white font-medium mb-2 block">Quality</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['low', 'medium', 'high', 'ultra'] as const).map((quality) => (
                    <Button
                      key={quality}
                      variant={exportQuality === quality ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setExportQuality(quality)}
                      className="flex flex-col p-2 h-auto"
                    >
                      <span className="capitalize">{quality}</span>
                      <span className="text-xs opacity-70">{getExportSize()}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Export Actions */}
              <div className="pt-2">
                <Button
                  onClick={() => handleExport('download')}
                  disabled={isExporting}
                  className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Export as {exportFormat.toUpperCase()} ({exportQuality})
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
