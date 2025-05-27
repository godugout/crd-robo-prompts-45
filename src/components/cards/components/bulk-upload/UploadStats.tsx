
import React from 'react';

interface UploadStatsProps {
  pending: number;
  processing: number;
  completed: number;
  error: number;
}

export const UploadStats: React.FC<UploadStatsProps> = ({
  pending,
  processing,
  completed,
  error
}) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div className="bg-yellow-600/20 p-3 rounded text-center">
        <div className="text-2xl font-bold text-yellow-400">{pending}</div>
        <div className="text-yellow-300 text-sm">Pending</div>
      </div>
      <div className="bg-blue-600/20 p-3 rounded text-center">
        <div className="text-2xl font-bold text-blue-400">{processing}</div>
        <div className="text-blue-300 text-sm">Processing</div>
      </div>
      <div className="bg-green-600/20 p-3 rounded text-center">
        <div className="text-2xl font-bold text-green-400">{completed}</div>
        <div className="text-green-300 text-sm">Completed</div>
      </div>
      <div className="bg-red-600/20 p-3 rounded text-center">
        <div className="text-2xl font-bold text-red-400">{error}</div>
        <div className="text-red-300 text-sm">Failed</div>
      </div>
    </div>
  );
};
