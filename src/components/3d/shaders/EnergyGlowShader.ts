
import * as THREE from 'three';

export const EnergyGlowShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  fragmentShader: `
    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uGlowColor;
    uniform sampler2D uTexture;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Pulsating energy effect
      float pulse = sin(uTime * 4.0) * 0.3 + 0.7;
      
      // Distance from center for radial glow
      float centerDist = distance(vUv, vec2(0.5));
      float radialGlow = 1.0 - smoothstep(0.0, 0.7, centerDist);
      
      // Energy waves
      float waves = sin(centerDist * 20.0 - uTime * 8.0) * 0.5 + 0.5;
      waves *= radialGlow;
      
      // Combine effects
      vec3 energyEffect = uGlowColor * waves * pulse * uIntensity;
      vec3 finalColor = texColor.rgb + energyEffect;
      
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `,
  
  uniforms: {
    uTime: { value: 0.0 },
    uIntensity: { value: 0.5 },
    uGlowColor: { value: new THREE.Vector3(0.0, 1.0, 1.0) },
    uTexture: { value: null }
  }
};
