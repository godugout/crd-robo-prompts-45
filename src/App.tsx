
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from './components/layout/Navbar';
import Home from './pages/Index';
import Gallery from './pages/Gallery';
import Editor from './pages/Editor';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { OakMemoryCreator } from './pages/OakMemoryCreator';
import { CardStudio } from './components/studio/CardStudio';
import CardCreation from '@/pages/CardCreation';
import CardDetail from '@/pages/CardDetail';
import Labs from '@/pages/Labs';
import CardsEnhanced from '@/pages/CardsEnhanced';
import Profile from '@/pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/editor" element={<Editor />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/oak-creator" element={<OakMemoryCreator />} />
                  <Route path="/studio" element={<CardStudio />} />
                  <Route path="/cards/enhanced" element={<CardsEnhanced />} />
                  <Route path="/cards/create" element={<CardsEnhanced />} />
                  <Route path="/create" element={<CardCreation />} />
                  <Route path="/card/:id" element={<CardDetail />} />
                  <Route path="/labs" element={<Labs />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Suspense>
            </main>
            <Toaster />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
