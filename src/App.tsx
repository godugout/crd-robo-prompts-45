
import { Routes, Route, Navigate } from 'react-router-dom';
import { OverlayProvider } from '@/components/overlay';
import { MainLayout } from '@/components/layout/MainLayout';
import Index from '@/pages/Index';
import Editor from '@/pages/Editor';
import Gallery from '@/pages/Gallery';
import Profile from '@/pages/Profile';
import Creators from '@/pages/Creators';
import DebugDetection from '@/pages/DebugDetection';
import { AuthPage } from '@/components/auth/AuthPage';

function App() {
  return (
    <OverlayProvider>
      <div className="min-h-screen bg-crd-darkest">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="editor" element={<Editor />} />
            <Route path="editor/:cardId" element={<Editor />} />
            {/* Redirect /cards to /editor for unified experience */}
            <Route path="cards" element={<Navigate to="/editor" replace />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="creators" element={<Creators />} />
            <Route path="debug-detection" element={<DebugDetection />} />
          </Route>
        </Routes>
      </div>
    </OverlayProvider>
  );
}

export default App;
