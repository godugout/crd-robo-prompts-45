
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HolographicMaterialProps {
  intensity: number;
  children: React.ReactNode;
}

const holographicVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const holographicFragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform sampler2D baseTexture;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  void main() {
    vec4 baseColor = texture2D(baseTexture, vUv);
    
    // Create holographic effect
    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
    float radius = length(vUv - 0.5);
    
    // Rainbow shift based on viewing angle and time
    float hue = angle / (2.0 * 3.14159) + time * 0.1 + radius * 2.0;
    hue = fract(hue);
    
    vec3 rainbow = hsv2rgb(vec3(hue, 0.8, 1.0));
    
    // Fresnel effect for edge highlighting
    float fresnel = pow(1.0 - dot(normalize(vNormal), normalize(-vPosition)), 2.0);
    
    // Combine base texture with holographic effect
    vec3 finalColor = mix(baseColor.rgb, rainbow, intensity * 0.3 * fresnel);
    finalColor += rainbow * intensity * 0.2 * fresnel;
    
    gl_FragColor = vec4(finalColor, baseColor.a);
  }
`;

export const HolographicMaterial: React.FC<HolographicMaterialProps> = ({ intensity, children }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    intensity: { value: intensity / 100 },
    baseTexture: { value: new THREE.Texture() }
  }), [intensity]);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.intensity.value = intensity / 100;
    }
  });
  
  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={holographicVertexShader}
      fragmentShader={holographicFragmentShader}
      uniforms={uniforms}
      transparent
    />
  );
};
