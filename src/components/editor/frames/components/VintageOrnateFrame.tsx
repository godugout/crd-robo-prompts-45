
import React from 'react';

interface VintageOrnateFrameProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
}

export const VintageOrnateFrame: React.FC<VintageOrnateFrameProps> = ({
  imageUrl,
  title = 'VINTAGE CARD',
  subtitle = 'Collector\'s Edition',
  width = 160,
  height = 213
}) => {
  return (
    <div 
      className="relative bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg overflow-hidden border-4 border-amber-600 shadow-xl"
      style={{ width, height }}
    >
      {/* Ornate border pattern */}
      <div className="absolute inset-2 border-2 border-amber-700 rounded bg-gradient-to-b from-amber-50 to-amber-100">
        
        {/* Decorative header */}
        <div className="absolute top-1 left-1 right-1 h-6 bg-gradient-to-r from-amber-700 to-amber-600 rounded flex items-center justify-center">
          <span className="text-amber-100 text-xs font-serif font-bold">VINTAGE</span>
        </div>
        
        {/* Main image area with ornate frame */}
        <div className="mt-8 mx-2 h-2/3 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-700 rounded p-1">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Card image"
                className="w-full h-full object-cover rounded border border-amber-800"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-300 rounded border border-amber-800 flex items-center justify-center">
                <span className="text-amber-800 text-xs font-serif">Portrait</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Ornate info section */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-gradient-to-r from-amber-200 to-amber-100 rounded border border-amber-700 p-1">
            <div className="text-amber-900 text-xs font-serif font-bold text-center uppercase truncate">
              {title}
            </div>
            <div className="text-amber-700 text-xs font-serif text-center truncate italic">
              {subtitle}
            </div>
          </div>
        </div>
        
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-3 h-3">
          <div className="w-full h-full bg-amber-700 transform rotate-45 translate-x-1 translate-y-1"></div>
        </div>
        <div className="absolute top-0 right-0 w-3 h-3">
          <div className="w-full h-full bg-amber-700 transform rotate-45 -translate-x-1 translate-y-1"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-3 h-3">
          <div className="w-full h-full bg-amber-700 transform rotate-45 translate-x-1 -translate-y-1"></div>
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3">
          <div className="w-full h-full bg-amber-700 transform rotate-45 -translate-x-1 -translate-y-1"></div>
        </div>
      </div>
    </div>
  );
};
