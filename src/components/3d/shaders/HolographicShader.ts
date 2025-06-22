
import * as THREE from 'three';

export const HolographicShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewDirection;
    
    uniform float uTime;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vViewDirection = normalize(cameraPosition - worldPosition.xyz);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  fragmentShader: `
    uniform float uTime;
    uniform float uIntensity;
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    
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
      
      // Fresnel effect
      float fresnel = 1.0 - max(0.0, dot(vViewDirection, vNormal));
      fresnel = pow(fresnel, 2.0);
      
      // Interference pattern
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float rainbow = sin(angle * 8.0 + uTime * 3.0) * 0.5 + 0.5;
      
      // Color shifting based on viewing angle
      vec3 rainbowColor = hsv2rgb(vec3(rainbow + fresnel * 0.3, 0.8, 1.0));
      
      // Interference stripes
      float stripes = sin((vUv.x + vUv.y) * 50.0 + uTime * 2.0) * 0.1 + 0.9;
      
      vec3 finalColor = mix(texColor.rgb, rainbowColor * stripes, uIntensity * fresnel);
      
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `,
  
  uniforms: {
    uTime: { value: 0.0 },
    uIntensity: { value: 1.0 },
    uTexture: { value: null },
    uColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) }
  }
};
