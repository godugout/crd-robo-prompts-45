
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/home/Navbar';
import Index from '@/pages/Index';
import Editor from '@/pages/Editor';
import Gallery from '@/pages/Gallery';
import { CardsPage } from '@/components/cards/CardsPage';
import { AuthPage } from '@/components/auth/AuthPage';

function App() {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:cardId" element={<Editor />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
