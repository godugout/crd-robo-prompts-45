import React, { useMemo, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PerformanceOptimizedEffectsProps {
  effectValues: Record<string, any>;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  deviceCapabilities: {
    supportsWebGL2: boolean;
    maxTextureSize: number;
    fragmentShaderPrecision: 'lowp' | 'mediump' | 'highp';
  };
}

export const PerformanceOptimizedEffects: React.FC<PerformanceOptimizedEffectsProps> = ({
  effectValues,
  quality,
  deviceCapabilities
}) => {
  const frameRef = useRef(0);
  const lastUpdateRef = useRef(0);
  
  // Adaptive quality based on device capabilities
  const adaptiveQuality = useMemo(() => {
    if (!deviceCapabilities.supportsWebGL2) return 'low';
    if (deviceCapabilities.maxTextureSize < 2048) return 'medium';
    if (deviceCapabilities.fragmentShaderPrecision === 'lowp') return 'medium';
    return quality;
  }, [quality, deviceCapabilities]);
  
  // LOD (Level of Detail) system for effects
  const effectLOD = useMemo(() => {
    const baseIntensity = Math.max(
      effectValues?.holographic?.intensity || 0,
      effectValues?.metallic?.intensity || 0,
      effectValues?.galaxy?.intensity || 0
    );
    
    if (baseIntensity === 0) return 'none';
    if (adaptiveQuality === 'low') return 'minimal';
    if (adaptiveQuality === 'medium') return 'standard';
    if (adaptiveQuality === 'high') return 'enhanced';
    return 'premium';
  }, [effectValues, adaptiveQuality]);
  
  // Texture atlas for efficient material management
  const textureAtlas = useMemo(() => {
    if (effectLOD === 'none' || effectLOD === 'minimal') return null;
    
    const size = adaptiveQuality === 'ultra' ? 1024 : 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Quadrant 1: Holographic interference patterns
      ctx.save();
      ctx.translate(0, 0);
      ctx.scale(0.5, 0.5);
      
      const gradient1 = ctx.createLinearGradient(0, 0, size, size);
      for (let i = 0; i <= 10; i++) {
        const hue = (i * 36) % 360;
        gradient1.addColorStop(i / 10, `hsl(${hue}, 80%, 60%)`);
      }
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, size, size);
      ctx.restore();
      
      // Quadrant 2: Metallic textures
      ctx.save();
      ctx.translate(size / 2, 0);
      ctx.scale(0.5, 0.5);
      
      const metallicGradient = ctx.createLinearGradient(0, 0, size, 0);
      metallicGradient.addColorStop(0, '#8C9197');
      metallicGradient.addColorStop(0.5, '#C5C9CF');
      metallicGradient.addColorStop(1, '#DADEE4');
      ctx.fillStyle = metallicGradient;
      ctx.fillRect(0, 0, size, size);
      
      // Add brush texture
      for (let i = 0; i < size; i += 4) {
        ctx.fillStyle = `rgba(160, 164, 170, ${0.3 + Math.random() * 0.2})`;
        ctx.fillRect(i, 0, 1, size);
      }
      ctx.restore();
      
      // Quadrant 3: Galaxy patterns
      ctx.save();
      ctx.translate(0, size / 2);
      ctx.scale(0.5, 0.5);
      
      const galaxyGradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
      galaxyGradient.addColorStop(0, '#1a0033');
      galaxyGradient.addColorStop(0.5, '#4a0099');
      galaxyGradient.addColorStop(1, '#b366ff');
      ctx.fillStyle = galaxyGradient;
      ctx.fillRect(0, 0, size, size);
      ctx.restore();
      
      // Quadrant 4: Normal map data
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.scale(0.5, 0.5);
      
      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;
      
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          const nx = Math.sin(x * 0.1) * 0.1 + 0.5;
          const ny = Math.cos(y * 0.1) * 0.1 + 0.5;
          const nz = 0.8;
          
          data[i] = nx * 255;
          data[i + 1] = ny * 255;
          data[i + 2] = nz * 255;
          data[i + 3] = 255;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      ctx.restore();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = adaptiveQuality === 'ultra';
    texture.minFilter = adaptiveQuality === 'ultra' ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }, [effectLOD, adaptiveQuality]);
  
  // Frame rate adaptive updates
  const shouldUpdate = useCallback(() => {
    frameRef.current++;
    const now = Date.now();
    
    // Update frequency based on quality
    const updateInterval = {
      'minimal': 100,    // 10 FPS
      'standard': 33,    // 30 FPS
      'enhanced': 16,    // 60 FPS
      'premium': 8       // 120 FPS
    }[effectLOD] || 16;
    
    if (now - lastUpdateRef.current > updateInterval) {
      lastUpdateRef.current = now;
      return true;
    }
    
    return false;
  }, [effectLOD]);
  
  // Optimized shader variants
  const optimizedShaders = useMemo(() => {
    const shaders: Record<string, any> = {};
    
    // Minimal quality shader (mobile friendly)
    if (effectLOD === 'minimal') {
      shaders.simple = {
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform float uIntensity;
          varying vec2 vUv;
          
          void main() {
            vec4 texColor = texture2D(uTexture, vUv);
            gl_FragColor = mix(texColor, vec4(1.0), uIntensity * 0.3);
          }
        `,
        uniforms: {
          uTexture: { value: null },
          uIntensity: { value: 1.0 }
        }
      };
    }
    
    // Standard quality shader
    else if (effectLOD === 'standard') {
      shaders.standard = {
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform sampler2D uAtlas;
          uniform float uIntensity;
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vNormal;
          
          void main() {
            vec4 texColor = texture2D(uTexture, vUv);
            vec4 effectColor = texture2D(uAtlas, vUv + sin(uTime) * 0.01);
            
            float fresnel = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
            vec3 finalColor = mix(texColor.rgb, effectColor.rgb, uIntensity * fresnel);
            
            gl_FragColor = vec4(finalColor, texColor.a);
          }
        `,
        uniforms: {
          uTexture: { value: null },
          uAtlas: { value: textureAtlas },
          uIntensity: { value: 1.0 },
          uTime: { value: 0.0 }
        }
      };
    }
    
    return shaders;
  }, [effectLOD, textureAtlas]);
  
  // Performance monitoring
  const performanceMonitor = useRef({
    frameTime: 0,
    effectRenderTime: 0,
    lastFrameStart: 0
  });
  
  useFrame(() => {
    if (!shouldUpdate()) return;
    
    const frameStart = performance.now();
    
    // Update shader uniforms if needed
    Object.values(optimizedShaders).forEach((shader: any) => {
      if (shader.uniforms?.uTime) {
        shader.uniforms.uTime.value = frameStart * 0.001;
      }
    });
    
    // Performance tracking
    const frameEnd = performance.now();
    performanceMonitor.current.frameTime = frameEnd - frameStart;
    
    // Auto-adjust quality if performance drops
    if (performanceMonitor.current.frameTime > 16 && adaptiveQuality !== 'low') {
      console.warn('Performance drop detected, consider reducing quality');
    }
  });
  
  // Memory cleanup
  React.useEffect(() => {
    return () => {
      if (textureAtlas) {
        textureAtlas.dispose();
      }
    };
  }, [textureAtlas]);
  
  return (
    <group>
      {/* Render effects based on LOD */}
      {effectLOD !== 'none' && optimizedShaders.simple && (
        <mesh>
          <planeGeometry args={[2, 2]} />
          <shaderMaterial
            vertexShader={optimizedShaders.simple.vertexShader}
            fragmentShader={optimizedShaders.simple.fragmentShader}
            uniforms={optimizedShaders.simple.uniforms}
            transparent
          />
        </mesh>
      )}
      
      {effectLOD === 'standard' && optimizedShaders.standard && (
        <mesh>
          <planeGeometry args={[2, 2]} />
          <shaderMaterial
            vertexShader={optimizedShaders.standard.vertexShader}
            fragmentShader={optimizedShaders.standard.fragmentShader}
            uniforms={optimizedShaders.standard.uniforms}
            transparent
          />
        </mesh>
      )}
    </group>
  );
};