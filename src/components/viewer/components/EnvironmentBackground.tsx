
import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { EnvironmentScene } from '../types';

// Dark wallpaper patterns for each scene type
const SCENE_PATTERNS = {
  studio: {
    baseColor: '#0a0a0b',
    patternColor: '#1a1a1d',
    pattern: 'geometric'
  },
  gallery: {
    baseColor: '#0f0f12',
    patternColor: '#1f1f24',
    pattern: 'marble'
  },
  stadium: {
    baseColor: '#0d1117',
    patternColor: '#1d2127',
    pattern: 'lines'
  },
  twilight: {
    baseColor: '#0a0b14',
    patternColor: '#1a1b24',
    pattern: 'stars'
  },
  quarry: {
    baseColor: '#0b0a0f',
    patternColor: '#1b1a1f',
    pattern: 'rocks'
  },
  coastline: {
    baseColor: '#080c12',
    patternColor: '#181c22',
    pattern: 'waves'
  },
  hillside: {
    baseColor: '#0a0f0a',
    patternColor: '#1a1f1a',
    pattern: 'organic'
  },
  milkyway: {
    baseColor: '#050508',
    patternColor: '#151518',
    pattern: 'cosmic'
  },
  esplanade: {
    baseColor: '#0c0a10',
    patternColor: '#1c1a20',
    pattern: 'urban'
  },
  neonclub: {
    baseColor: '#0f050a',
    patternColor: '#1f151a',
    pattern: 'neon'
  },
  industrial: {
    baseColor: '#0a0a0a',
    patternColor: '#1a1a1a',
    pattern: 'metal'
  }
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
  
  // Create a procedural pattern texture
  const createPatternTexture = (pattern: any) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Fill base color
    ctx.fillStyle = pattern.baseColor;
    ctx.fillRect(0, 0, 512, 512);
    
    // Draw pattern based on type
    ctx.fillStyle = pattern.patternColor;
    ctx.strokeStyle = pattern.patternColor;
    ctx.lineWidth = 1;
    
    switch (pattern.pattern) {
      case 'geometric':
        // Diamond grid pattern
        for (let x = 0; x < 512; x += 32) {
          for (let y = 0; y < 512; y += 32) {
            ctx.beginPath();
            ctx.moveTo(x + 16, y);
            ctx.lineTo(x + 32, y + 16);
            ctx.lineTo(x + 16, y + 32);
            ctx.lineTo(x, y + 16);
            ctx.closePath();
            ctx.stroke();
          }
        }
        break;
        
      case 'marble':
        // Marble-like veins
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random() * 512, Math.random() * 512);
          for (let j = 0; j < 10; j++) {
            ctx.quadraticCurveTo(
              Math.random() * 512, Math.random() * 512,
              Math.random() * 512, Math.random() * 512
            );
          }
          ctx.stroke();
        }
        break;
        
      case 'lines':
        // Diagonal lines
        for (let i = 0; i < 512; i += 16) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + 256, 512);
          ctx.stroke();
        }
        break;
        
      case 'stars':
        // Star field
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const size = Math.random() * 2 + 1;
          ctx.fillRect(x, y, size, size);
        }
        break;
        
      case 'waves':
        // Wave pattern
        for (let y = 0; y < 512; y += 20) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          for (let x = 0; x < 512; x += 4) {
            ctx.lineTo(x, y + Math.sin(x * 0.02) * 8);
          }
          ctx.stroke();
        }
        break;
        
      case 'organic':
        // Organic blob shapes
        for (let i = 0; i < 15; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const radius = Math.random() * 30 + 10;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
        
      case 'cosmic':
        // Cosmic swirls
        for (let i = 0; i < 8; i++) {
          const centerX = Math.random() * 512;
          const centerY = Math.random() * 512;
          ctx.beginPath();
          for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
            const radius = angle * 8;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            if (angle === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        break;
        
      case 'urban':
        // Grid pattern
        for (let x = 0; x < 512; x += 24) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 512);
          ctx.stroke();
        }
        for (let y = 0; y < 512; y += 24) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(512, y);
          ctx.stroke();
        }
        break;
        
      case 'neon':
        // Neon glow effects
        ctx.shadowColor = pattern.patternColor;
        ctx.shadowBlur = 10;
        for (let i = 0; i < 12; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 20 + 5, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
        
      case 'metal':
        // Metal scratches
        for (let i = 0; i < 30; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random() * 512, Math.random() * 512);
          ctx.lineTo(Math.random() * 512, Math.random() * 512);
          ctx.stroke();
        }
        break;
        
      default:
        // Default subtle grid
        for (let x = 0; x < 512; x += 32) {
          for (let y = 0; y < 512; y += 32) {
            ctx.fillRect(x, y, 1, 1);
          }
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    
    return texture;
  };
  
  useEffect(() => {
    const patternData = SCENE_PATTERNS[scene.id as keyof typeof SCENE_PATTERNS] || SCENE_PATTERNS.studio;
    const patternTexture = createPatternTexture(patternData);
    
    if (stationary) {
      // Create background sphere for stationary mode
      const geometry = new THREE.SphereGeometry(50, 32, 16);
      const material = new THREE.MeshBasicMaterial({
        map: patternTexture,
        side: THREE.BackSide
      });
      
      if (backgroundRef.current) {
        threeScene.remove(backgroundRef.current);
      }
      
      const backgroundSphere = new THREE.Mesh(geometry, material);
      backgroundRef.current = backgroundSphere;
      threeScene.add(backgroundSphere);
      
      // Set environment
      threeScene.environment = patternTexture;
      threeScene.background = null;
    } else {
      // Standard background that moves with camera
      threeScene.background = patternTexture;
      threeScene.environment = patternTexture;
    }
    
    return () => {
      if (backgroundRef.current) {
        threeScene.remove(backgroundRef.current);
      }
      if (patternTexture) {
        patternTexture.dispose();
      }
    };
  }, [scene, threeScene, stationary]);
  
  return null;
};
