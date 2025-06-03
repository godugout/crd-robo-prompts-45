
import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { EnvironmentScene } from '../types';

// Photo background URLs for each scene type
const SCENE_PHOTOS = {
  studio: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1920&h=1080&fit=crop',
  gallery: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop',
  stadium: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1920&h=1080&fit=crop',
  twilight: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
  quarry: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
  coastline: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1080&fit=crop',
  hillside: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop',
  milkyway: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920&h=1080&fit=crop',
  esplanade: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop',
  neonclub: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&h=1080&fit=crop',
  industrial: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&h=1080&fit=crop'
};

interface EnvironmentBackgroundProps {
  scene: EnvironmentScene;
  stationary?: boolean;
}

export const EnvironmentBackground: React.FC<EnvironmentBackgroundProps> = ({ 
  scene, 
  stationary = false 
}) => {
  const { scene: threeScene } = useThree();
  const backgroundRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const photoUrl = SCENE_PHOTOS[scene.id as keyof typeof SCENE_PHOTOS];
    
    if (photoUrl && stationary) {
      // Create a large sphere for stationary background
      textureLoader.load(
        photoUrl,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          
          // Create background sphere
          const geometry = new THREE.SphereGeometry(50, 32, 16);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
          });
          
          if (backgroundRef.current) {
            threeScene.remove(backgroundRef.current);
          }
          
          const backgroundSphere = new THREE.Mesh(geometry, material);
          backgroundRef.current = backgroundSphere;
          threeScene.add(backgroundSphere);
          
          // Also set as environment for reflections
          threeScene.environment = texture;
          threeScene.background = null;
        },
        undefined,
        () => {
          // Fallback to simple color
          threeScene.background = new THREE.Color(scene.lighting.color);
        }
      );
    } else if (photoUrl) {
      // Standard background that moves with camera
      textureLoader.load(
        photoUrl,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          threeScene.background = texture;
          threeScene.environment = texture;
        },
        undefined,
        () => {
          // Fallback to simple color
          threeScene.background = new THREE.Color(scene.lighting.color);
        }
      );
    } else {
      threeScene.background = new THREE.Color(scene.lighting.color);
    }
    
    return () => {
      if (backgroundRef.current) {
        threeScene.remove(backgroundRef.current);
      }
      if (threeScene.background && threeScene.background instanceof THREE.Texture) {
        threeScene.background.dispose();
      }
    };
  }, [scene, threeScene, stationary]);
  
  return null;
};
