
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Index';
import CardDetail from './pages/CardDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Auth from './pages/auth/SignIn';
import Editor from './pages/Editor';
import Studio from './pages/Studio';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import StreamlinedStudio from './pages/StreamlinedStudio';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-crd-darkest">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cards/:cardId" element={<CardDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="*" element={<NotFound />} />
              
              {/* Redirect enhanced to streamlined */}
              <Route path="/cards/enhanced" element={<Navigate to="/cards/streamlined" replace />} />
              <Route path="/cards" element={<Navigate to="/cards/streamlined" replace />} />
              
              {/* New streamlined creator */}
              <Route path="/cards/streamlined" element={<StreamlinedStudio />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
