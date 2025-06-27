
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Share2, Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';

const EXPORT_FORMATS = [
  { format: 'PNG', size: '1080x1350', quality: 'High Quality', recommended: true },
  { format: 'JPG', size: '1080x1350', quality: 'Standard', recommended: false },
  { format: 'PNG', size: '2160x2700', quality: 'Ultra HD', recommended: false }
];

interface CardExportProps {
  cardData: any;
  uploadedImage: string;
  onCreateAnother: () => void;
}

export const CardExport: React.FC<CardExportProps> = ({
  cardData,
  uploadedImage,
  onCreateAnother
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: string, size: string) => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`Card exported as ${format} (${size})`);
    setIsExporting(false);
  };

  const handleShare = () => {
    toast.success('Share link copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-crd-green rounded-full flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your CRD is Complete!</h2>
        <p className="text-gray-400">Choose your export format and share your creation</p>
      </div>

      {/* Export Options */}
      <Card className="p-6 bg-gray-800/50 border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXPORT_FORMATS.map((option, index) => (
            <Card
              key={index}
              className={`p-4 cursor-pointer transition-all duration-200 ${
                option.recommended 
                  ? 'border-crd-green bg-crd-green/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => handleExport(option.format, option.size)}
            >
              <div className="text-center">
                {option.recommended && (
                  <div className="text-xs text-crd-green font-semibold mb-2">RECOMMENDED</div>
                )}
                <div className="text-white font-semibold">{option.format}</div>
                <div className="text-gray-400 text-sm">{option.size}</div>
                <div className="text-gray-500 text-xs mt-1">{option.quality}</div>
                <Button
                  size="sm"
                  disabled={isExporting}
                  className="mt-3 w-full bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Download'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Share Options */}
      <Card className="p-6 bg-gray-800/50 border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Share Your CRD</h3>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={onCreateAnother}
          className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Create Another CRD
        </Button>
        <Button
          onClick={() => window.location.href = '/studio'}
          variant="outline"
          className="border-crd-green text-crd-green hover:bg-crd-green/10"
        >
          Try Advanced Studio
        </Button>
      </div>
    </div>
  );
};
