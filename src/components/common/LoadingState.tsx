
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'md',
  fullPage = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = fullPage 
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-crd-darkest z-50'
    : `flex flex-col items-center justify-center py-8 ${className}`;

  return (
    <div className={containerClasses}>
      <Loader2 className={`${sizeClasses[size]} text-crd-green animate-spin mb-3`} />
      <p className="text-crd-lightGray text-sm">{message}</p>
    </div>
  );
};
