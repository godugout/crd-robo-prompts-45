
import React, { useState, useEffect } from 'react';
import { Interactive3DCard, type InteractionMode } from './Interactive3DCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import type { CardData } from '@/types/card';

export const Interactive3DCardDemo = () => {
  const [selectedMode, setSelectedMode] = useState<InteractionMode>('tilt');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log('🔧 Interactive3DCardDemo component mounted');
    setIsLoaded(true);
    return () => {
      console.log('🔧 Interactive3DCardDemo component unmounted');
    };
  }, []);

  // Sample card data for demonstration
  const sampleCard: CardData = {
    id: 'demo-card',
    title: 'Sample CRD Card',
    description: 'Experience different 3D interaction modes with this demo card. Try switching between modes to see how each one feels!',
    rarity: 'epic',
    tags: ['demo', '3d', 'interactive'],
    design_metadata: {},
    visibility: 'public',
    creator_attribution: {
      creator_name: 'Demo Creator',
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    }
  };

  console.log('🔧 Interactive3DCardDemo rendering, isLoaded:', isLoaded, 'selectedMode:', selectedMode);

  if (!isLoaded) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading Interactive 3D Card Experience...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary 
      componentName="Interactive3DCardDemo"
      fallback={
        <Card className="max-w-4xl mx-auto border-yellow-500/20 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-yellow-500">
              Interactive 3D Card Demo (Fallback Mode)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The interactive 3D card component encountered an error. Here's a simplified version:
            </p>
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg p-8 text-white text-center">
              <h3 className="text-xl font-bold mb-2">{sampleCard.title}</h3>
              <p className="text-sm opacity-90">{sampleCard.description}</p>
              <div className="mt-4 inline-block px-3 py-1 bg-white/20 rounded text-sm">
                {sampleCard.rarity}
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Interactive 3D Card Experience
          </CardTitle>
          <p className="text-muted-foreground">
            Explore different ways to interact with cards in 3D space
          </p>
        </CardHeader>
        <CardContent>
          <ErrorBoundary componentName="Interactive3DCard">
            <Interactive3DCard
              card={sampleCard}
              mode={selectedMode}
              onModeChange={setSelectedMode}
              className="py-8"
            />
          </ErrorBoundary>
          
          {/* Instructions */}
          <div className="mt-8 space-y-4 text-sm text-muted-foreground">
            <h4 className="font-semibold text-foreground">Interaction Instructions:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Tilt:</strong> Hover over the card to see it tilt naturally
              </div>
              <div>
                <strong>Orbital:</strong> Click and drag to rotate freely in 3D
              </div>
              <div>
                <strong>Gyroscope:</strong> Move your mouse to see smooth following
              </div>
              <div>
                <strong>Physics:</strong> Drag to add momentum and watch it coast
              </div>
              <div>
                <strong>Magnetic:</strong> Watch the card be attracted to your cursor
              </div>
              <div>
                <strong>Carousel:</strong> Use buttons to cycle through preset angles
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};
