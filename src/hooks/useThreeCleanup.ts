
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { errorLogger } from '@/utils/errorLogger';

interface ThreeJSResources {
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
  textures: THREE.Texture[];
  meshes: THREE.Mesh[];
  scenes: THREE.Scene[];
  renderers: THREE.WebGLRenderer[];
  animationFrames: number[];
  eventListeners: Array<{
    element: EventTarget;
    event: string;
    handler: EventListener;
  }>;
}

export const useThreeCleanup = () => {
  const resourcesRef = useRef<ThreeJSResources>({
    geometries: [],
    materials: [],
    textures: [],
    meshes: [],
    scenes: [],
    renderers: [],
    animationFrames: [],
    eventListeners: []
  });

  const addGeometry = (geometry: THREE.BufferGeometry) => {
    resourcesRef.current.geometries.push(geometry);
  };

  const addMaterial = (material: THREE.Material) => {
    resourcesRef.current.materials.push(material);
  };

  const addTexture = (texture: THREE.Texture) => {
    resourcesRef.current.textures.push(texture);
  };

  const addMesh = (mesh: THREE.Mesh) => {
    resourcesRef.current.meshes.push(mesh);
  };

  const addScene = (scene: THREE.Scene) => {
    resourcesRef.current.scenes.push(scene);
  };

  const addRenderer = (renderer: THREE.WebGLRenderer) => {
    resourcesRef.current.renderers.push(renderer);
  };

  const addAnimationFrame = (frameId: number) => {
    resourcesRef.current.animationFrames.push(frameId);
  };

  const addEventListener = (element: EventTarget, event: string, handler: EventListener) => {
    element.addEventListener(event, handler);
    resourcesRef.current.eventListeners.push({ element, event, handler });
  };

  const cleanup = () => {
    try {
      const resources = resourcesRef.current;

      // Cancel animation frames
      resources.animationFrames.forEach(frameId => {
        cancelAnimationFrame(frameId);
      });

      // Remove event listeners
      resources.eventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });

      // Dispose geometries
      resources.geometries.forEach(geometry => {
        geometry.dispose();
      });

      // Dispose materials
      resources.materials.forEach(material => {
        if (material instanceof THREE.Material) {
          material.dispose();
        }
      });

      // Dispose textures
      resources.textures.forEach(texture => {
        texture.dispose();
      });

      // Clean up meshes
      resources.meshes.forEach(mesh => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => mat.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });

      // Clean up scenes
      resources.scenes.forEach(scene => {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
        scene.clear();
      });

      // Dispose renderers
      resources.renderers.forEach(renderer => {
        renderer.dispose();
        renderer.forceContextLoss();
      });

      // Clear arrays
      resources.geometries.length = 0;
      resources.materials.length = 0;
      resources.textures.length = 0;
      resources.meshes.length = 0;
      resources.scenes.length = 0;
      resources.renderers.length = 0;
      resources.animationFrames.length = 0;
      resources.eventListeners.length = 0;

    } catch (error) {
      errorLogger.logError('ThreeCleanup', error as Error, { 
        operation: 'cleanup',
        resourceCounts: {
          geometries: resourcesRef.current.geometries.length,
          materials: resourcesRef.current.materials.length,
          textures: resourcesRef.current.textures.length
        }
      });
    }
  };

  useEffect(() => {
    return cleanup;
  }, []);

  return {
    addGeometry,
    addMaterial,
    addTexture,
    addMesh,
    addScene,
    addRenderer,
    addAnimationFrame,
    addEventListener,
    cleanup
  };
};
