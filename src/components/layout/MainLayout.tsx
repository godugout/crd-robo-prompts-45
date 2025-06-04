
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/home/Navbar';
import { Loader } from 'lucide-react';

export const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('🔧 MainLayout rendering, path:', location.pathname, 'isHomePage:', isHomePage);

  useEffect(() => {
    console.log('🔧 MainLayout mounted');
    
    // Quick initialization
    const timer = setTimeout(() => {
      console.log('🔧 MainLayout finished loading');
      setIsLoading(false);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      console.log('🔧 MainLayout unmounted');
    };
  }, []);

  if (isLoading) {
    console.log('🔧 MainLayout showing loading spinner');
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141416]">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-white mb-4 mx-auto" />
          <p className="text-white">Loading layout...</p>
        </div>
      </div>
    );
  }

  console.log('🔧 MainLayout rendering navbar and outlet');
  return (
    <div className="min-h-screen bg-[#141416]">
      <Navbar />
      <div className="outlet-container">
        <Outlet />
      </div>
    </div>
  );
};
