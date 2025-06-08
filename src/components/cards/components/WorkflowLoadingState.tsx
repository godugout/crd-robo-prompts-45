
import React from 'react';

interface WorkflowLoadingStateProps {
  title: string;
  description?: string;
  progress?: number;
}

export const WorkflowLoadingState: React.FC<WorkflowLoadingStateProps> = ({
  title,
  description,
  progress
}) => {
  return (
    <div className="flex items-center justify-center h-96 bg-editor-dark rounded-xl border border-crd-mediumGray/20">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="text-white font-medium text-lg">{title}</div>
        {description && (
          <div className="text-crd-lightGray text-sm max-w-md">
            {description}
          </div>
        )}
        {progress !== undefined && (
          <div className="w-64 bg-crd-darkGray rounded-full h-2 mx-auto">
            <div 
              className="bg-crd-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};
