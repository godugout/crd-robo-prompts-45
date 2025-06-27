
import React from 'react';
import { Environment } from '@react-three/drei';
import { CosmicEnvironment } from './CosmicEnvironment';
import { StudioEnvironment } from './StudioEnvironment';
import { BedroomEnvironment } from './BedroomEnvironment';
import { MathematicalEnvironment } from './MathematicalEnvironment';

interface EnvironmentSystemProps {
  environment: 'cosmic' | 'studio' | 'bedroom' | 'mathematical';
  intensity?: number;
}

export const EnvironmentSystem: React.FC<EnvironmentSystemProps> = ({
  environment,
  intensity = 1.0
}) => {
  const renderEnvironment = () => {
    switch (environment) {
      case 'cosmic':
        return <CosmicEnvironment intensity={intensity} />;
      
      case 'studio':
        return <StudioEnvironment intensity={intensity} />;
      
      case 'bedroom':
        return <BedroomEnvironment intensity={intensity} />;
      
      case 'mathematical':
        return <MathematicalEnvironment intensity={intensity} />;
      
      default:
        return <Environment preset="studio" />;
    }
  };

  return <>{renderEnvironment()}</>;
};
