
import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Interactive } from '@react-three/xr';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface ARCardDesignerProps {
  mode: 'design' | 'portal' | 'environmental';
  onCardCreate: (cardData: any) => void;
  environmentalData: {
    lighting: string;
    weather: string;
    temperature: number;
    humidity: number;
  };
}

export const ARCardDesigner: React.FC<ARCardDesignerProps> = ({
  mode,
  onCardCreate,
  environmentalData
}) => {
  const { scene } = useThree();
  const cardRef = useRef<THREE.Mesh>(null);
  const [cardPosition, setCardPosition] = useState<[number, number, number]>([0, 0, -1]);
  const [cardRotation, setCardRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [cardEffects, setCardEffects] = useState<string[]>([]);

  // Environmental effect mapping
  const getEnvironmentalMaterial = () => {
    const baseProps = {
      roughness: 0.1,
      metalness: 0.3,
    };

    switch (environmentalData.weather) {
      case 'rain':
        return {
          ...baseProps,
          emissive: new THREE.Color(0x004466),
          emissiveIntensity: 0.2,
        };
      case 'snow':
        return {
          ...baseProps,
          roughness: 0.8,
          metalness: 0.1,
          emissive: new THREE.Color(0x446688),
          emissiveIntensity: 0.1,
        };
      case 'sunny':
        return {
          ...baseProps,
          emissive: new THREE.Color(0x664400),
          emissiveIntensity: 0.3,
        };
      default:
        return baseProps;
    }
  };

  // Time-based animations
  useFrame((state) => {
    if (cardRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Environmental breathing effect
      const breathingScale = 1 + Math.sin(time * 2) * 0.02;
      cardRef.current.scale.setScalar(breathingScale);
      
      // Weather-based effects
      if (environmentalData.weather === 'rain') {
        cardRef.current.position.y += Math.sin(time * 5) * 0.001;
      } else if (environmentalData.weather === 'snow') {
        cardRef.current.rotation.y += Math.sin(time * 0.5) * 0.001;
      }
    }
  });

  const handleCardInteraction = (event: any) => {
    if (mode === 'design') {
      // Update card position based on interaction
      const newPosition = event.intersection.point;
      setCardPosition([newPosition.x, newPosition.y, newPosition.z]);
    }
  };

  const handleCardCreate = () => {
    const cardData = {
      id: `ar-card-${Date.now()}`,
      position: cardPosition,
      rotation: cardRotation,
      effects: cardEffects,
      environmental: environmentalData,
      timestamp: new Date().toISOString()
    };
    
    onCardCreate(cardData);
  };

  return (
    <group>
      {/* AR Design Surface */}
      <Interactive onSelect={handleCardInteraction}>
        <RoundedBox
          ref={cardRef}
          args={[0.3, 0.42, 0.02]}
          radius={0.02}
          smoothness={4}
          position={cardPosition}
          rotation={cardRotation}
        >
          <meshPhysicalMaterial
            color={mode === 'design' ? '#4a90e2' : mode === 'portal' ? '#e24a90' : '#90e24a'}
            transparent
            opacity={0.8}
            {...getEnvironmentalMaterial()}
          />
        </RoundedBox>
      </Interactive>

      {/* Environmental Effect Indicators */}
      {environmentalData.weather === 'rain' && (
        <group position={[cardPosition[0], cardPosition[1] + 0.5, cardPosition[2]]}>
          {Array.from({ length: 20 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 2,
              Math.random() * 2,
              (Math.random() - 0.5) * 2
            ]}>
              <sphereGeometry args={[0.002, 4, 4]} />
              <meshBasicMaterial color="#4a90e2" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}

      {environmentalData.weather === 'snow' && (
        <group position={[cardPosition[0], cardPosition[1] + 0.5, cardPosition[2]]}>
          {Array.from({ length: 15 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 2,
              Math.random() * 2,
              (Math.random() - 0.5) * 2
            ]}>
              <octahedronGeometry args={[0.003]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {/* Mode-specific UI Elements */}
      <Text
        position={[cardPosition[0], cardPosition[1] - 0.3, cardPosition[2]]}
        fontSize={0.04}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {mode.toUpperCase()} MODE
      </Text>

      <Text
        position={[cardPosition[0], cardPosition[1] - 0.35, cardPosition[2]]}
        fontSize={0.02}
        color="#aaa"
        anchorX="center"
        anchorY="middle"
      >
        {environmentalData.weather} • {environmentalData.temperature}°C
      </Text>

      {/* Create Button */}
      <Interactive onSelect={handleCardCreate}>
        <RoundedBox
          args={[0.15, 0.05, 0.02]}
          radius={0.01}
          position={[cardPosition[0], cardPosition[1] - 0.45, cardPosition[2]]}
        >
          <meshStandardMaterial color="#22c55e" />
        </RoundedBox>
      </Interactive>

      <Text
        position={[cardPosition[0], cardPosition[1] - 0.45, cardPosition[2] + 0.01]}
        fontSize={0.02}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        CREATE
      </Text>
    </group>
  );
};
