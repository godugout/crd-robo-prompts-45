
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { OverlayProvider } from '@/components/overlay/OverlayProvider';
import { OverlayManager } from '@/components/overlay/OverlayManager';
import { NavigationManager } from '@/components/navigation/NavigationManager';

// Pages
import Home from '@/pages/Home';
import CardCreation from '@/pages/CardCreation';
import CardCreationTest from '@/pages/CardCreationTest';
import ModernPSDAnalysisPage from '@/pages/ModernPSDAnalysisPage';
import ProfessionalCardStudio from '@/pages/ProfessionalCardStudio';

function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <OverlayProvider>
          <Router>
            <div className="App">
              <NavigationManager />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CardCreation />} />
                <Route path="/create/test" element={<CardCreationTest />} />
                <Route path="/create/enhanced" element={<CardCreation />} />
                <Route path="/studio" element={<ProfessionalCardStudio />} />
                <Route path="/psd-analysis" element={<ModernPSDAnalysisPage />} />
              </Routes>
              <OverlayManager />
              <Toaster />
            </div>
          </Router>
        </OverlayProvider>
      </NavigationProvider>
    </AuthProvider>
  );
}

export default App;
