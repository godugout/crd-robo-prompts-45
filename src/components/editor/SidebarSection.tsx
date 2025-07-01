
import React from 'react';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-cardshow-white">{title}</h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};
