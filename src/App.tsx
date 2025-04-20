
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import CardDetail from "./pages/CardDetail";
import NotFound from "./pages/NotFound";
import { FeedPage } from "./components/feed/FeedPage";
import Editor from "./pages/Editor";
import Templates from "./pages/Templates";
import Decks from "./pages/Decks";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Memories from "./pages/Memories";
import { MainLayout } from "./components/layout/MainLayout";
import Collections from "./pages/Collections";

// Route logging component to help debug routing issues
const RouteLogger = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Route changed:', location.pathname);
  }, [location]);
  
  return null;
};

// Create a new query client with proper error handling
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
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/memories" element={<Memories />} />
                <Route path="/card/:id" element={<CardDetail />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/decks" element={<Decks />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/collections" element={<Collections />} />
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
