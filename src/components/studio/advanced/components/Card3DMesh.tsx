import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
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
  const [textureLoading, setTextureLoading] = useState(false);
  
  // Card dimensions (trading card standard: 2.5" x 3.5")
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardThickness = 0.05;
  
  // Enhanced debug logging
  const logTextureState = useCallback((context: string, url: string, error?: any) => {
    console.log(`🖼️ Card3DMesh - ${context}:`, {
      url: url ? `${url.substring(0, 50)}...` : 'None',
      isBlobUrl: url?.startsWith('blob:'),
      cardId: cardData.id,
      error: error?.message,
      timestamp: new Date().toISOString()
    });
  }, [cardData.id]);
  
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
  
  // Enhanced texture loading with comprehensive error handling
  const [frontTexture, setFrontTexture] = useState<THREE.Texture>(fallbackTexture);
  
  useEffect(() => {
    if (!imageUrl) {
      logTextureState('No image URL provided', '');
      setFrontTexture(fallbackTexture);
      setTextureError(false);
      setTextureLoading(false);
      return;
    }

    setTextureLoading(true);
    setTextureError(false);
    logTextureState('Starting texture load', imageUrl);

    const loader = new TextureLoader();
    
    // Enhanced blob URL validation
    if (imageUrl.startsWith('blob:')) {
      // Test blob URL validity first
      const testImg = new Image();
      const validationTimeout = setTimeout(() => {
        logTextureState('Blob validation timeout', imageUrl);
        setTextureError(true);
        setTextureLoading(false);
        setFrontTexture(fallbackTexture);
      }, 3000);
      
      testImg.onload = () => {
        clearTimeout(validationTimeout);
        logTextureState('Blob URL validated successfully', imageUrl);
        
        // Proceed with Three.js texture loading
        loader.load(
          imageUrl,
          (texture) => {
            logTextureState('Texture loaded successfully', imageUrl);
            configureTextureForCard(texture);
            setFrontTexture(texture);
            setTextureError(false);
            setTextureLoading(false);
          },
          (progress) => {
            console.log('📊 Texture loading progress:', progress);
          },
          (error) => {
            logTextureState('Texture loading failed', imageUrl, error);
            setTextureError(true);
            setTextureLoading(false);
            setFrontTexture(fallbackTexture);
          }
        );
      };
      
      testImg.onerror = (error) => {
        clearTimeout(validationTimeout);
        logTextureState('Blob URL validation failed', imageUrl, error);
        setTextureError(true);
        setTextureLoading(false);
        setFrontTexture(fallbackTexture);
      };
      
      testImg.src = imageUrl;
    } else {
      // Regular URL loading with enhanced error handling
      loader.load(
        imageUrl,
        (texture) => {
          logTextureState('Regular texture loaded successfully', imageUrl);
          configureTextureForCard(texture);
          setFrontTexture(texture);
          setTextureError(false);
          setTextureLoading(false);
        },
        (progress) => {
          console.log('📊 Texture loading progress:', progress);
        },
        (error) => {
          logTextureState('Regular texture loading failed', imageUrl, error);
          setTextureError(true);
          setTextureLoading(false);
          setFrontTexture(fallbackTexture);
        }
      );
    }
  }, [imageUrl, fallbackTexture, logTextureState]);
  
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
  
  // Animation with error resilience
  useFrame((state) => {
    try {
      if (meshRef.current) {
        // Gentle floating animation
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
        
        // Auto-rotate when not hovered
        if (!hovered) {
          meshRef.current.rotation.y += 0.002;
        }
      }
    } catch (error) {
      console.warn('🚨 Card3DMesh animation error:', error);
    }
  });
  
  // Log current state for debugging
  useEffect(() => {
    console.log('🎯 Card3DMesh state update:', {
      hasImageUrl: !!imageUrl,
      textureLoading,
      textureError,
      isUsingFallback: frontTexture === fallbackTexture,
      cardTitle: cardData.title
    });
  }, [imageUrl, textureLoading, textureError, frontTexture, fallbackTexture, cardData.title]);
  
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
            transparent={false}
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
      
      {/* Loading indicator overlay */}
      {textureLoading && (
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[cardWidth * 0.8, cardHeight * 0.8]} />
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  );
};
