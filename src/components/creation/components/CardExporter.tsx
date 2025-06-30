
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface ExportOptions {
  format: 'png' | 'jpeg' | 'webp';
  quality: number;
  width: number;
  height: number;
}

interface CardExporterProps {
  onExport: (options: ExportOptions) => Promise<void>;
  isExporting: boolean;
}

export const CardExporter: React.FC<CardExporterProps> = ({ onExport, isExporting }) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'png',
    quality: 0.9,
    width: 800,
    height: 1120
  });

  const handleExport = async () => {
    try {
      await onExport(options);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed');
    }
  };

  const updateOption = (key: keyof ExportOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-white">Export Settings</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-300">Format</Label>
          <Select 
            value={options.format} 
            onValueChange={(value) => updateOption('format', value)}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG (High Quality)</SelectItem>
              <SelectItem value="jpeg">JPEG (Smaller Size)</SelectItem>
              <SelectItem value="webp">WebP (Modern)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-300">Size</Label>
          <Select 
            value={`${options.width}x${options.height}`}
            onValueChange={(value) => {
              const [width, height] = value.split('x').map(Number);
              updateOption('width', width);
              updateOption('height', height);
            }}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="400x560">Small (400×560)</SelectItem>
              <SelectItem value="800x1120">Medium (800×1120)</SelectItem>
              <SelectItem value="1200x1680">Large (1200×1680)</SelectItem>
              <SelectItem value="1600x2240">Extra Large (1600×2240)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        <Download className="w-4 h-4 mr-2" />
        {isExporting ? 'Exporting...' : `Export as ${options.format.toUpperCase()}`}
      </Button>
    </div>
  );
};
