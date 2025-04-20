
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log('App is rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
