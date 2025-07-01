
import * as THREE from 'three';
import { PSDLayer, LayerAnalysis } from './PSDProcessor';

export interface DepthMap {
  layers: Array<{
    layerId: string;
    depth: number;
    material: THREE.Material;
  }>;
  lighting: THREE.Light[];
  camera: THREE.Camera;
}

export interface MaterialProperties {
  roughness: number;
  metalness: number;
  opacity: number;
  transparent: boolean;
  normalMap?: THREE.Texture;
  bumpMap?: THREE.Texture;
}

export class ThreeDReconstructionSystem {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  }

  generateDepthMap(layers: PSDLayer[], analysis: LayerAnalysis[]): DepthMap {
    const depthLayers = layers.map((layer, index) => ({
      layerId: layer.id,
      depth: analysis[index].spatial.depth,
      material: this.layerToMaterial(layer)
    }));

    const lighting = this.createLightingSetup();
    
    return {
      layers: depthLayers,
      lighting,
      camera: this.camera
    };
  }

  layerToMaterial(layer: PSDLayer): THREE.Material {
    const materialProps = this.calculateMaterialProperties(layer);
    
    const material = new THREE.MeshPhysicalMaterial({
      roughness: materialProps.roughness,
      metalness: materialProps.metalness,
      opacity: materialProps.opacity,
      transparent: materialProps.transparent
    });

    // Add holographic effect if layer name suggests it
    if (layer.name.toLowerCase().includes('holo')) {
      this.addHolographicShader(material);
    }

    return material;
  }

  private calculateMaterialProperties(layer: PSDLayer): MaterialProperties {
    const name = layer.name.toLowerCase();
    
    let roughness = 0.5;
    let metalness = 0.0;
    
    if (name.includes('metal') || name.includes('chrome')) {
      metalness = 0.9;
      roughness = 0.1;
    } else if (name.includes('glossy') || name.includes('shine')) {
      roughness = 0.2;
    } else if (name.includes('matte') || name.includes('paper')) {
      roughness = 0.8;
    }

    return {
      roughness,
      metalness,
      opacity: layer.properties.opacity,
      transparent: layer.properties.opacity < 1
    };
  }

  private addHolographicShader(material: THREE.MeshPhysicalMaterial): void {
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        varying vec2 vUv;
        varying vec3 vPosition;
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vUv = uv;
        vPosition = position;
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        varying vec2 vUv;
        varying vec3 vPosition;
        
        vec3 rainbow(float t) {
          return vec3(
            sin(t * 6.28318 + 0.0) * 0.5 + 0.5,
            sin(t * 6.28318 + 2.094) * 0.5 + 0.5,
            sin(t * 6.28318 + 4.188) * 0.5 + 0.5
          );
        }
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        float hologram = sin(vUv.x * 20.0 + time) * 0.5 + 0.5;
        vec3 holoColor = rainbow(vUv.y + time * 0.1);
        diffuseColor.rgb = mix(diffuseColor.rgb, holoColor, hologram * 0.3);
        `
      );
    };
  }

  private createLightingSetup(): THREE.Light[] {
    const lights: THREE.Light[] = [];
    
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    lights.push(ambientLight);
    
    // Directional light for shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    lights.push(directionalLight);
    
    // Point light for highlights
    const pointLight = new THREE.PointLight(0xffffff, 0.3, 100);
    pointLight.position.set(0, 0, 10);
    lights.push(pointLight);
    
    return lights;
  }

  createCardPhysics(layers: PSDLayer[]): CardPhysicsSystem {
    return new CardPhysicsSystem(layers);
  }

  setupInteractiveLighting(scene: THREE.Scene): void {
    // Simple environment setup without RGBELoader
    scene.background = new THREE.Color(0x1a1a1a);
    
    // Add basic environment lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(hemisphereLight);
  }
}

export class CardPhysicsSystem {
  private layers: PhysicsLayer[];
  private constraints: Constraint[];

  constructor(psdLayers: PSDLayer[]) {
    this.layers = psdLayers.map(layer => ({
      id: layer.id,
      position: new THREE.Vector3(
        layer.properties.position.x / 100,
        -layer.properties.position.y / 100,
        layer.properties.zIndex * 0.1
      ),
      velocity: new THREE.Vector3(0, 0, 0),
      mass: this.calculateMass(layer),
      fixed: layer.name.toLowerCase().includes('background')
    }));
    
    this.constraints = [];
  }

  simulate(interaction: UserInteraction, deltaTime: number): void {
    const force = this.calculateForce(interaction);
    
    this.layers.forEach(layer => {
      if (!layer.fixed) {
        layer.velocity.add(force.clone().multiplyScalar(deltaTime / layer.mass));
        layer.position.add(layer.velocity.clone().multiplyScalar(deltaTime));
        
        // Apply damping
        layer.velocity.multiplyScalar(0.95);
      }
    });
    
    this.applyConstraints();
  }

  private calculateMass(layer: PSDLayer): number {
    const area = layer.properties.dimensions.width * layer.properties.dimensions.height;
    return Math.max(0.1, area / 10000); // Normalize mass based on layer size
  }

  private calculateForce(interaction: UserInteraction): THREE.Vector3 {
    const force = new THREE.Vector3();
    
    if (interaction.type === 'mouse') {
      force.set(
        (interaction.position.x - 0.5) * 0.1,
        (interaction.position.y - 0.5) * 0.1,
        0
      );
    } else if (interaction.type === 'gyroscope') {
      force.set(
        interaction.data.beta * 0.01,
        interaction.data.gamma * 0.01,
        0
      );
    }
    
    return force;
  }

  private applyConstraints(): void {
    this.constraints.forEach(constraint => {
      // Apply distance constraints between connected layers
      const layer1 = this.layers.find(l => l.id === constraint.layer1Id);
      const layer2 = this.layers.find(l => l.id === constraint.layer2Id);
      
      if (layer1 && layer2) {
        const distance = layer1.position.distanceTo(layer2.position);
        const targetDistance = constraint.targetDistance;
        
        if (distance > targetDistance) {
          const correction = layer1.position.clone().sub(layer2.position).normalize().multiplyScalar((distance - targetDistance) * 0.5);
          layer1.position.sub(correction);
          layer2.position.add(correction);
        }
      }
    });
  }
}

interface PhysicsLayer {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mass: number;
  fixed: boolean;
}

interface Constraint {
  layer1Id: string;
  layer2Id: string;
  targetDistance: number;
  strength: number;
}

export interface UserInteraction {
  type: 'mouse' | 'gyroscope' | 'touch';
  position: { x: number; y: number };
  data?: any;
}
