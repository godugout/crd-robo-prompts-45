
import React from 'react';

interface ModernHolographicFrameProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
}

export const ModernHolographicFrame: React.FC<ModernHolographicFrameProps> = ({
  imageUrl,
  title = 'HOLOGRAPHIC',
  subtitle = 'Premium Edition',
  width = 160,
  height = 213
}) => {
  return (
    <div 
      className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 rounded-lg overflow-hidden shadow-2xl"
      style={{ width, height }}
    >
      {/* Holographic border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      <div className="absolute inset-1 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg">
        
        {/* Header with rainbow effect */}
        <div className="absolute top-2 left-2 right-2 h-5 bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 via-green-500 to-yellow-500 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">HOLOGRAPHIC</span>
        </div>
        
        {/* Main image area */}
        <div className="mt-8 mx-3 h-2/3 relative">
          {imageUrl ? (
            <div className="relative w-full h-full">
              <img 
                src={imageUrl} 
                alt="Card image"
                className="w-full h-full object-cover rounded border border-purple-400"
              />
              {/* Holographic overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse"></div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-800 to-indigo-800 rounded border border-purple-400 flex items-center justify-center relative">
              <span className="text-purple-200 text-xs">Holographic</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse"></div>
            </div>
          )}
        </div>
        
        {/* Info section with prismatic effect */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 rounded p-1 backdrop-blur-sm">
            <div className="text-white text-xs font-bold text-center uppercase truncate">
              {title}
            </div>
            <div className="text-purple-100 text-xs text-center truncate">
              {subtitle}
            </div>
          </div>
        </div>
        
        {/* Prismatic corner effects */}
        <div className="absolute top-0 left-0 w-4 h-4 bg-gradient-to-br from-pink-400 to-transparent rounded-br-full opacity-60"></div>
        <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-bl from-blue-400 to-transparent rounded-bl-full opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-gradient-to-tr from-green-400 to-transparent rounded-tr-full opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-tl from-yellow-400 to-transparent rounded-tl-full opacity-60"></div>
      </div>
    </div>
  );
};
