
export interface TouchPoint {
  x: number;
  y: number;
  id: number;
}

export interface GestureState {
  isActive: boolean;
  startTime: number;
  initialDistance: number;
  initialScale: number;
  initialRotation: number;
  velocity: { x: number; y: number };
  momentum: boolean;
}

export interface EnhancedGestureCallbacks {
  onPinchZoom: (scale: number, center: { x: number; y: number }) => void;
  onPan: (delta: { x: number; y: number }, velocity: { x: number; y: number }) => void;
  onRotate: (angle: number) => void;
  onTap: () => void;
  onDoubleTap: () => void;
  onLongPress: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onThreeFingerTap: () => void;
}
