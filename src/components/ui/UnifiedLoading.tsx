
import React from 'react';
import { cn } from '@/lib/utils';

interface UnifiedLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const UnifiedLoading: React.FC<UnifiedLoadingProps> = ({
  size = 'md',
  text,
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-gray-600 border-t-crd-green",
        sizeClasses[size]
      )} />
      {text && (
        <p className="text-gray-400 text-sm">{text}</p>
      )}
    </div>
  );
};
