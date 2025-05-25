
import React, { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import CardDetail from "./pages/CardDetail";
import NotFound from "./pages/NotFound";
import { CardsPage } from "./components/cards/CardsPage";
import Editor from "./pages/Editor";
import EditorMockup from "./pages/EditorMockup";
import Creators from "./pages/Creators";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Memories from "./pages/Memories";
import Collections from "./pages/Collections";
import Gallery from "./pages/Gallery";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import MagicLink from "./pages/auth/MagicLink";
import AuthCallback from "./pages/auth/AuthCallback";
import { OnboardingFlow } from "./components/auth/OnboardingFlow";
import AccountSettings from "./pages/AccountSettings";
import { MainLayout } from "./components/layout/MainLayout";

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
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteLogger />
            {isLoaded ? (
              <Routes>
                {/* Public auth routes */}
                <Route path="/auth/signin" element={
                  <ProtectedRoute requireAuth={false}>
                    <SignIn />
                  </ProtectedRoute>
                } />
                <Route path="/auth/signup" element={
                  <ProtectedRoute requireAuth={false}>
                    <SignUp />
                  </ProtectedRoute>
                } />
                <Route path="/auth/onboarding" element={
                  <ProtectedRoute requireAuth={false}>
                    <OnboardingFlow />
                  </ProtectedRoute>
                } />
                <Route path="/auth/forgot-password" element={
                  <ProtectedRoute requireAuth={false}>
                    <ForgotPassword />
                  </ProtectedRoute>
                } />
                <Route path="/auth/reset-password" element={
                  <ProtectedRoute requireAuth={false}>
                    <ResetPassword />
                  </ProtectedRoute>
                } />
                <Route path="/auth/magic-link" element={
                  <ProtectedRoute requireAuth={false}>
                    <MagicLink />
                  </ProtectedRoute>
                } />
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* Editor Mockup - standalone route */}
                <Route path="/editor-mockup" element={<EditorMockup />} />

                {/* Protected routes */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/cards" element={<CardsPage />} />
                  <Route path="/feed" element={<Navigate to="/cards" replace />} />
                  <Route path="/memories" element={
                    <ProtectedRoute>
                      <Memories />
                    </ProtectedRoute>
                  } />
                  <Route path="/card/:id" element={<CardDetail />} />
                  <Route path="/editor" element={
                    <ProtectedRoute>
                      <Editor />
                    </ProtectedRoute>
                  } />
                  <Route path="/creators" element={<Creators />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/account" element={
                    <ProtectedRoute>
                      <AccountSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/collections" element={
                    <ProtectedRoute>
                      <Collections />
                    </ProtectedRoute>
                  } />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            ) : (
              <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl">Loading application...</p>
              </div>
            )}
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
