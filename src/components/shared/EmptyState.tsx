
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
  icon = <Image className="h-16 w-16 text-crd-lightGray mb-4" />,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-crd-darkGray border border-crd-mediumGray rounded-xl text-center hover:border-crd-green/50 transition-all duration-200">
      <div className="w-16 h-16 bg-crd-mediumGray rounded-xl mx-auto mb-6 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-crd-white mb-3">{title}</h3>
      <p className="text-crd-lightGray mb-8 max-w-md leading-relaxed">{description}</p>
      
      {action && (
        <Button 
          className="bg-crd-green hover:bg-crd-green-secondary text-black font-semibold px-6 py-3 h-auto transition-all duration-200 hover:scale-105"
          onClick={action.onClick}
        >
          {action.icon || <Plus className="mr-2 h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
};
