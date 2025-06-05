
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DevPanel } from "@/components/dev/DevPanel";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Editor from "./pages/Editor";
import Profile from "./pages/Profile";
import Creators from "./pages/Creators";
import DebugDetection from "./pages/DebugDetection";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import AuthCallback from "./pages/auth/AuthCallback";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/gallery" element={<Gallery />} />
            
            {/* Auth routes */}
            <Route 
              path="/auth/signin" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <SignIn />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/signup" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <SignUp />
                </ProtectedRoute>
              } 
            />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected routes */}
            <Route 
              path="/editor" 
              element={
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="/creators" element={<Creators />} />
            <Route path="/debug-detection" element={<DebugDetection />} />
          </Routes>
          
          {/* Development Panel */}
          <DevPanel />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
