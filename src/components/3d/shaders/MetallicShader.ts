
import * as THREE from 'three';
import type { MetallicShaderUniforms } from '@/types/three';

export const createMetallicShader = (): {
  uniforms: MetallicShaderUniforms;
  vertexShader: string;
  fragmentShader: string;
} => {
  const uniforms: MetallicShaderUniforms = {
    time: { value: 0 },
    metalness: { value: 0.8 },
    roughness: { value: 0.2 },
    envMap: { value: null }
  };

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vReflect;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      
      vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
      vNormal = worldNormal;
      
      vec3 cameraToVertex = normalize(worldPosition.xyz - cameraPosition);
      vReflect = reflect(cameraToVertex, worldNormal);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform float metalness;
    uniform float roughness;
    uniform samplerCube envMap;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vReflect;
    varying vec3 vWorldPosition;
    
    void main() {
      vec3 baseColor = vec3(0.8, 0.85, 0.9); // Metallic base color
      
      // Environment reflection
      vec3 envColor = textureCube(envMap, vReflect).rgb;
      
      // Simple metallic reflection
      float fresnelFactor = pow(1.0 - max(dot(vNormal, normalize(cameraPosition - vWorldPosition)), 0.0), 2.0);
      
      vec3 finalColor = mix(baseColor, envColor, metalness * fresnelFactor);
      
      // Add some shine variation
      float shine = sin(time + vUv.x * 10.0 + vUv.y * 10.0) * 0.1 + 0.9;
      finalColor *= shine;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return { uniforms, vertexShader, fragmentShader };
};

// Export as MetallicShader for compatibility
export const MetallicShader = createMetallicShader();
