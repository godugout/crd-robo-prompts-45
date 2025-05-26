
import React from 'react';

interface Element {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  type: 'shape' | 'text' | 'background';
}

interface ShapesSectionProps {
  shapes: Element[];
  onShapeClick: (shape: Element) => void;
}

export const ShapesSection = ({ shapes, onShapeClick }: ShapesSectionProps) => {
  return (
    <div>
      <h4 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Add Shapes</h4>
      <div className="grid grid-cols-3 gap-3">
        {shapes.map((shape) => (
          <div 
            key={shape.id}
            className="group cursor-pointer rounded-xl bg-editor-tool hover:bg-editor-border transition-colors p-4 flex flex-col items-center gap-2"
            onClick={() => onShapeClick(shape)}
          >
            <div className={`text-2xl ${shape.color} font-bold`}>
              {shape.icon}
            </div>
            <p className="text-white text-xs font-medium text-center">{shape.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
