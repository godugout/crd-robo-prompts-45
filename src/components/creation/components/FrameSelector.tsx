
import React from 'react';
import { Button } from '@/components/ui/button';

const FRAME_TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    preview: '#4f46e5',
    borderStyle: 'solid',
    borderWidth: 4,
    borderRadius: 12
  },
  {
    id: 'modern',
    name: 'Modern',
    preview: '#059669',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 8
  },
  {
    id: 'vintage',
    name: 'Vintage',
    preview: '#d97706',
    borderStyle: 'double',
    borderWidth: 6,
    borderRadius: 16
  },
  {
    id: 'futuristic',
    name: 'Futuristic',
    preview: '#7c3aed',
    borderStyle: 'solid',
    borderWidth: 3,
    borderRadius: 4
  },
  {
    id: 'elegant',
    name: 'Elegant',
    preview: '#be185d',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20
  },
  {
    id: 'bold',
    name: 'Bold',
    preview: '#dc2626',
    borderStyle: 'solid',
    borderWidth: 8,
    borderRadius: 0
  }
];

interface FrameSelectorProps {
  selectedFrameId: string;
  onFrameSelect: (frameId: string) => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  selectedFrameId,
  onFrameSelect
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {FRAME_TEMPLATES.map((frame) => (
        <Button
          key={frame.id}
          onClick={() => onFrameSelect(frame.id)}
          variant={selectedFrameId === frame.id ? "default" : "outline"}
          className={`
            h-16 p-3 flex flex-col items-center justify-center gap-1
            ${selectedFrameId === frame.id 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'border-gray-600 text-gray-300 hover:bg-gray-700'
            }
          `}
        >
          <div
            className="w-8 h-6 rounded border-2"
            style={{
              backgroundColor: frame.preview,
              borderStyle: frame.borderStyle,
              borderWidth: `${frame.borderWidth / 2}px`,
              borderRadius: `${frame.borderRadius / 4}px`,
              borderColor: selectedFrameId === frame.id ? '#ffffff' : frame.preview
            }}
          />
          <span className="text-xs">{frame.name}</span>
        </Button>
      ))}
    </div>
  );
};

export { FRAME_TEMPLATES };
