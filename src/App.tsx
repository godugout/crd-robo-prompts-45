
import { Routes, Route, Navigate } from 'react-router-dom';
import { OverlayProvider } from '@/components/overlay';
import { AuthProvider } from '@/contexts/AuthProvider';
import { EnhancedProtectedRoute } from '@/components/auth/EnhancedProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import Index from '@/pages/Index';
import Editor from '@/pages/Editor';
import Gallery from '@/pages/Gallery';
import Profile from '@/pages/Profile';
import Creators from '@/pages/Creators';
import DebugDetection from '@/pages/DebugDetection';
import { AuthPage } from '@/components/auth/AuthPage';

function App() {
  console.log('🔧 App component rendering');
  
  return (
    <AuthProvider>
      <OverlayProvider>
        <div className="min-h-screen bg-crd-darkest">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              
              {/* Protected routes that require authentication */}
              <Route path="editor" element={
                <EnhancedProtectedRoute>
                  <Editor />
                </EnhancedProtectedRoute>
              } />
              <Route path="editor/:cardId" element={
                <EnhancedProtectedRoute>
                  <Editor />
                </EnhancedProtectedRoute>
              } />
              <Route path="gallery" element={
                <EnhancedProtectedRoute>
                  <Gallery />
                </EnhancedProtectedRoute>
              } />
              <Route path="profile" element={
                <EnhancedProtectedRoute>
                  <Profile />
                </EnhancedProtectedRoute>
              } />
              
              {/* Public routes */}
              <Route path="creators" element={<Creators />} />
              <Route path="debug-detection" element={<DebugDetection />} />
              
              {/* Auth routes - redirect to home if already authenticated */}
              <Route path="auth/*" element={
                <EnhancedProtectedRoute requireAuth={false}>
                  <AuthPage />
                </EnhancedProtectedRoute>
              } />
              
              {/* Redirect /cards to /editor for unified experience */}
              <Route path="cards" element={<Navigate to="/editor" replace />} />
            </Route>
          </Routes>
        </div>
      </OverlayProvider>
    </AuthProvider>
  );
}

export default App;
