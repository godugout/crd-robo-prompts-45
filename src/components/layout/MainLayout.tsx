
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
    
    // Quick initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log('MainLayout finished loading');
    }, 50);
    
    return () => {
      clearTimeout(timer);
      console.log('MainLayout unmounted');
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141416]">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-white mb-4" />
          <p className="text-white">Loading layout...</p>
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
