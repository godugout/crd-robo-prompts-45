
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface ExportSectionProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onDownload: () => void;
  onShare?: () => void;
}

export const ExportSection: React.FC<ExportSectionProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onDownload,
  onShare
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium flex items-center">
        <Sparkles className="w-4 h-4 text-crd-green mr-2" />
        Export Options
      </h3>
      <Button variant="secondary" onClick={onToggleFullscreen} className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
        {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      </Button>
      <Button variant="secondary" onClick={onDownload} className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
        Download
      </Button>
      {onShare && (
        <Button variant="secondary" onClick={onShare} className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
          Share
        </Button>
      )}
    </div>
  );
};
