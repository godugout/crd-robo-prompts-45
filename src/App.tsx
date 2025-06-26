
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
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
import { OrganizedCardStudio } from "@/components/studio/enhanced/OrganizedCardStudio";

const queryClient = new QueryClient();

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
            
            {/* All other routes with layout */}
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
              <Route 
                path="create" 
                element={
                  <ProtectedRoute>
                    <CardCreation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="cards/create" 
                element={
                  <ProtectedRoute>
                    <CardCreation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="cards/enhanced" 
                element={
                  <ProtectedRoute>
                    <OrganizedCardStudio />
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
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
