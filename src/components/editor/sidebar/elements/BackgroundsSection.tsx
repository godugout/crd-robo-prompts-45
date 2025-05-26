
import React from 'react';

interface Element {
  id: string;
  name: string;
  type: 'shape' | 'text' | 'background';
  gradient?: string;
}

interface BackgroundsSectionProps {
  backgrounds: Element[];
  onBackgroundClick: (background: Element) => void;
}

export const BackgroundsSection = ({ backgrounds, onBackgroundClick }: BackgroundsSectionProps) => {
  return (
    <div>
      <h4 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Backgrounds</h4>
      <div className="grid grid-cols-2 gap-2">
        {backgrounds.map((bg) => (
          <div 
            key={bg.id}
            className="group cursor-pointer rounded-lg overflow-hidden aspect-square transition-all hover:scale-105 hover:shadow-lg"
            onClick={() => onBackgroundClick(bg)}
          >
            <div className={`w-full h-full bg-gradient-to-br ${bg.gradient} flex items-center justify-center`}>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium text-center">
                {bg.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
