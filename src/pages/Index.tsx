import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Users, 
  Trophy,
  TrendingUp,
  Star,
  Heart,
  MessageSquare,
  Share2,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/home/Navbar';
import { FeaturedCards } from '@/components/home/FeaturedCards';
import { CreatorSection } from '@/components/home/CreatorSection';
import { DiscoverSection } from '@/components/home/DiscoverSection';
import { CollectionsSection } from '@/components/home/CollectionsSection';

const Index: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />
      <FeaturedCards />
      <CreatorSection />
      <DiscoverSection />
      <CollectionsSection />
    </div>
  );
};

export default Index;
