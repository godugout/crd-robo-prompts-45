
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { Sparkles } from '@react-three/drei';
import { EnhancedHolographicMaterial } from '../materials/EnhancedHolographicMaterial';
import { calculateAspectRatioPreservation, configureTextureForCard } from '../utils/textureUtils';
import type { CardData } from '@/hooks/useCardEditor';

interface Card3DMeshProps {
  cardData: CardData;
  imageUrl?: string;
  effects: {
    holographic?: boolean;
    metalness?: number;
    roughness?: number;
    particles?: boolean;
    glow?: boolean;
    glowColor?: string;
    chrome?: boolean;
    crystal?: boolean;
    vintage?: boolean;
  };
}

export const Card3DMesh: React.FC<Card3DMeshProps> = ({
  cardData,
  imageUrl,
  effects
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [textureError, setTextureError] = useState(false);
  
  // Card dimensions (trading card standard: 2.5" x 3.5")
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardThickness = 0.05;
  
  // Create fallback texture
  const fallbackTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 716; // Maintains 2.5:3.5 ratio
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, 716);
      gradient.addColorStop(0, '#0f4c3a');
      gradient.addColorStop(1, '#1a5c47');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 716);
      
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CRD', 256, 380);
    }
    const texture = new THREE.CanvasTexture(canvas);
    configureTextureForCard(texture);
    return texture;
  }, []);
  
  // Safe texture loading with error handling
  const safeImageUrl = useMemo(() => {
    // If imageUrl is a blob URL that might be invalid, validate it first
    if (imageUrl && imageUrl.startsWith('blob:')) {
      // For blob URLs, we'll handle errors in the useEffect below
      return imageUrl;
    }
    // For regular URLs, use them directly or fallback
    return imageUrl || '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';
  }, [imageUrl]);
  
  // Load texture with proper error handling
  const [frontTexture, setFrontTexture] = useState<THREE.Texture>(fallbackTexture);
  
  useEffect(() => {
    if (!safeImageUrl || textureError) {
      setFrontTexture(fallbackTexture);
      return;
    }

    const loader = new TextureLoader();
    
    // For blob URLs, validate first
    if (safeImageUrl.startsWith('blob:')) {
      // Test if blob URL is still valid by creating an image
      const testImg = new Image();
      testImg.onload = () => {
        // Blob is valid, proceed with texture loading
        loader.load(
          safeImageUrl,
          (texture) => {
            configureTextureForCard(texture);
            setFrontTexture(texture);
            setTextureError(false);
          },
          undefined,
          (error) => {
            console.warn('Failed to load texture, using fallback:', error);
            setTextureError(true);
            setFrontTexture(fallbackTexture);
          }
        );
      };
      testImg.onerror = () => {
        console.warn('Blob URL is invalid, using fallback texture');
        setTextureError(true);
        setFrontTexture(fallbackTexture);
      };
      testImg.src = safeImageUrl;
    } else {
      // Regular URL loading
      loader.load(
        safeImageUrl,
        (texture) => {
          configureTextureForCard(texture);
          setFrontTexture(texture);
          setTextureError(false);
        },
        undefined,
        (error) => {
          console.warn('Failed to load texture, using fallback:', error);
          setTextureError(true);
          setFrontTexture(fallbackTexture);
        }
      );
    }
  }, [safeImageUrl, fallbackTexture, textureError]);
  
  // Create card back texture
  const cardBackTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 716; // Maintains 2.5:3.5 ratio
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(256, 358, 0, 256, 358, 400);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.6, '#16213e');
      gradient.addColorStop(1, '#0f1419');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 716);
      
      // Add subtle pattern
      ctx.strokeStyle = '#16213e';
      ctx.lineWidth = 2;
      for (let i = 1; i < 15; i++) {
        ctx.beginPath();
        ctx.arc(256, 358, i * 20, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // CRD logo
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 64px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CRD', 256, 380);
      
      ctx.fillStyle = '#64748b';
      ctx.font = '24px Arial';
      ctx.fillText('PREMIUM CARD', 256, 420);
    }
    const backTexture = new THREE.CanvasTexture(canvas);
    configureTextureForCard(backTexture);
    return backTexture;
  }, []);
  
  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
      
      // Auto-rotate when not hovered
      if (!hovered) {
        meshRef.current.rotation.y += 0.002;
      }
    }
  });
  
  return (
    <group>
      {/* Main card mesh with proper thickness */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered ? 1.02 : 1}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
        
        {/* Edge materials (sides) */}
        <meshStandardMaterial attach="material-0" color="#2a2a3a" /> {/* Right edge */}
        <meshStandardMaterial attach="material-1" color="#2a2a3a" /> {/* Left edge */}
        <meshStandardMaterial attach="material-2" color="#2a2a3a" /> {/* Top edge */}
        <meshStandardMaterial attach="material-3" color="#2a2a3a" /> {/* Bottom edge */}
        
        {/* Front face with effects */}
        {effects.holographic || effects.chrome || effects.crystal || effects.vintage ? (
          <EnhancedHolographicMaterial 
            texture={frontTexture}
            effects={effects}
          />
        ) : (
          <meshStandardMaterial 
            attach="material-4"
            map={frontTexture}
            metalness={effects.metalness || 0.1}
            roughness={effects.roughness || 0.4}
          />
        )}
        
        {/* Back face */}
        <meshStandardMaterial attach="material-5" map={cardBackTexture} />
      </mesh>
      
      {/* Particle effects */}
      {effects.particles && (
        <Sparkles
          count={25}
          scale={3}
          size={2}
          speed={0.2}
          color="gold"
          position={[0, 0, 0.1]}
        />
      )}
      
      {/* Glow effect */}
      {effects.glow && (
        <mesh position={[0, 0, -0.03]}>
          <boxGeometry args={[cardWidth + 0.1, cardHeight + 0.1, 0.01]} />
          <meshBasicMaterial 
            color={effects.glowColor || '#00ffff'}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
};
