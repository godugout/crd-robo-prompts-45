
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';

interface ProcessingControlsProps {
  isProcessing: boolean;
  canCancel: boolean;
  pendingCount: number;
  onStartProcessing: () => void;
  onCancelProcessing: () => void;
  onClearQueue: () => void;
}

export const ProcessingControls: React.FC<ProcessingControlsProps> = ({
  isProcessing,
  canCancel,
  pendingCount,
  onStartProcessing,
  onCancelProcessing,
  onClearQueue
}) => {
  return (
    <div className="flex gap-2">
      {!isProcessing && pendingCount > 0 && (
        <Button
          onClick={onStartProcessing}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Processing
        </Button>
      )}
      
      {isProcessing && canCancel && (
        <Button
          onClick={onCancelProcessing}
          variant="outline"
          className="text-orange-400 border-orange-400"
        >
          <Square className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      )}
      
      {!isProcessing && (
        <Button
          onClick={onClearQueue}
          variant="outline"
          className="text-red-400 border-red-400"
        >
          Clear Queue
        </Button>
      )}
    </div>
  );
};
