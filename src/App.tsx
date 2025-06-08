
import { Routes, Route, Navigate } from 'react-router-dom';
import { OverlayProvider } from '@/components/overlay/OverlayProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';
import Index from '@/pages/Index';
import Gallery from '@/pages/Gallery';
import Profile from '@/pages/Profile';
import AccountSettings from '@/pages/AccountSettings';
import Creators from '@/pages/Creators';
import DebugDetection from '@/pages/DebugDetection';
import Studio from '@/pages/Studio';
import CardDetail from '@/pages/CardDetail';
import { AuthPage } from '@/components/auth/AuthPage';
import { CardCreationFlow } from '@/components/editor/CardCreationFlow';
import { MobileCardsWrapper } from '@/components/cards/MobileCardsWrapper';

function App() {
  return (
    <OverlayProvider>
      <div className="min-h-screen bg-crd-darkest">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="cards" element={<CardCreationFlow />} />
            <Route path="cards/create" element={<CardCreationFlow />} />
            <Route path="cards/bulk-upload" element={<MobileCardsWrapper />} />
            <Route path="card/:id" element={<CardDetail />} />
            <Route path="studio" element={<Studio />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="creators" element={<Creators />} />
            <Route path="debug-detection" element={<DebugDetection />} />
            <Route path="*" element={<RouteErrorBoundary />} />
          </Route>
        </Routes>
      </div>
    </OverlayProvider>
  );
}

export default App;
