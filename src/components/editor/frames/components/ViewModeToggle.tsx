
import React from 'react';

interface ViewModeToggleProps {
  viewMode: 'carousel' | 'gallery';
  onViewModeChange: (mode: 'carousel' | 'gallery') => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex justify-center mb-8 relative z-30">
      <div className="bg-gray-800/90 backdrop-blur-md rounded-lg p-1 flex gap-1 animate-fade-in shadow-2xl">
        <button
          onClick={() => onViewModeChange('carousel')}
          className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 transform ${
            viewMode === 'carousel' 
              ? 'bg-crd-green text-black scale-105 shadow-lg' 
              : 'text-gray-400 hover:text-white hover:scale-102'
          }`}
        >
          Showcase View
        </button>
        <button
          onClick={() => onViewModeChange('gallery')}
          className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 transform ${
            viewMode === 'gallery' 
              ? 'bg-crd-green text-black scale-105 shadow-lg' 
              : 'text-gray-400 hover:text-white hover:scale-102'
          }`}
        >
          Gallery View
        </button>
      </div>
    </div>
  );
};
