
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share, Eye, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ExportPublishPhaseProps {
  cardData: any;
  onExport: (format: string) => void;
}

const EXPORT_FORMATS = [
  {
    id: 'cci',
    name: 'CRD Catalog Image',
    extension: '.cci',
    description: 'Optimized for CRD marketplace',
    size: '2.5" × 3.5" (300 DPI)',
    recommended: true
  },
  {
    id: 'png',
    name: 'PNG Image',
    extension: '.png',
    description: 'High quality with transparency',
    size: '1500 × 2100 pixels'
  },
  {
    id: 'jpg',
    name: 'JPEG Image',
    extension: '.jpg',
    description: 'Compressed for sharing',
    size: '1200 × 1680 pixels'
  },
  {
    id: '3d',
    name: '3D Model Export',
    extension: '.gltf',
    description: 'Interactive 3D model',
    size: 'With showcase environment'
  }
];

export const ExportPublishPhase: React.FC<ExportPublishPhaseProps> = ({
  cardData,
  onExport
}) => {
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(new Set(['cci']));
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const toggleFormat = (formatId: string) => {
    const newFormats = new Set(selectedFormats);
    if (newFormats.has(formatId)) {
      newFormats.delete(formatId);
    } else {
      newFormats.add(formatId);
    }
    setSelectedFormats(newFormats);
  };

  const handleExport = async () => {
    if (selectedFormats.size === 0) {
      toast.error('Please select at least one export format');
      return;
    }

    setIsExporting(true);
    
    // Simulate export process
    for (const format of Array.from(selectedFormats)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onExport(format);
    }
    
    setIsExporting(false);
    setExportComplete(true);
    toast.success('Card exported successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold theme-text-primary mb-2">Export & Publish</h2>
        <p className="theme-text-muted">
          Your card is ready! Choose export formats and publish options.
        </p>
      </div>

      {/* Final Card Summary */}
      <Card className="theme-bg-accent border-crd-green/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div 
                className="w-24 h-32 rounded-lg border-4 border-crd-green/50 shadow-lg"
                style={{ background: cardData.frame?.preview || '#666' }}
              >
                {cardData.image && (
                  <img
                    src={URL.createObjectURL(cardData.image)}
                    alt="Final Card"
                    className="absolute inset-2 w-20 h-28 object-cover rounded"
                  />
                )}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-black" />
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold theme-text-primary mb-2">
                Your Amazing Card
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm theme-text-muted">Frame:</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                    {cardData.frame?.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm theme-text-muted">Effects:</span>
                  <div className="flex gap-1">
                    {cardData.effects?.slice(0, 3).map((effect: any) => (
                      <Badge key={effect.id} variant="secondary" className="text-xs">
                        {effect.type}
                      </Badge>
                    ))}
                    {cardData.effects?.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{cardData.effects.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm theme-text-muted">Showcase:</span>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                    {cardData.showcase?.name}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Formats */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium theme-text-primary">Export Formats</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXPORT_FORMATS.map(format => (
            <Card
              key={format.id}
              className={`cursor-pointer transition-all ${
                selectedFormats.has(format.id)
                  ? 'border-crd-green bg-crd-green/10'
                  : 'theme-border hover:border-crd-green/50'
              }`}
              onClick={() => toggleFormat(format.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium theme-text-primary">
                        {format.name}
                      </h4>
                      {format.recommended && (
                        <Badge className="bg-crd-green/20 text-crd-green border-crd-green/50 text-xs">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm theme-text-muted mb-1">
                      {format.description}
                    </p>
                    <p className="text-xs theme-text-muted">
                      {format.size}
                    </p>
                  </div>
                  
                  {selectedFormats.has(format.id) && (
                    <div className="w-5 h-5 bg-crd-green rounded-full flex items-center justify-center ml-3">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Export Actions */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedFormats.size === 0}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-medium flex-1"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Card ({selectedFormats.size} format{selectedFormats.size !== 1 ? 's' : ''})
              </>
            )}
          </Button>
        </div>

        {exportComplete && (
          <Card className="theme-bg-accent border-green-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium theme-text-primary">Export Complete!</h4>
                    <p className="text-sm theme-text-muted">Your card has been saved successfully</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
