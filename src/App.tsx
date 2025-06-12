
import { Routes, Route, Navigate } from 'react-router-dom';
import { OverlayProvider } from '@/components/overlay/OverlayProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';
import Index from '@/pages/Index';
import Gallery from '@/pages/Gallery';
import Profile from '@/pages/Profile';
import AccountSettings from '@/pages/AccountSettings';
import Collections from '@/pages/Collections';
import Labs from '@/pages/Labs';
import LabsBulkUpload from '@/pages/LabsBulkUpload';
import LabsDebugDetection from '@/pages/LabsDebugDetection';
import Studio from '@/pages/Studio';
import CardDetail from '@/pages/CardDetail';
import CardsExtractMultiple from '@/pages/CardsExtractMultiple';
import CollectionDetail from '@/pages/CollectionDetail';
import OakMemoryCreator from '@/pages/OakMemoryCreator';
import { AuthPage } from '@/components/auth/AuthPage';
import { CardCreationFlow } from '@/components/editor/CardCreationFlow';

function App() {
  return (
    <OverlayProvider>
      <div className="min-h-screen bg-crd-darkest">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="cards" element={<CardCreationFlow />} />
            <Route path="cards/create" element={<CardCreationFlow />} />
            <Route path="cards/extract-multiple" element={<CardsExtractMultiple />} />
            {/* Redirect old bulk upload route to labs */}
            <Route path="cards/bulk-upload" element={<Navigate to="/labs/bulk-upload" replace />} />
            <Route path="card/:id" element={<CardDetail />} />
            <Route path="collection/:id" element={<CollectionDetail />} />
            <Route path="studio" element={<Studio />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="collections" element={<Collections />} />
            <Route path="oak-memory-creator" element={<OakMemoryCreator />} />
            {/* Redirect old creators route to collections */}
            <Route path="creators" element={<Navigate to="/collections" replace />} />
            {/* Labs routes */}
            <Route path="labs" element={<Labs />} />
            <Route path="labs/bulk-upload" element={<LabsBulkUpload />} />
            <Route path="labs/debug-detection" element={<LabsDebugDetection />} />
            {/* Redirect old debug route to labs */}
            <Route path="debug-detection" element={<Navigate to="/labs/debug-detection" replace />} />
            <Route path="*" element={<RouteErrorBoundary />} />
          </Route>
        </Routes>
      </div>
    </OverlayProvider>
  );
}

export default App;
