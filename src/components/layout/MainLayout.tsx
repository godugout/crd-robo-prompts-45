
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/home/Navbar';

export const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  console.log('MainLayout rendering, path:', location.pathname, 'isHomePage:', isHomePage);

  return (
    <>
      <Navbar />
      <div className="outlet-container">
        <Outlet />
      </div>
    </>
  );
};
