
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import type { BatchStatus } from '@/hooks/useBulkCardProcessing/batchProcessor';

interface ProcessingBatchesProps {
  batches: BatchStatus[];
}

export const ProcessingBatches: React.FC<ProcessingBatchesProps> = ({ batches }) => {
  if (batches.length === 0) return null;

  const getStatusIcon = (status: BatchStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-orange-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: BatchStatus['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600/20 border-green-600/30';
      case 'processing':
        return 'bg-blue-600/20 border-blue-600/30';
      case 'cancelled':
        return 'bg-orange-600/20 border-orange-600/30';
      case 'error':
        return 'bg-red-600/20 border-red-600/30';
      default:
        return 'bg-gray-600/20 border-gray-600/30';
    }
  };

  return (
    <Card className="bg-editor-dark border-editor-border p-6">
      <h4 className="text-white font-medium mb-4">Processing Batches</h4>
      
      <div className="space-y-4">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className={`p-4 rounded-lg border ${getStatusColor(batch.status)}`}
          >
            <div className="flex items-center gap-3 mb-3">
              {getStatusIcon(batch.status)}
              <span className="text-white font-medium">
                Batch {batch.id.slice(-4)} ({batch.files.length} files)
              </span>
            </div>
            
            {batch.status === 'processing' && (
              <div className="space-y-2">
                <ProgressBar
                  current={batch.current}
                  total={batch.total}
                  showPercentage={true}
                />
                {batch.currentFileName && (
                  <p className="text-xs text-crd-lightGray">
                    Processing: {batch.currentFileName}
                  </p>
                )}
              </div>
            )}

            {batch.status === 'completed' && (
              <div className="text-sm text-green-400">
                ✓ All {batch.files.length} files processed
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
