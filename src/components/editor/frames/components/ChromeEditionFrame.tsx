
import React from 'react';

interface ChromeEditionFrameProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
}

export const ChromeEditionFrame: React.FC<ChromeEditionFrameProps> = ({
  imageUrl,
  title = 'CHROME EDITION',
  subtitle = 'Limited Series',
  width = 160,
  height = 213
}) => {
  return (
    <div 
      className="relative bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg overflow-hidden border-2 border-gray-500 shadow-2xl"
      style={{ width, height }}
    >
      {/* Chrome reflective effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"></div>
      <div className="absolute inset-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg">
        
        {/* Metallic header */}
        <div className="absolute top-2 left-2 right-2 h-5 bg-gradient-to-r from-gray-300 to-gray-500 rounded flex items-center justify-center border border-gray-400">
          <span className="text-gray-900 text-xs font-bold">CHROME</span>
        </div>
        
        {/* Main image area */}
        <div className="mt-8 mx-3 h-2/3 relative">
          {imageUrl ? (
            <div className="relative w-full h-full">
              <img 
                src={imageUrl} 
                alt="Card image"
                className="w-full h-full object-cover rounded border-2 border-gray-400"
              />
              {/* Chrome reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded"></div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded border-2 border-gray-400 flex items-center justify-center relative">
              <span className="text-gray-300 text-xs">Chrome</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded"></div>
            </div>
          )}
        </div>
        
        {/* Metallic info section */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded border border-gray-400 p-1">
            <div className="text-gray-100 text-xs font-bold text-center uppercase truncate">
              {title}
            </div>
            <div className="text-gray-300 text-xs text-center truncate">
              {subtitle}
            </div>
          </div>
        </div>
        
        {/* Metallic corner accents */}
        <div className="absolute top-1 left-1 w-2 h-2 bg-gradient-to-br from-white to-gray-400 rounded-full"></div>
        <div className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-bl from-white to-gray-400 rounded-full"></div>
        <div className="absolute bottom-1 left-1 w-2 h-2 bg-gradient-to-tr from-white to-gray-400 rounded-full"></div>
        <div className="absolute bottom-1 right-1 w-2 h-2 bg-gradient-to-tl from-white to-gray-400 rounded-full"></div>
      </div>
    </div>
  );
};
