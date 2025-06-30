
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnhancedHolographicMaterialProps {
  texture?: THREE.Texture;
  intensity?: number;
  colorShift?: number;
  animated?: boolean;
}

export const EnhancedHolographicMaterial: React.FC<EnhancedHolographicMaterialProps> = ({
  texture,
  intensity = 1.0,
  colorShift = 0.5,
  animated = true
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHolographicIntensity: { value: intensity },
    uColorShift: { value: colorShift },
    uTexture: { value: texture },
    uFresnelPower: { value: 2.0 },
    uRainbowSpeed: { value: 1.0 },
    uShimmerScale: { value: 10.0 }
  }), [texture, intensity, colorShift]);

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewDirection;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vViewDirection = normalize(cameraPosition - worldPosition.xyz);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uHolographicIntensity;
    uniform float uColorShift;
    uniform sampler2D uTexture;
    uniform float uFresnelPower;
    uniform float uRainbowSpeed;
    uniform float uShimmerScale;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewDirection;
    
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
      vec4 baseColor = texture2D(uTexture, vUv);
      
      // Fresnel effect
      float fresnel = pow(1.0 - max(dot(vNormal, vViewDirection), 0.0), uFresnelPower);
      
      // Rainbow holographic effect
      float hue = vUv.x + vUv.y + uTime * uRainbowSpeed + uColorShift;
      vec3 rainbow = hsv2rgb(vec3(fract(hue), 0.8, 1.0));
      
      // Shimmer effect
      float shimmer = sin(vUv.x * uShimmerScale + uTime * 2.0) * 
                     sin(vUv.y * uShimmerScale + uTime * 1.5) * 0.5 + 0.5;
      
      // Combine effects
      vec3 holographicColor = rainbow * fresnel * shimmer;
      vec3 finalColor = mix(baseColor.rgb, holographicColor, uHolographicIntensity * fresnel);
      
      gl_FragColor = vec4(finalColor, baseColor.a);
    }
  `;

  useFrame((state) => {
    if (materialRef.current && animated) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent
      attach="material"
    />
  );
};
