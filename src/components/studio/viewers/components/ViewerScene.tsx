
import React from 'react';
import { Environment, Text } from '@react-three/drei';
import { useAdvancedStudio } from '@/contexts/AdvancedStudioContext';
import { Card3DMesh } from './Card3DMesh';
import { LightingSystem } from './LightingSystem';

export const ViewerScene: React.FC = () => {
  const { state } = useAdvancedStudio();
  const { selectedCard, material, lighting, animation, environment, effectLayers } = state;
  
  // Map environment presets to valid drei presets
  const getEnvironmentPreset = (preset: string) => {
    const presetMap: Record<string, any> = {
      'studio': 'studio',
      'nature': 'forest',
      'sunset': 'sunset',
      'neon': 'night'
    };
    return presetMap[preset] || 'studio';
  };

  return (
    <>
      {/* Environment */}
      <Environment 
        preset={getEnvironmentPreset(environment.preset)} 
        backgroundIntensity={environment.hdriIntensity}
        environmentIntensity={environment.hdriIntensity}
      />
      
      {/* Lighting setup */}
      <LightingSystem lighting={lighting} />
      
      {/* Main card or placeholder */}
      {selectedCard ? (
        <Card3DMesh 
          card={selectedCard}
          material={material}
          animation={animation}
          effectLayers={effectLayers}
        />
      ) : (
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Select a card to preview
        </Text>
      )}
    </>
  );
};
