
import React from 'react';
import { UniversalNavbar } from '@/components/navigation/UniversalNavbar';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showNavbar = true 
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      theme === 'labs' 
        ? "bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" 
        : "theme-bg-primary"
    )}>
      {showNavbar && <UniversalNavbar />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
