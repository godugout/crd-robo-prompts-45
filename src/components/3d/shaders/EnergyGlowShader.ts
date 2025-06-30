
import * as THREE from 'three';

export const createEnergyGlowShader = () => {
  const uniforms = {
    uTime: { value: 0 },
    uTexture: { value: null },
    uGlowColor: { value: new THREE.Color('#00ffff') },
    uGlowIntensity: { value: 1.0 }
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
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform vec3 uGlowColor;
    uniform float uGlowIntensity;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vec4 baseColor = texture2D(uTexture, vUv);
      
      // Energy glow effect
      float glow = sin(vUv.x * 10.0 + uTime * 2.0) * sin(vUv.y * 10.0 + uTime * 1.5) * 0.5 + 0.5;
      vec3 energy = uGlowColor * glow * uGlowIntensity;
      
      vec3 finalColor = baseColor.rgb + energy * 0.3;
      
      gl_FragColor = vec4(finalColor, baseColor.a);
    }
  `;

  return { uniforms, vertexShader, fragmentShader };
};

// Export as EnergyGlowShader for compatibility
export const EnergyGlowShader = createEnergyGlowShader();
