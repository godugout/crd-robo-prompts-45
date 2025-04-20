
import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/home/Navbar';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Home, Image, Camera, Settings, Loader } from 'lucide-react';

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

  if (isHomePage) {
    console.log('Rendering homepage layout');
    return (
      <>
        <Navbar />
        <div className="outlet-container">
          <Outlet />
        </div>
      </>
    );
  }

  console.log('Rendering standard layout');
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/'}>
                      <Link to="/">
                        <Home />
                        <span>Home</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/feed'}>
                      <Link to="/feed">
                        <Image />
                        <span>Feed</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/editor'}>
                      <Link to="/editor">
                        <Camera />
                        <span>Create Card</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/decks'}>
                      <Link to="/decks">
                        <Image />
                        <span>Decks</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/settings'}>
                      <Link to="/settings">
                        <Settings />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <Navbar />
          <div className="outlet-container p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
