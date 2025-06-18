import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnhancedHolographicMaterialProps {
  texture: THREE.Texture | null;
  effects: {
    holographic?: boolean;
    metalness?: number;
    roughness?: number;
    chrome?: boolean;
    crystal?: boolean;
    vintage?: boolean;
  };
}

export const EnhancedHolographicMaterial: React.FC<EnhancedHolographicMaterialProps> = ({
  texture,
  effects
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

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
    uniform float uMetalness;
    uniform float uRoughness;
    uniform bool uChrome;
    uniform bool uCrystal;
    uniform bool uVintage;
    uniform sampler2D uTexture;
    
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
      vec4 texColor = texture2D(uTexture, vUv);
      vec3 finalColor = texColor.rgb;
      
      // Fresnel effect for all materials
      float fresnel = 1.0 - max(0.0, dot(vViewDirection, vNormal));
      fresnel = pow(fresnel, 2.0);
      
      // Holographic effect
      if (uHolographicIntensity > 0.0) {
        float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
        float rainbow = sin(angle * 6.0 + uTime * 2.0) * 0.5 + 0.5;
        vec3 rainbowColor = hsv2rgb(vec3(rainbow, 0.8, 1.0));
        finalColor = mix(finalColor, finalColor + rainbowColor * 0.7, uHolographicIntensity * fresnel);
      }
      
      // Chrome effect
      if (uChrome) {
        vec3 reflection = reflect(-vViewDirection, vNormal);
        float chromeEffect = dot(reflection, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5;
        finalColor = mix(finalColor, vec3(0.8, 0.9, 1.0) * chromeEffect, 0.6);
      }
      
      // Crystal effect
      if (uCrystal) {
        float crystalPattern = sin(vUv.x * 20.0) * sin(vUv.y * 20.0) * 0.1 + 0.9;
        finalColor *= crystalPattern;
        finalColor += vec3(1.0) * fresnel * 0.3;
      }
      
      // Vintage effect
      if (uVintage) {
        finalColor = mix(finalColor, vec3(dot(finalColor, vec3(0.299, 0.587, 0.114))), 0.6);
        finalColor *= vec3(1.1, 0.9, 0.7); // Sepia tint
      }
      
      // Metallic shimmer
      if (uMetalness > 0.0) {
        float shimmer = sin(vUv.x * 30.0 + uTime * 3.0) * sin(vUv.y * 30.0 + uTime * 2.0) * 0.05 + 0.95;
        finalColor *= mix(1.0, shimmer, uMetalness);
      }
      
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHolographicIntensity: { value: effects.holographic ? 0.5 : 0.0 },
    uMetalness: { value: effects.metalness || 0.0 },
    uRoughness: { value: effects.roughness || 0.5 },
    uChrome: { value: effects.chrome || false },
    uCrystal: { value: effects.crystal || false },
    uVintage: { value: effects.vintage || false },
    uTexture: { value: texture }
  }), [texture, effects]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uHolographicIntensity.value = effects.holographic ? 0.5 : 0.0;
      materialRef.current.uniforms.uMetalness.value = effects.metalness || 0.0;
      materialRef.current.uniforms.uChrome.value = effects.chrome || false;
      materialRef.current.uniforms.uCrystal.value = effects.crystal || false;
      materialRef.current.uniforms.uVintage.value = effects.vintage || false;
    }
  });

  useEffect(() => {
    if (materialRef.current && texture) {
      materialRef.current.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent={true}
      attach="material-4"
    />
  );
};
