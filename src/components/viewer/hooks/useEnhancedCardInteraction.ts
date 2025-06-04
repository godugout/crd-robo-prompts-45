
import { useState, useCallback } from 'react';

export interface CardInteractionState {
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  rotation: { x: number; y: number };
}

export const useEnhancedCardInteraction = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    
    // Calculate rotation based on mouse position
    const rotationX = (y - 0.5) * 30; // -15 to 15 degrees
    const rotationY = (x - 0.5) * 30; // -15 to 15 degrees
    setRotation({ x: rotationX, y: rotationY });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  }, []);

  return {
    mousePosition,
    isHovering,
    rotation,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave
  };
};
