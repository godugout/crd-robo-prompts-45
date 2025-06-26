
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { RouteErrorBoundary } from "@/components/layout/RouteErrorBoundary";
import Index from "./pages/Index";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import AuthCallback from "./pages/auth/AuthCallback";
import CardCreation from "./pages/CardCreation";
import Editor from "./pages/Editor";
import OakMemoryCreator from "./pages/OakMemoryCreator";
import CardDetail from "./pages/CardDetail";
import Gallery from "./pages/Gallery";
import Profile from "./pages/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Auth routes without layout */}
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
            
            {/* All other routes with layout and error boundary */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="cards/:id" element={<CardDetail />} />
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              {/* Simplified card creation routes - remove duplicate */}
              <Route 
                path="create" 
                element={
                  <ProtectedRoute>
                    <CardCreation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="editor" 
                element={
                  <ProtectedRoute>
                    <Editor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="oak-memory" 
                element={
                  <ProtectedRoute>
                    <OakMemoryCreator />
                  </ProtectedRoute>
                } 
              />
              {/* Catch-all route for invalid paths */}
              <Route path="*" element={<RouteErrorBoundary />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
