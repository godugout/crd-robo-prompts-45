
import React from 'react';
import { EnhancedHero } from '@/components/home/EnhancedHero';
import { SimplifiedDiscover } from '@/components/home/SimplifiedDiscover';
import { SimplifiedCTA } from '@/components/home/SimplifiedCTA';
import { Footer } from '@/components/home/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <EnhancedHero />
      <SimplifiedDiscover />
      <SimplifiedCTA />
      <Footer />
    </div>
  );
};

export default Index;
