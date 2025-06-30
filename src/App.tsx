import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import AuthCallback from "./pages/auth/AuthCallback";
import CardCreation from "./pages/CardCreation";
import EnhancedCardCreationPage from "./pages/EnhancedCardCreationPage";
import FunctionalCardCreationPage from "./pages/FunctionalCardCreationPage";
import { EnhancedStudio } from "@/components/studio/EnhancedStudio";
import Collections from './pages/Collections';
import CreatorDashboardPage from './pages/CreatorDashboardPage';
import CommunityHubPage from './pages/CommunityHubPage';
import LabsPage from './pages/LabsPage';
import PSDPreviewPage from './pages/PSDPreviewPage';
import SimplePSDAnalysisPage from './pages/SimplePSDAnalysisPage';
import BulkPSDAnalysisPage from "./pages/BulkPSDAnalysisPage";
import Debug from "./pages/Debug";
import { NavigationProvider } from "@/contexts/NavigationContext";

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
      <ThemeProvider>
        <NavigationProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <div className="min-h-screen">
                  <Toaster />
                  <Routes>
                    {/* Auth routes - no navbar */}
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
                    
                    {/* Main routes - with universal navbar */}
                    <Route 
                      path="/" 
                      element={
                        <MainLayout>
                          <Index />
                        </MainLayout>
                      } 
                    />
                    <Route 
                      path="/create" 
                      element={
                        <MainLayout>
                          <ProtectedRoute>
                            <CardCreation />
                          </ProtectedRoute>
                        </MainLayout>
                      } 
                    />
                    <Route 
                      path="/create/enhanced" 
                      element={
                        <MainLayout>
                          <ProtectedRoute>
                            <EnhancedCardCreationPage />
                          </ProtectedRoute>
                        </MainLayout>
                      } 
                    />
                    <Route 
                      path="/create/functional" 
                      element={
                        <MainLayout>
                          <ProtectedRoute>
                            <FunctionalCardCreationPage />
                          </ProtectedRoute>
                        </MainLayout>
                      } 
                    />
                    <Route 
                      path="/studio" 
                      element={
                        <MainLayout>
                          <ProtectedRoute>
                            <EnhancedStudio />
                          </ProtectedRoute>
                        </MainLayout>
                      } 
                    />
                    <Route 
                      path="/collections" 
                      element={
                        <MainLayout>
                          <Collections />
                        </MainLayout>
                      } 
                    />
                    <Route 
                      path="/creator-dashboard" 
                      element={
                        <MainLayout>
                          <ProtectedRoute>
                            <CreatorDashboardPage />
                          </ProtectedRoute>
                        </MainLayout>
                      } 
                    />
                    <Route 
                      path="/community" 
                      element={
                        <MainLayout>
                          <CommunityHubPage />
                        </MainLayout>
                      } 
                    />
                    <Route 
                      path="/labs" 
                      element={
                        <MainLayout>
                          <ProtectedRoute>
                            <LabsPage />
                          </ProtectedRoute>
                        </MainLayout>
                      } 
                    />
                    <Route 
                      path="/debug/psd-preview" 
                      element={
                        <MainLayout>
                          <ProtectedRoute>
                            <SimplePSDAnalysisPage />
                          </ProtectedRoute>
                        </MainLayout>
                      } 
                    />
                    <Route 
                      path="/debug/psd-preview-advanced" 
                      element={
                        <MainLayout>
                          <ProtectedRoute>
                            <PSDPreviewPage />
                          </ProtectedRoute>
                        </MainLayout>
                      } 
                    />
                    <Route path="/debug/bulk-psd-analysis" element={<BulkPSDAnalysisPage />} />
                    <Route path="/debug" element={<Debug />} />
                  </Routes>
                </div>
              </TooltipProvider>
            </QueryClientProvider>
          </AuthProvider>
        </NavigationProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
