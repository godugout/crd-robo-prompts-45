
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import * as THREE from 'three';

interface GestureControllerProps {
  onGestureRecognized: (gesture: string, data: any) => void;
  enabledGestures: string[];
}

export const GestureController: React.FC<GestureControllerProps> = ({
  onGestureRecognized,
  enabledGestures
}) => {
  const { controllers } = useXR();
  const previousPositions = useRef<Map<number, THREE.Vector3>>(new Map());
  const gestureStates = useRef<Map<string, any>>(new Map());
  const [activeGesture, setActiveGesture] = useState<string | null>(null);

  useFrame(() => {
    controllers.forEach((controller, index) => {
      if (!controller.inputSource.hand) return;

      const currentPosition = new THREE.Vector3();
      controller.getWorldPosition(currentPosition);

      const previousPosition = previousPositions.current.get(index);
      
      if (previousPosition) {
        const velocity = currentPosition.clone().sub(previousPosition);
        const speed = velocity.length();

        // Detect gestures based on movement patterns
        detectGestures(controller, velocity, speed, index);
      }

      previousPositions.current.set(index, currentPosition.clone());
    });
  });

  const detectGestures = (
    controller: any, 
    velocity: THREE.Vector3, 
    speed: number, 
    controllerIndex: number
  ) => {
    const position = new THREE.Vector3();
    controller.getWorldPosition(position);

    // Paint Gesture - slow, controlled movement
    if (enabledGestures.includes('paint') && speed > 0.001 && speed < 0.01) {
      if (activeGesture !== 'paint') {
        setActiveGesture('paint');
        onGestureRecognized('paint', {
          position: position.toArray(),
          velocity: velocity.toArray(),
          controllerId: controllerIndex
        });
      }
    }

    // Throw Gesture - fast forward movement
    else if (enabledGestures.includes('throw') && speed > 0.05 && velocity.z < -0.02) {
      if (activeGesture !== 'throw') {
        setActiveGesture('throw');
        onGestureRecognized('throw', {
          position: position.toArray(),
          velocity: velocity.toArray(),
          force: speed,
          cardId: 'current-card'
        });
      }
    }

    // Scale Gesture - detect two-handed scaling
    else if (enabledGestures.includes('scale') && controllers.length >= 2) {
      const otherController = controllers.find((c, i) => i !== controllerIndex);
      if (otherController) {
        const otherPosition = new THREE.Vector3();
        otherController.getWorldPosition(otherPosition);
        
        const distance = position.distanceTo(otherPosition);
        const previousDistance = gestureStates.current.get('scale-distance') || distance;
        
        const scaleDelta = distance - previousDistance;
        
        if (Math.abs(scaleDelta) > 0.01) {
          setActiveGesture('scale');
          onGestureRecognized('scale', {
            scale: distance / previousDistance,
            distance,
            controllers: [controllerIndex, controllers.indexOf(otherController)]
          });
        }
        
        gestureStates.current.set('scale-distance', distance);
      }
    }

    // Rotate Gesture - circular movement
    else if (enabledGestures.includes('rotate') && speed > 0.005) {
      const rotationAxis = velocity.clone().normalize();
      const angle = Math.atan2(velocity.x, velocity.z);
      
      if (Math.abs(angle) > 0.1) {
        setActiveGesture('rotate');
        onGestureRecognized('rotate', {
          rotation: angle,
          axis: rotationAxis.toArray(),
          position: position.toArray()
        });
      }
    }

    // Reset active gesture if movement stops
    else if (speed < 0.0005) {
      if (activeGesture) {
        setActiveGesture(null);
      }
    }
  };

  return null; // This component doesn't render anything visual
};
