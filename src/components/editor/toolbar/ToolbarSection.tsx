
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface ToolbarSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const ToolbarSection = ({ children, className = '' }: ToolbarSectionProps) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {children}
    </div>
  );
};

export const ToolbarDivider = () => {
  return <Separator orientation="vertical" className="mx-2 h-6 bg-editor-border" />;
};
