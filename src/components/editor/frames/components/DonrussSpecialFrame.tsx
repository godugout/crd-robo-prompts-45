
import React from 'react';

interface DonrussSpecialFrameProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
}

export const DonrussSpecialFrame: React.FC<DonrussSpecialFrameProps> = ({
  imageUrl,
  title = 'SPECIAL EDITION',
  subtitle = '1987 Collection',
  width = 160,
  height = 213
}) => {
  return (
    <div 
      className="relative bg-gradient-to-b from-red-800 to-red-900 rounded-lg overflow-hidden border-4 border-red-600 shadow-xl"
      style={{ width, height }}
    >
      {/* Donruss-style header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-700 h-7 flex items-center justify-center border-b-2 border-red-800">
        <span className="text-white text-xs font-bold">DONRUSS</span>
      </div>
      
      {/* Main image area with classic border */}
      <div className="mt-7 mx-2 h-2/3 relative">
        <div className="absolute inset-0 bg-white p-1 rounded">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Card image"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <span className="text-gray-600 text-xs">Photo</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Player info section */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="bg-white rounded p-1 border border-red-800">
          <div className="text-red-900 text-xs font-bold text-center uppercase truncate">
            {title}
          </div>
          <div className="text-red-700 text-xs text-center truncate">
            {subtitle}
          </div>
        </div>
      </div>
      
      {/* Classic corner elements */}
      <div className="absolute top-7 left-0 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 clip-triangle"></div>
      <div className="absolute top-7 right-0 w-4 h-4 bg-gradient-to-bl from-yellow-400 to-yellow-600 clip-triangle-right"></div>
    </div>
  );
};
