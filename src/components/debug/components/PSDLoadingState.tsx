
import React from 'react';
import { Loader2, FileImage } from 'lucide-react';

interface PSDLoadingStateProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
}

export const PSDLoadingState: React.FC<PSDLoadingStateProps> = ({
  message = "Processing PSD file...",
  progress,
  showProgress = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-8 rounded-lg">
      <FileImage className="w-16 h-16 text-slate-400 mb-4" />
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      
      {showProgress && typeof progress === 'number' && (
        <div className="w-64 bg-slate-800 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
      
      <p className="text-slate-400 text-sm text-center max-w-md">
        Large PSD files may take a moment to process. Please wait while we extract layers and generate previews.
      </p>
    </div>
  );
};
