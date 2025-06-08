
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download, 
  Image, 
  FileText, 
  Share2, 
  Settings,
  X,
  Zap
} from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectLayerData } from '../effects/EffectLayer';

interface EnhancedExportDialogProps {
  cardData: CardData;
  currentPhoto: string;
  effectLayers: EffectLayerData[];
  showCRDBack: boolean;
  onClose: () => void;
  onExport: () => void;
}

const EXPORT_FORMATS = [
  { id: 'png', name: 'PNG', description: 'High quality with transparency' },
  { id: 'jpg', name: 'JPEG', description: 'Compressed, smaller file size' },
  { id: 'pdf', name: 'PDF', description: 'Print-ready document' },
  { id: 'svg', name: 'SVG', description: 'Vector format, scalable' }
];

const QUALITY_PRESETS = [
  { id: 'web', name: 'Web (72 DPI)', width: 375, height: 525 },
  { id: 'print', name: 'Print (300 DPI)', width: 1500, height: 2100 },
  { id: 'hd', name: 'HD (150 DPI)', width: 750, height: 1050 },
  { id: 'ultra', name: 'Ultra HD (600 DPI)', width: 3000, height: 4200 }
];

export const EnhancedExportDialog: React.FC<EnhancedExportDialogProps> = ({
  cardData,
  currentPhoto,
  effectLayers,
  showCRDBack,
  onClose,
  onExport
}) => {
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [selectedQuality, setSelectedQuality] = useState('hd');
  const [includeBack, setIncludeBack] = useState(true);
  const [includeEffects, setIncludeEffects] = useState(true);
  const [exportBatch, setExportBatch] = useState(false);

  const handleExport = async () => {
    // Enhanced export logic would go here
    console.log('Exporting with settings:', {
      format: selectedFormat,
      quality: selectedQuality,
      includeBack,
      includeEffects,
      exportBatch
    });
    onExport();
    onClose();
  };

  // Handler functions to convert CheckedState to boolean
  const handleIncludeBackChange = (checked: boolean | "indeterminate") => {
    setIncludeBack(checked === true);
  };

  const handleIncludeEffectsChange = (checked: boolean | "indeterminate") => {
    setIncludeEffects(checked === true);
  };

  const handleExportBatchChange = (checked: boolean | "indeterminate") => {
    setExportBatch(checked === true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden bg-editor-dark border-editor-border">
        <div className="flex h-full">
          {/* Preview Section */}
          <div className="flex-1 p-6 bg-editor-darker">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Export Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-editor-border"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Card Preview */}
            <div className="aspect-[3/4] bg-black rounded-lg flex items-center justify-center">
              {currentPhoto ? (
                <img 
                  src={currentPhoto} 
                  alt="Card preview" 
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-crd-lightGray">No image loaded</div>
              )}
            </div>

            {/* Export Info */}
            <div className="mt-4 p-3 bg-editor-tool rounded-lg">
              <div className="text-white text-sm">
                <p><strong>Card:</strong> {cardData.title}</p>
                <p><strong>Effects:</strong> {effectLayers.filter(l => l.visible).length} active</p>
                <p><strong>Format:</strong> {EXPORT_FORMATS.find(f => f.id === selectedFormat)?.name}</p>
                <p><strong>Quality:</strong> {QUALITY_PRESETS.find(q => q.id === selectedQuality)?.name}</p>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="w-80 p-6 border-l border-editor-border overflow-y-auto">
            <h3 className="text-white font-semibold text-lg mb-4">Export Settings</h3>

            <Tabs defaultValue="format" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-editor-tool">
                <TabsTrigger value="format" className="text-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
                  Format
                </TabsTrigger>
                <TabsTrigger value="options" className="text-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
                  Options
                </TabsTrigger>
              </TabsList>

              <TabsContent value="format" className="space-y-4 mt-4">
                {/* Format Selection */}
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Export Format</label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger className="bg-editor-tool border-editor-border text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPORT_FORMATS.map((format) => (
                        <SelectItem key={format.id} value={format.id}>
                          <div>
                            <div className="font-medium">{format.name}</div>
                            <div className="text-xs text-gray-400">{format.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quality Selection */}
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Quality Preset</label>
                  <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                    <SelectTrigger className="bg-editor-tool border-editor-border text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUALITY_PRESETS.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id}>
                          <div>
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs text-gray-400">
                              {preset.width} × {preset.height}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="options" className="space-y-4 mt-4">
                {/* Export Options */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-back"
                      checked={includeBack}
                      onCheckedChange={handleIncludeBackChange}
                    />
                    <label htmlFor="include-back" className="text-white text-sm">
                      Include CRD card back
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-effects"
                      checked={includeEffects}
                      onCheckedChange={handleIncludeEffectsChange}
                    />
                    <label htmlFor="include-effects" className="text-white text-sm">
                      Include effect layers
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="export-batch"
                      checked={exportBatch}
                      onCheckedChange={handleExportBatchChange}
                    />
                    <label htmlFor="export-batch" className="text-white text-sm">
                      Export multiple variations
                    </label>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2 pt-4 border-t border-editor-border">
                  <Button
                    variant="outline"
                    className="w-full border-editor-border text-white hover:bg-editor-border"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced Settings
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share to Community
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Export Button */}
            <div className="pt-6 border-t border-editor-border mt-6">
              <Button
                onClick={handleExport}
                className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Card
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
