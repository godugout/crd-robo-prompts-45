
import React from 'react';
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
import { useUser } from '@/hooks/use-user';
import { Home, Gallery, Image, Camera, MessageSquare, Settings, User } from 'lucide-react';

export const MainLayout = () => {
  const location = useLocation();
  const { user } = useUser();
  const isHomePage = location.pathname === '/';

  // Only show sidebar on non-home pages
  if (isHomePage) {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  }

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
                        <Gallery />
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
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {user && (
              <SidebarGroup>
                <SidebarGroupLabel>Personal</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location.pathname === '/profile'}>
                        <Link to="/profile">
                          <User />
                          <span>Profile</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location.pathname === '/decks'}>
                        <Link to="/decks">
                          <Image />
                          <span>My Decks</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location.pathname === '/messages'}>
                        <Link to="/messages">
                          <MessageSquare />
                          <span>Messages</span>
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
            )}
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};
