
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Cards from "./pages/CardsPage";
import Collections from "./pages/Collections";
import Studio from "./pages/Studio";
import EnhancedStudio from "./pages/EnhancedStudio";
import Gallery from "./pages/Gallery";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Marketplace from "./pages/Marketplace";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Index />} />
                <Route path="cards" element={<Cards />} />
                <Route path="collections" element={<Collections />} />
                <Route path="studio" element={<Studio />} />
                <Route path="enhanced-studio" element={<EnhancedStudio />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="/auth/signin" element={<SignIn />} />
              <Route path="/auth/signup" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
