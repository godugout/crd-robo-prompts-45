
import React from 'react';
import { Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewTabProps {
  onDownload: () => void;
  onShare?: () => void;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({
  onDownload,
  onShare
}) => {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h4 className="text-white font-medium mb-4">Export & Share</h4>
        <div className="space-y-3">
          <Button
            onClick={onDownload}
            className="w-full bg-crd-green text-black hover:bg-crd-green/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Card
          </Button>
          {onShare && (
            <Button
              onClick={onShare}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Card
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
