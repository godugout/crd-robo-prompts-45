
import React from 'react';
import { CRDElement } from './CRDElement';
import { CRDFrameProps } from '@/types/crdFrames';

export const CRDFrameRenderer: React.FC<CRDFrameProps> = ({
  frame,
  userImage,
  width = 300,
  height = 420,
  className = '',
  interactive = false
}) => {
  const { elements, placeholderDimensions, totalDimensions } = frame;

  // Calculate scaling factor
  const scaleX = width / totalDimensions.width;
  const scaleY = height / totalDimensions.height;
  const scale = Math.min(scaleX, scaleY);

  // Calculate actual dimensions maintaining aspect ratio
  const actualWidth = totalDimensions.width * scale;
  const actualHeight = totalDimensions.height * scale;

  // Calculate image placeholder position and size
  const placeholderStyle = {
    left: `${(placeholderDimensions.x / totalDimensions.width) * 100}%`,
    top: `${(placeholderDimensions.y / totalDimensions.height) * 100}%`,
    width: `${(placeholderDimensions.width / totalDimensions.width) * 100}%`,
    height: `${(placeholderDimensions.height / totalDimensions.height) * 100}%`
  };

  return (
    <div
      className={`relative bg-transparent ${className} ${interactive ? 'hover:scale-105 transition-transform duration-300' : ''}`}
      style={{
        width: actualWidth,
        height: actualHeight
      }}
    >
      {/* User Image Placeholder */}
      <div
        className="absolute overflow-hidden"
        style={{
          ...placeholderStyle,
          zIndex: 1
        }}
      >
        {userImage ? (
          <img
            src={userImage}
            alt="User uploaded content"
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <div className="text-white/60 text-xs text-center">
              <div className="text-2xl mb-2">📷</div>
              <div>Photo Area</div>
            </div>
          </div>
        )}
      </div>

      {/* Frame Elements */}
      {elements.map((element) => (
        <CRDElement
          key={element.id}
          element={element}
          containerWidth={totalDimensions.width}
          containerHeight={totalDimensions.height}
        />
      ))}

      {/* Debug overlay for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded z-50">
          {frame.name}
        </div>
      )}
    </div>
  );
};
