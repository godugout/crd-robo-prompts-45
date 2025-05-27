
import React from 'react';
import { Image, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkflowPhase } from '../hooks/useCardUploadSession';

interface CardsProcessingPhasesProps {
  phase: WorkflowPhase;
  onStartOver: () => void;
}

export const CardsProcessingPhases: React.FC<CardsProcessingPhasesProps> = ({
  phase,
  onStartOver
}) => {
  if (phase === 'uploading') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-white mb-2">Uploading Images</h3>
        <p className="text-crd-lightGray">Please wait while we process your images...</p>
      </div>
    );
  }

  if (phase === 'detecting') {
    return (
      <div className="text-center py-12">
        <div className="relative">
          <Image className="w-16 h-16 text-crd-green mx-auto mb-4 animate-pulse" />
          <div className="absolute inset-0 border-4 border-crd-green border-t-transparent rounded-full animate-spin" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">Detecting Cards</h3>
        <p className="text-crd-lightGray">AI is analyzing your images to find trading cards...</p>
      </div>
    );
  }

  if (phase === 'creating') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-white mb-2">Creating Cards</h3>
        <p className="text-crd-lightGray">Processing and saving your selected cards...</p>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-crd-green rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-black" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">Cards Created Successfully!</h3>
        <p className="text-crd-lightGray mb-6">
          Your cards have been processed and saved to your collection
        </p>
        <Button
          onClick={onStartOver}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          Upload More Cards
        </Button>
      </div>
    );
  }

  return null;
};
