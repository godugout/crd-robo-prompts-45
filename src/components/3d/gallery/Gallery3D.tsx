
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import { GalleryScene } from './GalleryScene';
import { GalleryControls } from './GalleryControls';
import { GalleryUI } from './GalleryUI';
import { useGalleryNavigation } from '@/hooks/useGalleryNavigation';
import { useGalleryLayout } from '@/hooks/useGalleryLayout';
import { useGalleryPreferences } from '@/hooks/useGalleryPreferences';
import type { Collection } from '@/types/collections';
import type { Card } from '@/types/cards';

export interface Gallery3DProps {
  collection: Collection;
  cards: Card[];
  onCardSelect?: (card: Card) => void;
  onCardInteraction?: (type: string, card: Card, data?: any) => void;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  enableVR?: boolean;
  enableMultiUser?: boolean;
  className?: string;
}

const GalleryLoadingFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-900">
    <div className="text-white text-lg">Loading 3D Gallery...</div>
  </div>
);

export const Gallery3D: React.FC<Gallery3DProps> = ({
  collection,
  cards,
  onCardSelect,
  onCardInteraction,
  quality = 'high',
  enableVR = false,
  enableMultiUser = false,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  
  const { preferences, updatePreferences } = useGalleryPreferences();
  const { 
    layoutType, 
    setLayoutType,
    cardPositions,
    recalculateLayout 
  } = useGalleryLayout(cards, preferences.layout);
  
  const {
    navigationState,
    navigateToCard,
    navigateToPosition,
    enableKeyboardNavigation,
    disableKeyboardNavigation
  } = useGalleryNavigation();

  // Environment settings based on collection theme
  const environmentSettings = useMemo(() => {
    const dominantColors = extractDominantColors(cards);
    return {
      preset: determinEnvironmentPreset(collection, dominantColors),
      background: generateDynamicBackground(dominantColors),
      lighting: calculateOptimalLighting(dominantColors)
    };
  }, [collection, cards]);

  // Handle card selection
  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    navigateToCard(card.id);
    onCardSelect?.(card);
  };

  // Handle card interactions
  const handleCardInteraction = (type: string, card: Card, data?: any) => {
    onCardInteraction?.(type, card, data);
    
    // Track interaction for analytics
    if (type === 'view') {
      updatePreferences({
        ...preferences,
        viewHistory: [...preferences.viewHistory, {
          cardId: card.id,
          timestamp: Date.now(),
          duration: data?.duration || 0
        }]
      });
    }
  };

  // Layout change handler
  const handleLayoutChange = (newLayout: string) => {
    setLayoutType(newLayout as any);
    updatePreferences({
      ...preferences,
      layout: newLayout as any
    });
  };

  useEffect(() => {
    if (cards.length > 0) {
      recalculateLayout();
      setIsInitialized(true);
    }
  }, [cards, recalculateLayout]);

  useEffect(() => {
    enableKeyboardNavigation();
    return () => disableKeyboardNavigation();
  }, [enableKeyboardNavigation, disableKeyboardNavigation]);

  if (!isInitialized) {
    return <GalleryLoadingFallback />;
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        ref={canvasRef}
        shadows={quality !== 'low'}
        dpr={quality === 'ultra' ? [1, 2] : [1, 1.5]}
        gl={{
          antialias: quality !== 'low',
          alpha: true,
          powerPreference: "high-performance"
        }}
        camera={{ position: [0, 5, 10], fov: 60 }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(new THREE.Color(environmentSettings.background), 1);
          if (quality !== 'low') {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }
        }}
      >
        <PerspectiveCamera makeDefault />
        
        {/* Environment and lighting */}
        <Environment preset={environmentSettings.preset as any} />
        <ambientLight intensity={environmentSettings.lighting.ambient} />
        <directionalLight 
          position={environmentSettings.lighting.directional.position as [number, number, number]}
          intensity={environmentSettings.lighting.directional.intensity}
          castShadow={quality !== 'low'}
        />
        
        {/* Orbit controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          autoRotate={preferences.autoRotate}
          autoRotateSpeed={0.5}
        />
        
        {/* Main gallery scene */}
        <Suspense fallback={null}>
          <GalleryScene
            collection={collection}
            cards={cards}
            cardPositions={cardPositions}
            selectedCard={selectedCard}
            layoutType={layoutType}
            quality={quality}
            navigationState={navigationState}
            onCardSelect={handleCardSelect}
            onCardInteraction={handleCardInteraction}
            environmentSettings={environmentSettings}
          />
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <GalleryUI
        collection={collection}
        cards={cards}
        selectedCard={selectedCard}
        layoutType={layoutType}
        onLayoutChange={handleLayoutChange}
        navigationState={navigationState}
        onNavigateToCard={navigateToCard}
        preferences={preferences}
        onPreferencesChange={updatePreferences}
      />
      
      {/* Gallery Controls */}
      <GalleryControls
        onNavigateToPosition={navigateToPosition}
        navigationState={navigationState}
        enableVR={enableVR}
        enableMultiUser={enableMultiUser}
      />
    </div>
  );
};

// Helper functions
function extractDominantColors(cards: Card[]): string[] {
  // Simplified color extraction - in real implementation would analyze card images
  return ['#4a90e2', '#7b68ee', '#50c878', '#ff6b6b'];
}

function determinEnvironmentPreset(collection: Collection, colors: string[]): string {
  const themes = collection.tags || [];
  if (themes.includes('vintage')) return 'warehouse';
  if (themes.includes('modern')) return 'studio';
  if (themes.includes('nature')) return 'forest';
  return 'city';
}

function generateDynamicBackground(colors: string[]): string {
  // Generate gradient background based on dominant colors
  return colors[0] || '#1a1a2e';
}

function calculateOptimalLighting(colors: string[]) {
  return {
    ambient: 0.4,
    directional: {
      position: [10, 10, 5],
      intensity: 1.0
    }
  };
}
