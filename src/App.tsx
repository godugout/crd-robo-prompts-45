
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
import EnhancedCardCreationPage from "./pages/EnhancedCardCreationPage";
import { EnhancedStudio } from "@/components/studio/EnhancedStudio";
import Collections from './pages/Collections';
import CreatorDashboardPage from './pages/CreatorDashboardPage';
import CommunityHubPage from './pages/CommunityHubPage';
import PSDPreviewPage from './pages/PSDPreviewPage';

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
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
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
                  path="/create/enhanced" 
                  element={
                    <ProtectedRoute>
                      <EnhancedCardCreationPage />
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
                <Route path="/collections" element={<Collections />} />
                <Route 
                  path="/creator-dashboard" 
                  element={
                    <ProtectedRoute>
                      <CreatorDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/community" element={<CommunityHubPage />} />
                <Route 
                  path="/debug/psd-preview" 
                  element={
                    <ProtectedRoute>
                      <PSDPreviewPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
