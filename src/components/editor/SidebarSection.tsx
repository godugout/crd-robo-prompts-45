
import React, { ReactNode } from 'react';

interface SidebarSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const SidebarSection = ({ title, children, className = '' }: SidebarSectionProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      {title && (
        <h3 className="text-xs font-medium text-cardshow-lightGray uppercase tracking-wider mb-2">
          {title}
        </h3>
      )}
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};
