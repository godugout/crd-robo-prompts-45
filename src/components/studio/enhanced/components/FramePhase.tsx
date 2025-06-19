
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface FramePhaseProps {
  selectedFrame: string;
  onFrameSelect: (frameId: string) => void;
  orientation: 'portrait' | 'landscape';
}

const FRAME_OPTIONS = [
  {
    id: 'classic-modern',
    name: 'Classic Modern',
    preview: '/api/placeholder/120/160',
    category: 'modern'
  },
  {
    id: 'holographic-modern',
    name: 'Holographic',
    preview: '/api/placeholder/120/160',
    category: 'premium'
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Ornate',
    preview: '/api/placeholder/120/160',
    category: 'vintage'
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    preview: '/api/placeholder/120/160',
    category: 'futuristic'
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    preview: '/api/placeholder/120/160',
    category: 'minimal'
  },
  {
    id: 'sports-classic',
    name: 'Sports Classic',
    preview: '/api/placeholder/120/160',
    category: 'sports'
  }
];

export const FramePhase: React.FC<FramePhaseProps> = ({
  selectedFrame,
  onFrameSelect,
  orientation
}) => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-white text-xl font-semibold mb-2">Choose Your Frame</h3>
        <p className="text-crd-lightGray text-sm">
          Select a frame style that matches your card's theme
        </p>
      </div>

      {/* Frame Grid */}
      <div className="grid grid-cols-2 gap-4">
        {FRAME_OPTIONS.map((frame) => (
          <Button
            key={frame.id}
            variant="outline"
            onClick={() => onFrameSelect(frame.id)}
            className={`
              relative h-32 p-2 border-2 transition-all
              ${selectedFrame === frame.id 
                ? 'border-crd-green bg-crd-green/10' 
                : 'border-editor-border hover:border-crd-green/50'
              }
            `}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-2">
              {/* Frame Preview */}
              <div className="w-16 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded border-2 border-gray-500 relative">
                <div className="absolute inset-1 bg-gray-300 rounded"></div>
                {selectedFrame === frame.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                )}
              </div>
              
              {/* Frame Name */}
              <div className="text-center">
                <p className="text-white text-sm font-medium">{frame.name}</p>
                <p className="text-crd-lightGray text-xs capitalize">{frame.category}</p>
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* Frame Categories */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Frame Categories</h4>
        <div className="flex flex-wrap gap-2">
          {['modern', 'premium', 'vintage', 'futuristic', 'minimal', 'sports'].map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className="text-xs capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Frame Info */}
      {selectedFrame && (
        <div className="p-4 bg-editor-tool rounded-lg border border-editor-border">
          <h4 className="text-white font-medium mb-2">Selected Frame</h4>
          <p className="text-crd-lightGray text-sm">
            {FRAME_OPTIONS.find(f => f.id === selectedFrame)?.name} - Perfect for creating stunning {orientation} cards
          </p>
        </div>
      )}
    </div>
  );
};
