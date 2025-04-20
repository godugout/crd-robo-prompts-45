
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/home/Navbar';
import { Loader } from 'lucide-react';

export const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('MainLayout rendering, path:', location.pathname, 'isHomePage:', isHomePage);

  useEffect(() => {
    console.log('MainLayout mounted');
    
    // Simulate checking for any required resources
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log('MainLayout finished loading');
    }, 100);
    
    return () => {
      clearTimeout(timer);
      console.log('MainLayout unmounted');
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-primary" />
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
