
import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  fullPage = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = fullPage 
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        <Loader 
          className={`${sizeClasses[size]} animate-spin text-primary mb-4`} 
        />
        <p className="text-center text-gray-500">{message}</p>
      </div>
    </div>
  );
};
