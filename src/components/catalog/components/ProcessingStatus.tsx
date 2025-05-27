
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ProcessingStatusProps {
  isProcessing: boolean;
  processingStatus: {
    total: number;
    completed: number;
    failed: number;
    inProgress: string[];
  };
}

export const ProcessingStatus = ({ isProcessing, processingStatus }: ProcessingStatusProps) => {
  if (!isProcessing || processingStatus.total === 0) {
    return null;
  }

  return (
    <Card className="bg-editor-dark border-editor-border">
      <CardContent className="p-6">
        <h4 className="text-white font-medium mb-4">Processing Status</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-600/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{processingStatus.total}</div>
            <div className="text-xs text-blue-300">Total Files</div>
          </div>
          <div className="p-3 bg-green-600/20 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{processingStatus.completed}</div>
            <div className="text-xs text-green-300">Completed</div>
          </div>
          <div className="p-3 bg-red-600/20 rounded-lg">
            <div className="text-2xl font-bold text-red-400">{processingStatus.failed}</div>
            <div className="text-xs text-red-300">Failed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
