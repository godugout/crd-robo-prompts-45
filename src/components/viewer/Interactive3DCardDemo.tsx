
import React, { useState } from 'react';
import { Interactive3DCard, type InteractionMode } from './Interactive3DCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CardData } from '@/types/card';

export const Interactive3DCardDemo = () => {
  const [selectedMode, setSelectedMode] = useState<InteractionMode>('tilt');

  // Sample card data for demonstration
  const sampleCard: CardData = {
    id: 'demo-card',
    title: 'Sample CRD Card',
    description: 'Experience different 3D interaction modes with this demo card. Try switching between modes to see how each one feels!',
    rarity: 'epic',
    tags: ['demo', '3d', 'interactive'],
    creator_id: 'demo-creator-id',
    created_at: new Date().toISOString(),
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

  return (
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
        <Interactive3DCard
          card={sampleCard}
          mode={selectedMode}
          onModeChange={setSelectedMode}
          className="py-8"
        />
        
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
  );
};
