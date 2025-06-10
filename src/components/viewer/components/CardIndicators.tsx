
import React from 'react';

interface CardIndicatorsProps {
  rotateMode: boolean;
  currentRotationY: number;
  currentZoom: number;
  gestureState: {
    isActive: boolean;
    gestureType: string;
  };
}

export const CardIndicators: React.FC<CardIndicatorsProps> = ({
  rotateMode,
  currentRotationY,
  currentZoom,
  gestureState
}) => {
  return (
    <>
      {/* Rotation Mode Indicator */}
      {rotateMode && (
        <div className="absolute top-4 left-4 bg-orange-500/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur z-50">
          Rotation Mode • {Math.round(currentRotationY)}°
        </div>
      )}

      {/* Gesture Feedback */}
      {gestureState.isActive && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur z-50">
          {gestureState.gestureType}
        </div>
      )}
    </>
  );
};
