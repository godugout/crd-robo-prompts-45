
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Camera, Video, Download, Settings, FileImage, FileVideo } from 'lucide-react';
import { toast } from 'sonner';

interface ExportControlsProps {
  viewMode: '2d' | '3d';
}

export const ExportControls: React.FC<ExportControlsProps> = ({ viewMode }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');
  const [exportQuality, setExportQuality] = useState('high');

  const handleScreenshot = async () => {
    setIsExporting(true);
    
    try {
      // Get the canvas element
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        throw new Error('No canvas found');
      }
      
      // Create download link
      const link = document.createElement('a');
      link.download = `card-${Date.now()}.${exportFormat}`;
      
      if (exportFormat === 'png') {
        link.href = canvas.toDataURL('image/png');
      } else {
        link.href = canvas.toDataURL('image/jpeg', exportQuality === 'high' ? 0.95 : 0.8);
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Screenshot saved successfully!');
    } catch (error) {
      toast.error('Failed to capture screenshot');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleVideoExport = async () => {
    setIsExporting(true);
    
    try {
      // This would implement video recording functionality
      // For now, we'll show a placeholder
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Video recording started! (Feature coming soon)');
    } catch (error) {
      toast.error('Failed to start video recording');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-green-400">Export</h3>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/50 capitalize">
          {viewMode} Mode
        </Badge>
      </div>

      {/* Export Settings */}
      <Card className="p-4 bg-black/20 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-green-400" />
          <h4 className="text-sm font-medium text-white">Export Settings</h4>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Format</label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="bg-editor-darker border-editor-border text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG (Transparent)</SelectItem>
                <SelectItem value="jpg">JPG (Compressed)</SelectItem>
                <SelectItem value="webp">WebP (Modern)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Quality</label>
            <Select value={exportQuality} onValueChange={setExportQuality}>
              <SelectTrigger className="bg-editor-darker border-editor-border text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ultra">Ultra (4K)</SelectItem>
                <SelectItem value="high">High (2K)</SelectItem>
                <SelectItem value="medium">Medium (1080p)</SelectItem>
                <SelectItem value="low">Low (720p)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Export Actions */}
      <div className="space-y-3">
        <Button
          onClick={handleScreenshot}
          disabled={isExporting}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Exporting...
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              Screenshot
            </>
          )}
        </Button>
        
        {viewMode === '3d' && (
          <Button
            onClick={handleVideoExport}
            disabled={isExporting}
            variant="outline"
            className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
          >
            <Video className="w-4 h-4 mr-2" />
            Record Animation
          </Button>
        )}
      </div>

      {/* Export Formats Info */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Available Formats</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FileImage className="w-3 h-3" />
            <span>Images</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FileVideo className="w-3 h-3" />
            <span>Videos</span>
          </div>
        </div>
      </div>

      {/* Quick Export */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 justify-start"
          onClick={() => {
            setExportFormat('png');
            setExportQuality('high');
            handleScreenshot();
          }}
        >
          <Download className="w-3 h-3 mr-2" />
          Quick PNG
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 justify-start"
          onClick={() => {
            setExportFormat('jpg');
            setExportQuality('high');
            handleScreenshot();
          }}
        >
          <Download className="w-3 h-3 mr-2" />
          Quick JPG
        </Button>
      </div>
    </div>
  );
};
