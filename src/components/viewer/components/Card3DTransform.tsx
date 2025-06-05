
import React from 'react';

interface Card3DTransformProps {
  children: React.ReactNode;
  rotation: { x: number; y: number };
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  isHovering: boolean;
  onClick: () => void;
}

export const Card3DTransform: React.FC<Card3DTransformProps> = ({
  children,
  rotation,
  mousePosition,
  isDragging,
  isHovering,
  onClick
}) => {
  // Calculate dynamic transform
  const getDynamicTransform = () => {
    return `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
  };

  return (
    <div
      className="relative"
      style={{
        width: '400px',
        height: '560px',
        transform: getDynamicTransform(),
        transformStyle: 'preserve-3d',
        transition: isDragging ? 'none' : 'transform 0.1s ease',
        filter: `drop-shadow(0 25px 50px rgba(0,0,0,${isHovering ? 0.9 : 0.8}))`
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
