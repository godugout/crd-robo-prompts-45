
import React from 'react';
import { Button } from '@/components/ui/button';
import { Scissors, Upload } from 'lucide-react';
import { useOverlay } from '@/components/overlay';
import { ExtractedCard } from '@/services/cardExtractor';

interface CardExtractionUploadProps {
  onCardsExtracted: (cards: ExtractedCard[]) => void;
}

export const CardExtractionUpload = ({ onCardsExtracted }: CardExtractionUploadProps) => {
  const { openOverlay } = useOverlay();

  const handleOpenDetection = () => {
    openOverlay('card-detection', { onCardsExtracted });
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-editor-border rounded-lg p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-editor-tool flex items-center justify-center">
            <Scissors className="w-8 h-8 text-crd-green" />
          </div>
          <div className="text-white font-medium text-lg">
            Advanced Card Detection
          </div>
          <div className="text-crd-lightGray text-sm max-w-md">
            Upload any image with trading cards and our AI will automatically detect and extract them using advanced face detection and aspect ratio analysis.
          </div>
          <Button
            onClick={handleOpenDetection}
            className="bg-crd-green hover:bg-crd-green/80 text-white px-6 py-3 rounded-full mt-4"
          >
            <Upload className="w-5 h-5 mr-2" />
            Open Card Detection Studio
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-crd-lightGray text-center">
        Works with Instagram screenshots, collection photos, or any card images
      </div>
    </div>
  );
};
