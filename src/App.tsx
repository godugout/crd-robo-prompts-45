import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DevPanel } from "@/components/dev/DevPanel";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Editor from "./pages/Editor";
import Profile from "./pages/Profile";
import Creators from "./pages/Creators";
import Debug from "./pages/Debug";
import Labs from "./pages/Labs";
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
            {/* Routes with main layout (includes navbar) */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="gallery" element={<Gallery />} />
              
              {/* Auth routes with navbar */}
              <Route 
                path="auth/signin" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <SignIn />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="auth/signup" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <SignUp />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected routes */}
              <Route 
                path="editor" 
                element={
                  <ProtectedRoute>
                    <Editor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="creators" element={<Creators />} />
              <Route path="debug" element={<Debug />} />
              <Route path="labs" element={<Labs />} />
            </Route>
            
            {/* Routes without layout */}
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
          
          {/* Development Panel */}
          <DevPanel />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
