
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Navbar } from './components/home/Navbar';
import Home from './pages/Index';
import CardCreation from './pages/CardCreation';
import Gallery from './pages/Gallery';
import Profile from './pages/Profile';
import EnhancedStudio from './pages/EnhancedStudio';
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
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
