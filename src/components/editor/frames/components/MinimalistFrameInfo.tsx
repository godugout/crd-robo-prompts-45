
import React from 'react';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface MinimalistFrameInfoProps {
  frame: MinimalistFrame;
  className?: string;
}

export const MinimalistFrameInfo: React.FC<MinimalistFrameInfoProps> = ({
  frame,
  className = ""
}) => {
  const categoryColors = {
    minimal: 'text-blue-400',
    classic: 'text-green-400',
    modern: 'text-purple-400',
    fun: 'text-crd-green'
  };

  return (
    <div className={`text-center space-y-2 ${className}`}>
      <h3 className="text-white font-medium text-xl">
        {frame.name}
      </h3>
      <p className="text-crd-lightGray text-sm">
        {frame.description}
      </p>
      <div className="flex items-center justify-center space-x-2">
        <span className={`text-xs font-medium px-2 py-1 rounded ${categoryColors[frame.category]} bg-current/10`}>
          {frame.category.charAt(0).toUpperCase() + frame.category.slice(1)}
        </span>
      </div>
    </div>
  );
};
