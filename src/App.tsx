
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Navbar } from './components/home/Navbar';
import { RouteErrorBoundary } from './components/layout/RouteErrorBoundary';
import Home from './pages/Index';
import CardCreation from './pages/CardCreation';
import Gallery from './pages/Gallery';
import Profile from './pages/Profile';
import EnhancedStudio from './pages/EnhancedStudio';
import AccountSettings from './pages/AccountSettings';
import Collections from './pages/Collections';
import CommunityPage from './pages/CommunityPage';
import CreatorHub from './pages/CreatorHub';
import AdminDashboardPage from './pages/AdminDashboardPage';
import Editor from './pages/Editor';
import EditorMockup from './pages/EditorMockup';
import Debug from './pages/Debug';
import DebugDetection from './pages/DebugDetection';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-crd-darkest text-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CardCreation />} />
              <Route path="/cards/enhanced" element={<EnhancedStudio />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/creator" element={<CreatorHub />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/editor-mockup" element={<EditorMockup />} />
              <Route path="/debug" element={<Debug />} />
              <Route path="/debug-detection" element={<DebugDetection />} />
              <Route path="*" element={<RouteErrorBoundary />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
