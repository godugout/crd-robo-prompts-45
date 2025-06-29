
import React from 'react';
import { LabsNavbar } from '@/components/navigation/LabsNavbar';

interface LabsLayoutProps {
  children: React.ReactNode;
}

export const LabsLayout: React.FC<LabsLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-dark to-crd-darkest">
      <LabsNavbar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
