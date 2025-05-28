
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  showPercentage = true
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-white text-sm font-medium">{label}</span>
          {showPercentage && (
            <span className="text-crd-lightGray text-sm">
              {current}/{total} ({percentage}%)
            </span>
          )}
        </div>
      )}
      <Progress 
        value={percentage} 
        className="h-3 bg-crd-mediumGray/20"
      />
    </div>
  );
};
