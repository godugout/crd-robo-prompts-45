import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import AuthCallback from "./pages/auth/AuthCallback";
import CardCreation from "./pages/CardCreation";
import { EnhancedStudio } from "@/components/studio/EnhancedStudio";
import SocialCosmosPage from '@/pages/SocialCosmosPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClient client={queryClient}>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Toaster />
            <Routes>
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
              
              {/* Main routes */}
              <Route path="/" element={<Index />} />
              <Route 
                path="/create" 
                element={
                  <ProtectedRoute>
                    <CardCreation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/studio" 
                element={
                  <ProtectedRoute>
                    <EnhancedStudio />
                  </ProtectedRoute>
                } 
              />
              <Route path="/social-cosmos" element={<SocialCosmosPage />} />
            </Routes>
          </div>
        </QueryClient>
      </AuthProvider>
    </Router>
  );
}

export default App;
