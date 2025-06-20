
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, 
  Layers
} from 'lucide-react';
import { BatchDropZone } from './batch/BatchDropZone';
import { BatchProcessingItem } from './batch/BatchProcessingItem';
import { useBatchProcessing } from './batch/useBatchProcessing';

interface BatchImageProcessorProps {
  onBatchComplete: (processedImages: { original: File; processed: string }[]) => void;
  className?: string;
}

export const BatchImageProcessor: React.FC<BatchImageProcessorProps> = ({
  onBatchComplete,
  className = ""
}) => {
  const {
    items,
    isProcessing,
    progress,
    addFiles,
    removeItem,
    processBatch,
    clearAll
  } = useBatchProcessing({ onBatchComplete });

  return (
    <Card className={`p-4 bg-editor-tool border-editor-border ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Batch Processor
          </h3>
          <div className="flex gap-2">
            {items.length > 0 && (
              <Button
                onClick={clearAll}
                variant="outline"
                size="sm"
                disabled={isProcessing}
              >
                Clear All
              </Button>
            )}
            <Button
              onClick={processBatch}
              disabled={isProcessing || items.length === 0}
              className="bg-crd-green text-black hover:bg-crd-green/90"
              size="sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Processing
                </>
              ) : (
                `Process ${items.length} Images`
              )}
            </Button>
          </div>
        </div>

        {/* Drop Zone */}
        <BatchDropZone onFilesAdded={addFiles} />

        {/* Processing Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-crd-lightGray text-xs text-center">
              Processing batch... {Math.round(progress)}% complete
            </p>
          </div>
        )}

        {/* Items List */}
        {items.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {items.map(item => (
              <BatchProcessingItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                isProcessing={isProcessing}
              />
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-editor-border">
          <p className="text-crd-lightGray text-xs">
            Process multiple images simultaneously with advanced AI pipeline.
          </p>
        </div>
      </div>
    </Card>
  );
};
