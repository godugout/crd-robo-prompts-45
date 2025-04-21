import React, { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import CardDetail from "./pages/CardDetail";
import NotFound from "./pages/NotFound";
import { CardsPage } from "./components/cards/CardsPage";
import Editor from "./pages/Editor";
import Creators from "./pages/Creators";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Memories from "./pages/Memories";
import { MainLayout } from "./components/layout/MainLayout";
import Collections from "./pages/Collections";

const RouteLogger = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Route changed:', location.pathname);
  }, [location]);
  
  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
        }
      }
    },
  },
});

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    console.log('App is rendering and initializing');
    setIsLoaded(true);
  }, []);

  console.log('App render state:', { isLoaded });
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteLogger />
          {isLoaded ? (
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/cards" element={<CardsPage />} />
                <Route path="/feed" element={<Navigate to="/cards" replace />} />
                <Route path="/memories" element={<Memories />} />
                <Route path="/card/:id" element={<CardDetail />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/creators" element={<Creators />} />
                <Route path="/gallery" element={<Navigate to="/collections" replace />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/shop" element={<Navigate to="/gallery" replace />} />
                <Route path="/decks" element={<Navigate to="/collections" replace />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : (
            <div className="flex items-center justify-center min-h-screen">
              <p className="text-xl">Loading application...</p>
            </div>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
