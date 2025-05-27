
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface BatchProgressProps {
  batchId: string;
  current: number;
  total: number;
  progress: number;
  currentFileName?: string;
}

export const BatchProgress: React.FC<BatchProgressProps> = ({
  batchId,
  current,
  total,
  progress,
  currentFileName
}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white text-sm">
          Batch {batchId.split('_').pop()} ({current}/{total} files)
        </span>
        <span className="text-crd-lightGray text-sm">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      {currentFileName && (
        <p className="text-crd-lightGray text-xs mt-1">
          Processing: {currentFileName}
        </p>
      )}
    </div>
  );
};
