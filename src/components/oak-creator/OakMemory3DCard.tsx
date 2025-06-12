
import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Text, Box, RoundedBox } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import { OakTemplate } from '@/types/oakTemplates';

interface OakMemory3DCardProps {
  template: OakTemplate;
  rotation?: Vector3;
  finish?: 'matte' | 'glossy' | 'foil';
  scale?: number;
}

export const OakMemory3DCard: React.FC<OakMemory3DCardProps> = ({
  template,
  rotation = new Vector3(0, 0, 0),
  finish = 'glossy',
  scale = 1
}) => {
  const meshRef = useRef<Mesh>(null);
  const backMeshRef = useRef<Mesh>(null);
  const [textureError, setTextureError] = useState(false);

  // Validate template data
  if (!template || typeof template !== 'object' || !template.thumbnail) {
    console.warn('Invalid template data provided to OakMemory3DCard:', template);
    return null;
  }

  // Safe template data with local fallback
  const safeTemplate = {
    thumbnail: template.thumbnail || '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
    name: template.name || 'Oakland A\'s Card',
    id: template.id || 'default'
  };

  console.log('OakMemory3DCard rendering with template:', safeTemplate.name);

  // Validate and sanitize props
  const safeRotation = useMemo(() => {
    if (rotation instanceof Vector3) {
      return rotation;
    }
    return new Vector3(0, 0, 0);
  }, [rotation]);

  const safeScale = useMemo(() => {
    const scaleValue = typeof scale === 'number' && !isNaN(scale) && scale > 0 ? scale : 1;
    return Math.max(0.1, Math.min(5, scaleValue));
  }, [scale]);

  const safeFinish = useMemo(() => {
    return ['matte', 'glossy', 'foil'].includes(finish) ? finish : 'glossy';
  }, [finish]);

  // Load template texture with comprehensive error handling
  let frontTexture;
  try {
    // First try the template thumbnail
    frontTexture = useLoader(TextureLoader, safeTemplate.thumbnail, undefined, (error) => {
      console.warn('Failed to load template texture:', safeTemplate.thumbnail, error);
      setTextureError(true);
    });
  } catch (error) {
    console.warn('TextureLoader error for template:', error);
    // Use local fallback
    try {
      frontTexture = useLoader(TextureLoader, '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png');
    } catch (fallbackError) {
      console.error('Failed to load fallback texture:', fallbackError);
      return null;
    }
  }

  // Oakland A's card back design - create texture programmatically to avoid loading issues
  const oaklandAsBrandingTexture = useMemo(() => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Cannot get canvas context');
      }

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 720);
      gradient.addColorStop(0, '#0f4c3a');
      gradient.addColorStop(1, '#1a5c47');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 720);

      // Oakland A's logo area
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(256, 200, 80, 0, Math.PI * 2);
      ctx.fill();

      // "A" letter
      ctx.fillStyle = '#0f4c3a';
      ctx.font = 'bold 120px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('A', 256, 240);

      // "Oakland Athletics" text
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('OAKLAND', 256, 350);
      ctx.font = 'bold 20px Arial';
      ctx.fillText('ATHLETICS', 256, 380);

      // Memory text
      ctx.font = '16px Arial';
      ctx.fillText('MEMORY CARD', 256, 450);

      // Pattern border
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 472, 680);

      const texture = new TextureLoader().load(canvas.toDataURL());
      console.log('Created Oakland A\'s branding texture successfully');
      return texture;
    } catch (error) {
      console.warn('Failed to create Oakland A\'s branding texture:', error);
      // Return basic colored texture as last resort
      return null;
    }
  }, []);

  // Material properties based on finish
  const materialProps = useMemo(() => {
    switch (safeFinish) {
      case 'matte':
        return {
          roughness: 0.8,
          metalness: 0.1,
          reflectivity: 0.2
        };
      case 'glossy':
        return {
          roughness: 0.1,
          metalness: 0.2,
          reflectivity: 0.8
        };
      case 'foil':
        return {
          roughness: 0.05,
          metalness: 0.9,
          reflectivity: 1.0,
          envMapIntensity: 1.5
        };
      default:
        return {
          roughness: 0.1,
          metalness: 0.2,
          reflectivity: 0.8
        };
    }
  }, [safeFinish]);

  // Gentle animation with error handling
  useFrame((state) => {
    try {
      if (meshRef.current && backMeshRef.current) {
        const time = state.clock.getElapsedTime();
        
        // Gentle floating animation
        meshRef.current.position.y = Math.sin(time * 0.5) * 0.02;
        backMeshRef.current.position.y = meshRef.current.position.y;
        
        // Apply rotation if provided
        if (safeRotation) {
          meshRef.current.rotation.x = safeRotation.x + Math.sin(time * 0.3) * 0.02;
          meshRef.current.rotation.y = safeRotation.y + Math.sin(time * 0.2) * 0.01;
          meshRef.current.rotation.z = safeRotation.z;
          
          backMeshRef.current.rotation.x = meshRef.current.rotation.x;
          backMeshRef.current.rotation.y = meshRef.current.rotation.y + Math.PI;
          backMeshRef.current.rotation.z = meshRef.current.rotation.z;
        }
      }
    } catch (error) {
      console.warn('Error in animation frame:', error);
    }
  });

  try {
    return (
      <group scale={safeScale}>
        {/* Front of card */}
        <RoundedBox
          ref={meshRef}
          args={[2.5, 3.5, 0.05]}
          radius={0.1}
          smoothness={4}
          castShadow
          receiveShadow
          position={[0, 0, 0.025]}
        >
          <meshPhysicalMaterial
            map={frontTexture}
            {...materialProps}
            transparent={false}
          />
        </RoundedBox>

        {/* Back of card */}
        <RoundedBox
          ref={backMeshRef}
          args={[2.5, 3.5, 0.05]}
          radius={0.1}
          smoothness={4}
          castShadow
          receiveShadow
          position={[0, 0, -0.025]}
          rotation={[0, Math.PI, 0]}
        >
          <meshPhysicalMaterial
            map={oaklandAsBrandingTexture}
            color={oaklandAsBrandingTexture ? undefined : '#0f4c3a'}
            {...materialProps}
            transparent={false}
          />
        </RoundedBox>

        {/* Card edge (thickness) */}
        <Box args={[2.5, 3.5, 0.05]} position={[0, 0, 0]}>
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.8}
            metalness={0.1}
          />
        </Box>

        {/* Holographic effect for foil finish */}
        {safeFinish === 'foil' && (
          <RoundedBox
            args={[2.52, 3.52, 0.001]}
            radius={0.1}
            smoothness={4}
            position={[0, 0, 0.051]}
          >
            <meshPhysicalMaterial
              color="#ffd700"
              transparent
              opacity={0.3}
              roughness={0}
              metalness={1}
              envMapIntensity={2}
            />
          </RoundedBox>
        )}
      </group>
    );
  } catch (error) {
    console.error('Error rendering OakMemory3DCard:', error);
    return null;
  }
};
