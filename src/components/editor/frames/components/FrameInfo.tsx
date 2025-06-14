
import React from 'react';

interface MinimalistFrame {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'classic' | 'modern' | 'fun';
  borderStyle: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

interface FrameInfoProps {
  frame: MinimalistFrame;
}

export const FrameInfo: React.FC<FrameInfoProps> = ({ frame }) => {
  return (
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold text-white mb-2">{frame.name}</h3>
      <p className="text-gray-400">{frame.description}</p>
      <span className="inline-block mt-2 px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm capitalize">
        {frame.category}
      </span>
    </div>
  );
};
