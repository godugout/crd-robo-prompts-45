
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface BatchStatus {
  id: string;
  files: File[];
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  currentFile?: string;
}

interface ProcessingBatchesProps {
  batches: BatchStatus[];
}

export const ProcessingBatches: React.FC<ProcessingBatchesProps> = ({ batches }) => {
  if (batches.length === 0) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600/20 border-green-600/30';
      case 'processing':
        return 'bg-blue-600/20 border-blue-600/30';
      case 'error':
        return 'bg-red-600/20 border-red-600/30';
      default:
        return 'bg-gray-600/20 border-gray-600/30';
    }
  };

  return (
    <Card className="bg-editor-dark border-editor-border p-6">
      <h4 className="text-white font-medium mb-4">Processing Batches</h4>
      
      <div className="space-y-3">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className={`p-4 rounded-lg border ${getStatusColor(batch.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(batch.status)}
                <span className="text-white font-medium">
                  Batch {batch.id.slice(-4)} ({batch.files.length} files)
                </span>
              </div>
              <span className="text-sm text-crd-lightGray">
                {Math.round(batch.progress)}%
              </span>
            </div>
            
            {batch.status === 'processing' && (
              <>
                <Progress value={batch.progress} className="h-2 mb-2" />
                {batch.currentFile && (
                  <p className="text-xs text-crd-lightGray">
                    Processing: {batch.currentFile}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
