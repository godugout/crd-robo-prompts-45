
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Image as ImageIcon, File } from 'lucide-react';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: {
    uploadedImage?: string;
    selectedFrame?: string;
    effectValues: Record<string, any>;
  };
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  cardData
}) => {
  const [exportFormat, setExportFormat] = useState('png');
  const [exportQuality, setExportQuality] = useState('high');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsExporting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-editor-dark border-editor-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export Card
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger className="bg-editor-tool border-editor-border text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-editor-tool border-editor-border">
                      <SelectItem value="png">PNG (Recommended)</SelectItem>
                      <SelectItem value="jpg">JPG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Quality</Label>
                  <Select value={exportQuality} onValueChange={setExportQuality}>
                    <SelectTrigger className="bg-editor-tool border-editor-border text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-editor-tool border-editor-border">
                      <SelectItem value="high">High (300 DPI)</SelectItem>
                      <SelectItem value="medium">Medium (150 DPI)</SelectItem>
                      <SelectItem value="low">Low (72 DPI)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-editor-border text-white hover:bg-editor-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black"
            >
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
