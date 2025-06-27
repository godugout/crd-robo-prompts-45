
import React from 'react';

interface ClassicSportsFrameProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
}

export const ClassicSportsFrame: React.FC<ClassicSportsFrameProps> = ({
  imageUrl,
  title = 'PLAYER NAME',
  subtitle = 'Team • Position',
  width = 160,
  height = 213
}) => {
  return (
    <div 
      className="relative bg-gradient-to-b from-blue-900 to-blue-800 rounded-lg overflow-hidden border-4 border-gold shadow-xl"
      style={{ width, height }}
    >
      {/* Classic sports card header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-600 h-6 flex items-center justify-center">
        <span className="text-black text-xs font-bold">CLASSIC SPORTS</span>
      </div>
      
      {/* Main image area */}
      <div className="mt-6 mx-2 h-2/3 relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Card image"
            className="w-full h-full object-cover rounded border-2 border-white"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded border-2 border-white flex items-center justify-center">
            <span className="text-white text-xs">Photo</span>
          </div>
        )}
      </div>
      
      {/* Player info section */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="bg-white/90 rounded p-1">
          <div className="text-black text-xs font-black text-center uppercase truncate">
            {title}
          </div>
          <div className="text-gray-700 text-xs text-center truncate">
            {subtitle}
          </div>
        </div>
      </div>
      
      {/* Corner decorations */}
      <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-yellow-400"></div>
      <div className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-yellow-400"></div>
      <div className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-yellow-400"></div>
      <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-yellow-400"></div>
    </div>
  );
};
