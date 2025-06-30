
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { FeaturedCards } from '@/components/home/FeaturedCards';
import { CreatorSection } from '@/components/home/CreatorSection';
import { DiscoverSection } from '@/components/home/DiscoverSection';
import { CollectionsSection } from '@/components/home/CollectionsSection';
import { Hero } from '@/components/home/Hero';

const Index: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary">
      <Hero />
      <FeaturedCards />
      <CreatorSection />
      <DiscoverSection />
      <CollectionsSection />
    </div>
  );
};

export default Index;
