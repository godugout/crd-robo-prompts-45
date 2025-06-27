import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Sphere } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';

interface CardPortalSystemProps {
  active: boolean;
  onPortalCreate: (portalData: any) => void;
}

export const CardPortalSystem: React.FC<CardPortalSystemProps> = ({
  active,
  onPortalCreate
}) => {
  const [portals, setPortals] = useState<Array<{
    id: string;
    position: [number, number, number];
    connected: boolean;
    cardId?: string;
  }>>([]);
  
  const portalRefs = useRef<Map<string, THREE.Mesh>>(new Map());

  useFrame((state) => {
    // Animate portal effects
    portals.forEach(portal => {
      const portalMesh = portalRefs.current.get(portal.id);
      if (portalMesh) {
        const time = state.clock.getElapsedTime();
        portalMesh.rotation.z = time * 2;
        
        // Pulsing effect for active portals
        if (portal.connected) {
          const scale = 1 + Math.sin(time * 5) * 0.1;
          portalMesh.scale.setScalar(scale);
        }
      }
    });
  });

  const createPortal = (position: [number, number, number]) => {
    const newPortal = {
      id: `portal-${Date.now()}`,
      position,
      connected: false
    };
    
    setPortals(prev => [...prev, newPortal]);
    onPortalCreate(newPortal);
  };

  const handlePortalInteraction = (portalId: string) => {
    setPortals(prev => prev.map(portal => 
      portal.id === portalId 
        ? { ...portal, connected: !portal.connected }
        : portal
    ));
  };

  if (!active) return null;

  return (
    <group>
      {/* Portal Creation Interface */}
      <Interactive onSelect={(event) => {
        const position = event.intersection.point;
        createPortal([position.x, position.y, position.z]);
      }}>
        <RoundedBox args={[0.2, 0.05, 0.02]} position={[0, -0.8, -1]} radius={0.01}>
          <meshStandardMaterial color="#e24a90" emissive="#e24a90" emissiveIntensity={0.2} />
        </RoundedBox>
      </Interactive>
      
      <Text
        position={[0, -0.8, -0.99]}
        fontSize={0.02}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        TAP TO CREATE PORTAL
      </Text>

      {/* Existing Portals */}
      {portals.map(portal => (
        <group key={portal.id} position={portal.position}>
          {/* Portal Ring */}
          <Interactive onSelect={() => handlePortalInteraction(portal.id)}>
            <mesh
              ref={(ref) => {
                if (ref) portalRefs.current.set(portal.id, ref);
              }}
            >
              <torusGeometry args={[0.15, 0.02, 8, 16]} />
              <meshStandardMaterial
                color={portal.connected ? "#22c55e" : "#e24a90"}
                emissive={portal.connected ? "#22c55e" : "#e24a90"}
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
              />
            </mesh>
          </Interactive>

          {/* Portal Effect Particles */}
          {portal.connected && (
            <group>
              {Array.from({ length: 20 }, (_, i) => (
                <Sphere
                  key={i}
                  args={[0.003]}
                  position={[
                    Math.cos((i * Math.PI * 2) / 20) * 0.12,
                    Math.sin((i * Math.PI * 2) / 20) * 0.12,
                    (Math.random() - 0.5) * 0.1
                  ]}
                >
                  <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.7}
                  />
                </Sphere>
              ))}
            </group>
          )}

          {/* Portal Status Text */}
          <Text
            position={[0, -0.25, 0]}
            fontSize={0.03}
            color={portal.connected ? "#22c55e" : "#e24a90"}
            anchorX="center"
            anchorY="middle"
          >
            {portal.connected ? "CONNECTED" : "WAITING"}
          </Text>
        </group>
      ))}

      {/* Portal Instructions */}
      <Text
        position={[0, 0.8, -1]}
        fontSize={0.04}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        CARD PORTAL SYSTEM
      </Text>
      
      <Text
        position={[0, 0.75, -1]}
        fontSize={0.02}
        color="#aaa"
        anchorX="center"
        anchorY="middle"
      >
        Throw cards through portals to share across devices
      </Text>
    </group>
  );
};
