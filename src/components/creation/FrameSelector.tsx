
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const FRAME_OPTIONS = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, minimalist border',
    preview: '/api/placeholder/300/400',
    category: 'Basic'
  },
  {
    id: 'classic',
    name: 'Classic Sports',
    description: 'Traditional trading card style',
    preview: '/api/placeholder/300/400',
    category: 'Basic'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro ornate styling',
    preview: '/api/placeholder/300/400',
    category: 'Premium'
  },
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Shimmering rainbow border',
    preview: '/api/placeholder/300/400',
    category: 'Premium'
  },
  {
    id: 'chrome',
    name: 'Chrome Elite',
    description: 'Metallic chrome finish',
    preview: '/api/placeholder/300/400',
    category: 'Premium'
  },
  {
    id: 'crystal',
    name: 'Crystal',
    description: 'Crystalline transparent effect',
    preview: '/api/placeholder/300/400',
    category: 'Premium'
  }
];

interface FrameSelectorProps {
  uploadedImage: string;
  selectedFrame?: string;
  onFrameSelect: (frameId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  uploadedImage,
  selectedFrame,
  onFrameSelect,
  onNext,
  onBack
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Frame</h2>
        <p className="text-gray-400">Select a frame style that matches your card's vibe</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FRAME_OPTIONS.map((frame) => (
          <Card
            key={frame.id}
            className={`
              relative cursor-pointer transition-all duration-300
              ${selectedFrame === frame.id 
                ? 'border-crd-green bg-crd-green/10' 
                : 'border-gray-600 hover:border-crd-green/50'
              }
            `}
            onClick={() => onFrameSelect(frame.id)}
          >
            <div className="p-4">
              {/* Frame Preview */}
              <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-800">
                <div className="aspect-[3/4] flex items-center justify-center">
                  <div className="w-24 h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded border-2 border-gray-600">
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                      Preview
                    </div>
                  </div>
                </div>
                
                {selectedFrame === frame.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-6 h-6 text-crd-green" />
                  </div>
                )}
              </div>

              {/* Frame Info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{frame.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    frame.category === 'Premium' 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {frame.category}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{frame.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Back to Upload
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedFrame}
          className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
        >
          Next: Customize
        </Button>
      </div>
    </div>
  );
};
