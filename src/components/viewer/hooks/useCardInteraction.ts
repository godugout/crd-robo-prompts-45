
import { useState, useMemo } from 'react';
import { Vector3 } from 'three';

export const useCardInteraction = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  const cameraPosition: Vector3 = useMemo(() => new Vector3(0, 0, 5), []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setRotation(prev => ({
        x: prev.x + e.movementY * 0.5,
        y: prev.y + e.movementX * 0.5
      }));
    }
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovering(false);
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return {
    isFlipped,
    rotation,
    zoom,
    isDragging,
    mousePosition,
    isHovering,
    cameraPosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleClick
  };
};
