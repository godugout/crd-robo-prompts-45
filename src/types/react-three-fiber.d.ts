
import { Object3D, Material, Geometry, BufferGeometry } from 'three';
import { ReactThreeFiber } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshPhysicalMaterial: ReactThreeFiber.Object3DNode<THREE.MeshPhysicalMaterial, typeof THREE.MeshPhysicalMaterial> & {
        map?: THREE.Texture;
        normalMap?: THREE.Texture;
        roughnessMap?: THREE.Texture;
        metallicMap?: THREE.Texture;
        emissiveMap?: THREE.Texture;
        roughness?: number;
        metalness?: number;
        reflectivity?: number;
        envMapIntensity?: number;
        transparent?: boolean;
        opacity?: number;
        color?: THREE.Color | string;
        emissive?: THREE.Color | string;
        emissiveIntensity?: number;
        clearcoat?: number;
        clearcoatRoughness?: number;
        transmission?: number;
        thickness?: number;
        ior?: number;
        side?: THREE.Side;
        attach?: string;
      };
      meshStandardMaterial: ReactThreeFiber.Object3DNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial> & {
        map?: THREE.Texture;
        normalMap?: THREE.Texture;
        roughnessMap?: THREE.Texture;
        metallicMap?: THREE.Texture;
        emissiveMap?: THREE.Texture;
        roughness?: number;
        metalness?: number;
        reflectivity?: number;
        envMapIntensity?: number;
        transparent?: boolean;
        opacity?: number;
        color?: THREE.Color | string;
        emissive?: THREE.Color | string;
        emissiveIntensity?: number;
        side?: THREE.Side;
        attach?: string;
      };
      meshBasicMaterial: ReactThreeFiber.Object3DNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial> & {
        map?: THREE.Texture;
        transparent?: boolean;
        opacity?: number;
        color?: THREE.Color | string;
        side?: THREE.Side;
        attach?: string;
      };
      shaderMaterial: ReactThreeFiber.Object3DNode<THREE.ShaderMaterial, typeof THREE.ShaderMaterial> & {
        vertexShader?: string;
        fragmentShader?: string;
        uniforms?: { [uniform: string]: THREE.IUniform };
        transparent?: boolean;
        opacity?: number;
        side?: THREE.Side;
        attach?: string;
        ref?: React.Ref<THREE.ShaderMaterial>;
      };
      roundedBoxGeometry: ReactThreeFiber.Object3DNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
      boxGeometry: ReactThreeFiber.Object3DNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
      planeGeometry: ReactThreeFiber.Object3DNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
      sphereGeometry: ReactThreeFiber.Object3DNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
      cylinderGeometry: ReactThreeFiber.Object3DNode<THREE.CylinderGeometry, typeof THREE.CylinderGeometry>;
      torusGeometry: ReactThreeFiber.Object3DNode<THREE.TorusGeometry, typeof THREE.TorusGeometry>;
    }
  }
}

export interface ThreeEvent {
  object: Object3D;
  point: THREE.Vector3;
  face: THREE.Face | null;
  faceIndex: number | null;
  distance: number;
  uv: THREE.Vector2 | null;
  instanceId?: number;
}

export interface Card3DProps {
  card: import('@/types/card').CardData;
  position?: [number, number, number] | THREE.Vector3;
  rotation?: [number, number, number] | THREE.Euler;
  scale?: number | [number, number, number];
  quality?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  onClick?: (event: ThreeEvent) => void;
  onHover?: (event: ThreeEvent) => void;
}

export interface Enhanced3DCardViewerProps {
  card: import('@/types/card').CardData;
  fallbackComponent?: React.ReactNode;
  className?: string;
  autoEnable?: boolean;
  onModeChange?: (is3D: boolean) => void;
}
