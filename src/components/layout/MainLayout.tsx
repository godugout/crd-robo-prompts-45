
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/home/Navbar';
import { AppSidebar } from './AppSidebar';
import { NavigationProvider, useNavigation } from '@/contexts/NavigationContext';

const LayoutContent = () => {
  const { navigationStyle } = useNavigation();

  if (navigationStyle === 'sidebar') {
    return (
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          <div className="outlet-container">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="outlet-container">
        <Outlet />
      </div>
    </>
  );
};

export const MainLayout = () => {
  return (
    <NavigationProvider>
      <LayoutContent />
    </NavigationProvider>
  );
};
