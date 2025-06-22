
import * as THREE from 'three';

export const MetallicShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewDirection;
    varying vec3 vReflect;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vViewDirection = normalize(cameraPosition - worldPosition.xyz);
      vReflect = reflect(-vViewDirection, vNormal);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  fragmentShader: `
    uniform float uTime;
    uniform float uMetalness;
    uniform float uRoughness;
    uniform sampler2D uTexture;
    uniform samplerCube uEnvMap;
    uniform vec3 uTint;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewDirection;
    varying vec3 vReflect;
    
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Environment reflection
      vec3 envColor = textureCube(uEnvMap, vReflect).rgb;
      
      // Fresnel for metallic reflection
      float fresnel = 1.0 - max(0.0, dot(vViewDirection, vNormal));
      fresnel = pow(fresnel, 1.0 - uRoughness);
      
      // Metallic shimmer pattern
      float shimmer = sin(vUv.x * 20.0 + uTime * 2.0) * sin(vUv.y * 15.0 + uTime * 1.5);
      shimmer = shimmer * 0.2 + 0.8;
      
      // Combine base texture with metallic reflection
      vec3 metallicColor = mix(texColor.rgb, envColor * uTint * shimmer, uMetalness * fresnel);
      
      gl_FragColor = vec4(metallicColor, texColor.a);
    }
  `,
  
  uniforms: {
    uTime: { value: 0.0 },
    uMetalness: { value: 0.8 },
    uRoughness: { value: 0.2 },
    uTexture: { value: null },
    uEnvMap: { value: null },
    uTint: { value: new THREE.Vector3(1.0, 0.8, 0.6) }
  }
};
