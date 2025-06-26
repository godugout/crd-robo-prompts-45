
import * as THREE from 'three';
import type { HolographicShaderUniforms } from '@/types/three';

export const createHolographicShader = (): {
  uniforms: HolographicShaderUniforms;
  vertexShader: string;
  fragmentShader: string;
} => {
  const uniforms: HolographicShaderUniforms = {
    time: { value: 0 },
    intensity: { value: 1.0 },
    colorShift: { value: 0.5 },
    baseTexture: { value: null }
  };

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform float intensity;
    uniform float colorShift;
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
      float hue = (angle + time * 0.5 + colorShift) / (2.0 * 3.14159);
      vec3 rainbow = hsv2rgb(vec3(hue, 0.8, 1.0));
      
      // Fresnel effect
      float fresnel = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
      
      vec3 finalColor = mix(baseColor.rgb, rainbow, intensity * fresnel);
      
      gl_FragColor = vec4(finalColor, baseColor.a);
    }
  `;

  return { uniforms, vertexShader, fragmentShader };
};

// Export as HolographicShader for compatibility
export const HolographicShader = createHolographicShader();
