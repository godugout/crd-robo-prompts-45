
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UnifiedEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const UnifiedEmptyState: React.FC<UnifiedEmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn("text-center py-12", className)}>
      {icon && (
        <div className="mb-4 flex justify-center">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
