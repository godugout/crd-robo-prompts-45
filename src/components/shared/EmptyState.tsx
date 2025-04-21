
import React from 'react';
import { Image, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No items yet",
  description = "No items found. Try adjusting your filters or create a new item.",
  icon = <Image className="h-16 w-16 text-crd-mediumGray mb-4" />,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-crd-darkGray border border-crd-mediumGray rounded-xl text-center">
      {icon}
      <h3 className="text-xl font-medium text-crd-white mb-2">{title}</h3>
      <p className="text-crd-lightGray mb-6 max-w-md">{description}</p>
      
      {action && (
        <Button 
          className="bg-crd-blue text-white hover:bg-opacity-90"
          onClick={action.onClick}
        >
          {action.icon || <Plus className="mr-2 h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
};
