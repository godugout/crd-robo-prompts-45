
import React from 'react';
import { UniversalNavbar } from '@/components/navigation/UniversalNavbar';

interface MainLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showNavbar = true 
}) => {
  return (
    <div className="min-h-screen bg-studio-bg">
      {showNavbar && <UniversalNavbar />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
