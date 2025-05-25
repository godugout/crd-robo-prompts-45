
import React from 'react';

interface CraftBoardOverlayProps {
  isActive: boolean;
  children: React.ReactNode;
}

export const CraftBoardOverlay = ({ isActive, children }: CraftBoardOverlayProps) => {
  if (!isActive) return <>{children}</>;

  return (
    <div className="relative">
      {/* Craft board background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #4a9d6b 0%, #3a8d5b 100%),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255, 255, 255, 0.03) 2px,
                rgba(255, 255, 255, 0.03) 4px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(255, 255, 255, 0.03) 2px,
                rgba(255, 255, 255, 0.03) 4px
              )
            `,
            backgroundSize: '100% 100%, 20px 20px, 20px 20px'
          }}
        />
        
        {/* Grid overlay to simulate cutting mat */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 215, 0, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 215, 0, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Scattered craft supplies */}
        <div className="absolute top-10 left-20 w-8 h-8 bg-red-500 rounded-full shadow-lg transform rotate-12"></div>
        <div className="absolute top-32 right-24 w-6 h-6 bg-blue-600 rounded shadow-lg transform -rotate-45"></div>
        <div className="absolute bottom-20 left-16 w-4 h-16 bg-yellow-400 rounded shadow-lg transform rotate-45"></div>
        <div className="absolute bottom-40 right-32 w-12 h-3 bg-purple-500 rounded-full shadow-lg transform rotate-12"></div>
        
        {/* Ruler in corner */}
        <div className="absolute top-4 left-4 w-64 h-6 bg-gray-200 border border-gray-400 shadow-lg">
          {[...Array(16)].map((_, i) => (
            <div 
              key={i} 
              className="absolute top-0 border-l border-gray-600" 
              style={{ left: `${i * 16}px`, height: i % 4 === 0 ? '24px' : '12px' }}
            />
          ))}
        </div>

        {/* Scissors */}
        <div className="absolute top-20 right-20 w-8 h-8 transform rotate-45">
          <div className="w-3 h-6 bg-gray-400 rounded-full"></div>
          <div className="w-3 h-6 bg-gray-400 rounded-full ml-3 -mt-4"></div>
        </div>
      </div>

      {/* Content with craft board styling */}
      <div className="relative z-10 craft-board-mode">
        {children}
      </div>
    </div>
  );
};
