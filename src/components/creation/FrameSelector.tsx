
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Layout } from 'lucide-react';
import { UnifiedCardRenderer } from './UnifiedCardRenderer';
import { CRDFrameSelector } from '../frames/crd/CRDFrameSelector';
import type { UnifiedCardData } from '@/types/cardCreation';

const LEGACY_FRAME_OPTIONS = [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    description: 'Traditional trading card style',
    category: 'Legacy'
  },
  {
    id: 'holographic-modern', 
    name: 'Holographic Pro',
    description: 'Modern holographic design',
    category: 'Legacy'
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Gold',
    description: 'Ornate vintage styling',
    category: 'Legacy'
  },
  {
    id: 'chrome-edition',
    name: 'Chrome Elite',
    description: 'Sleek chrome finish',
    category: 'Legacy'
  }
];

interface FrameSelectorProps {
  uploadedImage: string;
  selectedFrame: string;
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
  const [frameType, setFrameType] = useState<'crd' | 'legacy'>('crd');

  // Create preview card data
  const previewCardData: UnifiedCardData = {
    title: 'Preview',
    description: 'Sample card',
    rarity: 'common',
    frame: selectedFrame,
    effects: {
      holographic: 0,
      metallic: 0,
      chrome: 0,
      particles: false
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Frame</h2>
        <p className="text-gray-400">Select a frame style that matches your card's vibe</p>
      </div>

      {/* Preview Area */}
      <div className="flex justify-center mb-8">
        <UnifiedCardRenderer
          cardData={{ ...previewCardData, frame: selectedFrame }}
          imageUrl={uploadedImage}
          width={250}
          height={350}
          className="shadow-2xl"
        />
      </div>

      {/* Frame Type Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-800 rounded-lg p-1">
          <Button
            variant={frameType === 'crd' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFrameType('crd')}
            className={frameType === 'crd' ? 'bg-crd-green text-black' : 'text-gray-300'}
          >
            CRD Frames
          </Button>
          <Button
            variant={frameType === 'legacy' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFrameType('legacy')}
            className={frameType === 'legacy' ? 'bg-crd-green text-black' : 'text-gray-300'}
          >
            Legacy Frames
          </Button>
        </div>
      </div>

      {/* Frame Selection */}
      {frameType === 'crd' ? (
        <CRDFrameSelector
          selectedFrameId={selectedFrame}
          onFrameSelect={onFrameSelect}
          userImage={uploadedImage}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEGACY_FRAME_OPTIONS.map((frame) => (
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
                    <UnifiedCardRenderer
                      cardData={{ ...previewCardData, frame: frame.id }}
                      imageUrl={uploadedImage}
                      width={120}
                      height={160}
                    />
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
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400">
                      {frame.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{frame.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

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
