import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CARD_CONSTANTS } from '../constants/cardRenderer';

interface EnhancedFrameSystemProps {
  selectedFrame?: string;
  dimensions: { width: number; height: number; depth: number };
  effectLayerCount: number;
  quality: 'low' | 'medium' | 'high' | 'ultra';
}

interface FrameConfig {
  multiplier: number;
  depth: number;
  name: string;
  type: 'border' | 'case';
  materials: {
    primary: THREE.MaterialParameters;
    secondary?: THREE.MaterialParameters;
    glass?: THREE.MaterialParameters;
  };
}

export const EnhancedFrameSystem: React.FC<EnhancedFrameSystemProps> = ({
  selectedFrame = 'GRADED_CASE',
  dimensions,
  effectLayerCount,
  quality
}) => {
  // Enhanced frame configurations
  const frameConfigs: Record<string, FrameConfig> = useMemo(() => ({
    THIN_BORDER: {
      ...CARD_CONSTANTS.FRAME_TYPES.THIN_BORDER,
      type: 'border',
      materials: {
        primary: {
          color: '#C0C0C0',
          metalness: 0.8,
          roughness: 0.3,
          transparent: true,
          opacity: 0.9
        }
      }
    },
    THICK_BORDER: {
      ...CARD_CONSTANTS.FRAME_TYPES.THICK_BORDER,
      type: 'border',
      materials: {
        primary: {
          color: '#FFD700',
          metalness: 0.9,
          roughness: 0.1,
          transparent: true,
          opacity: 0.95
        }
      }
    },
    GRADED_CASE: {
      ...CARD_CONSTANTS.FRAME_TYPES.GRADED_CASE,
      type: 'case',
      materials: {
        primary: {
          color: '#2A2A2A',
          metalness: 0.2,
          roughness: 0.8,
          transparent: false
        },
        secondary: {
          color: '#1A1A1A',
          metalness: 0.1,
          roughness: 0.9,
          transparent: false
        },
        glass: {
          color: '#FFFFFF',
          metalness: 0.0,
          roughness: 0.0,
          transmission: 0.95,
          thickness: 0.02,
          transparent: true,
          opacity: 0.1,
          ior: 1.5
        }
      }
    },
    PREMIUM_CASE: {
      ...CARD_CONSTANTS.FRAME_TYPES.PREMIUM_CASE,
      type: 'case',
      materials: {
        primary: {
          color: '#1A1A1A',
          metalness: 0.3,
          roughness: 0.6,
          transparent: false
        },
        secondary: {
          color: '#0A0A0A',
          metalness: 0.2,
          roughness: 0.8,
          transparent: false
        },
        glass: {
          color: '#FFFFFF',
          metalness: 0.0,
          roughness: 0.0,
          transmission: 0.98,
          thickness: 0.01,
          transparent: true,
          opacity: 0.05,
          ior: 1.52
        }
      }
    }
  }), []);

  const currentFrame = frameConfigs[selectedFrame] || frameConfigs.GRADED_CASE;
  
  // Calculate positions and sizes
  const frameSize = {
    width: dimensions.width * currentFrame.multiplier,
    height: dimensions.height * currentFrame.multiplier
  };
  
  const baseOffset = dimensions.depth / 2 + (effectLayerCount + 1) * CARD_CONSTANTS.EFFECT_LAYER_OFFSET;
  
  // Render different frame types
  const renderBorderFrame = () => (
    <mesh position={[0, 0, baseOffset]} userData={{ layer: CARD_CONSTANTS.LAYER_ORDER.FRAME_FRONT }}>
      <planeGeometry args={[frameSize.width, frameSize.height]} />
      <meshPhysicalMaterial {...currentFrame.materials.primary} />
    </mesh>
  );

  const renderCaseFrame = () => {
    const caseDepth = currentFrame.depth;
    const innerPadding = 0.05;
    
    return (
      <group>
        {/* Case Back */}
        <mesh position={[0, 0, baseOffset - caseDepth]} userData={{ layer: CARD_CONSTANTS.LAYER_ORDER.FRAME_BACK }}>
          <planeGeometry args={[frameSize.width, frameSize.height]} />
          <meshPhysicalMaterial {...currentFrame.materials.primary} />
        </mesh>
        
        {/* Case Sides */}
        {/* Top */}
        <mesh position={[0, frameSize.height/2 - innerPadding/2, baseOffset - caseDepth/2]}>
          <boxGeometry args={[frameSize.width, innerPadding, caseDepth]} />
          <meshPhysicalMaterial {...currentFrame.materials.secondary} />
        </mesh>
        
        {/* Bottom */}
        <mesh position={[0, -frameSize.height/2 + innerPadding/2, baseOffset - caseDepth/2]}>
          <boxGeometry args={[frameSize.width, innerPadding, caseDepth]} />
          <meshPhysicalMaterial {...currentFrame.materials.secondary} />
        </mesh>
        
        {/* Left */}
        <mesh position={[-frameSize.width/2 + innerPadding/2, 0, baseOffset - caseDepth/2]}>
          <boxGeometry args={[innerPadding, frameSize.height - innerPadding * 2, caseDepth]} />
          <meshPhysicalMaterial {...currentFrame.materials.secondary} />
        </mesh>
        
        {/* Right */}
        <mesh position={[frameSize.width/2 - innerPadding/2, 0, baseOffset - caseDepth/2]}>
          <boxGeometry args={[innerPadding, frameSize.height - innerPadding * 2, caseDepth]} />
          <meshPhysicalMaterial {...currentFrame.materials.secondary} />
        </mesh>
        
        {/* Protective Glass/Acrylic Front */}
        {currentFrame.materials.glass && quality !== 'low' && (
          <mesh position={[0, 0, baseOffset + 0.005]} userData={{ layer: CARD_CONSTANTS.LAYER_ORDER.CASE_GLASS }}>
            <planeGeometry args={[
              frameSize.width - innerPadding * 2, 
              frameSize.height - innerPadding * 2
            ]} />
            <meshPhysicalMaterial {...currentFrame.materials.glass} />
          </mesh>
        )}
        
        {/* Interior Label/Branding (subtle) */}
        <mesh position={[0, -frameSize.height/2 + innerPadding * 2, baseOffset - caseDepth + 0.001]}>
          <planeGeometry args={[frameSize.width * 0.3, innerPadding * 0.5]} />
          <meshBasicMaterial 
            color="#333333" 
            transparent 
            opacity={0.7}
          />
        </mesh>
      </group>
    );
  };

  if (!selectedFrame) return null;

  return (
    <group name="enhanced-frame-system">
      {currentFrame.type === 'border' ? renderBorderFrame() : renderCaseFrame()}
      
      {/* Add subtle ambient glow for premium cases */}
      {currentFrame.type === 'case' && quality === 'ultra' && (
        <pointLight
          position={[0, 0, baseOffset + 0.5]}
          intensity={0.2}
          color="#ffffff"
          distance={2}
          decay={2}
        />
      )}
    </group>
  );
};