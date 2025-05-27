
import React from 'react';
import { useCardCatalog } from '@/hooks/useCardCatalog';
import { useClipboardPaste } from './hooks/useClipboardPaste';
import { UploadDropZone } from './components/UploadDropZone';
import { UploadQueue } from './components/UploadQueue';
import { ProcessingStatus } from './components/ProcessingStatus';

interface BulkCardUploaderProps {
  onUploadComplete?: (count: number) => void;
}

export const BulkCardUploader = ({ onUploadComplete }: BulkCardUploaderProps) => {
  const {
    uploadQueue,
    isProcessing,
    processingStatus,
    addToQueue,
    processQueue,
    clearQueue,
    removeFromQueue
  } = useCardCatalog();

  // Initialize clipboard paste functionality
  useClipboardPaste({ onFilesAdded: addToQueue });

  return (
    <div className="space-y-6">
      {/* Main Upload Area */}
      <UploadDropZone onFilesAdded={addToQueue} />

      {/* Upload Queue */}
      <UploadQueue
        uploadQueue={uploadQueue}
        isProcessing={isProcessing}
        processingStatus={processingStatus}
        onProcessQueue={processQueue}
        onClearQueue={clearQueue}
        onRemoveFromQueue={removeFromQueue}
      />

      {/* Processing Status */}
      <ProcessingStatus
        isProcessing={isProcessing}
        processingStatus={processingStatus}
      />
    </div>
  );
};
