
import React from 'react';

interface DonrussRookieFrameProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
}

export const DonrussRookieFrame: React.FC<DonrussRookieFrameProps> = ({
  imageUrl,
  title = 'ROOKIE CARD',
  subtitle = 'First Year',
  width = 160,
  height = 213
}) => {
  return (
    <div 
      className="relative bg-gradient-to-b from-blue-800 to-blue-900 rounded-lg overflow-hidden border-4 border-blue-600 shadow-xl"
      style={{ width, height }}
    >
      {/* Rookie header with special styling */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 h-7 flex items-center justify-center border-b-2 border-blue-800">
        <span className="text-white text-xs font-bold">ROOKIE</span>
      </div>
      
      {/* Main image area */}
      <div className="mt-7 mx-2 h-2/3 relative">
        <div className="absolute inset-0 bg-white p-1 rounded border-2 border-red-500">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Card image"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <span className="text-gray-600 text-xs">Rookie</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Rookie info section */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded p-1 border border-red-700">
          <div className="text-white text-xs font-bold text-center uppercase truncate">
            {title}
          </div>
          <div className="text-red-100 text-xs text-center truncate">
            {subtitle}
          </div>
        </div>
      </div>
      
      {/* Rookie special elements */}
      <div className="absolute top-7 left-1 text-red-500 text-xs font-bold">★</div>
      <div className="absolute top-7 right-1 text-red-500 text-xs font-bold">★</div>
      <div className="absolute bottom-12 left-1 text-red-500 text-xs font-bold">★</div>
      <div className="absolute bottom-12 right-1 text-red-500 text-xs font-bold">★</div>
    </div>
  );
};
