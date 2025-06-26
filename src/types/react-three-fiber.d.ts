
import { Object3D, Material, Geometry, BufferGeometry } from 'three';
import { ReactThreeFiber } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshPhysicalMaterial: ReactThreeFiber.MaterialNode<THREE.MeshPhysicalMaterial, typeof THREE.MeshPhysicalMaterial>;
      meshStandardMaterial: ReactThreeFiber.MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
      shaderMaterial: ReactThreeFiber.MaterialNode<THREE.ShaderMaterial, typeof THREE.ShaderMaterial>;
      roundedBoxGeometry: ReactThreeFiber.BufferGeometryNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
      boxGeometry: ReactThreeFiber.BufferGeometryNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
      planeGeometry: ReactThreeFiber.BufferGeometryNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
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
