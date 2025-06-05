
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Sparkles, CheckCircle } from 'lucide-react';
import type { MaterialLoadingState } from '../hooks/useMaterialLoadingState';

interface MaterialLoadingProgressProps {
  loadingState: MaterialLoadingState;
  className?: string;
}

export const MaterialLoadingProgress: React.FC<MaterialLoadingProgressProps> = ({
  loadingState,
  className = ''
}) => {
  if (loadingState.phase === 'idle') {
    return null;
  }

  const { phase, progress, message, isLoading } = loadingState;

  return (
    <div className={`absolute bottom-4 left-4 right-4 z-50 ${className}`}>
      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/10">
        <div className="flex items-center space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            {phase === 'complete' ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Sparkles className="w-4 h-4 text-crd-green animate-pulse" />
            )}
          </div>
          
          {/* Progress content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white font-medium truncate">
                {message}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                {Math.round(progress)}%
              </span>
            </div>
            
            {/* Progress bar */}
            <Progress 
              value={progress} 
              className="h-1.5 bg-gray-700"
            />
          </div>
        </div>
        
        {/* Phase indicator dots */}
        <div className="flex justify-center space-x-1 mt-2">
          {['preparing', 'applying', 'rendering', 'complete'].map((phaseKey, index) => (
            <div
              key={phaseKey}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                phase === phaseKey
                  ? 'bg-crd-green scale-125'
                  : progress > (index * 25)
                  ? 'bg-gray-400'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
