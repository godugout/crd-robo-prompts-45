
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { CutoutFrameOverlay } from './CutoutFrameOverlay';
import { RegionalContentPanel } from './RegionalContentPanel';
import { useCardEditor } from '@/hooks/useCardEditor';

interface SimpleCutoutEditorProps {
  cardEditor: ReturnType<typeof useCardEditor>;
}

export const SimpleCutoutEditor: React.FC<SimpleCutoutEditorProps> = ({ cardEditor }) => {
  const [selectedFrame, setSelectedFrame] = useState('classic-sports-cutout');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  const frameOptions = [
    { 
      id: 'classic-sports-cutout', 
      name: 'Classic Sports', 
      borderStyle: 'border-4 border-blue-600 bg-gradient-to-b from-blue-100 to-blue-200',
      accentColor: 'text-blue-800'
    },
    { 
      id: 'modern-holographic-cutout', 
      name: 'Holographic', 
      borderStyle: 'border-4 border-purple-600 bg-gradient-to-br from-purple-100 via-pink-100 to-cyan-100',
      accentColor: 'text-purple-800'
    },
    { 
      id: 'vintage-ornate-cutout', 
      name: 'Vintage', 
      borderStyle: 'border-4 border-amber-700 bg-gradient-to-b from-amber-50 to-amber-200',
      accentColor: 'text-amber-900'
    },
    { 
      id: 'chrome-edition-cutout', 
      name: 'Chrome', 
      borderStyle: 'border-4 border-gray-500 bg-gradient-to-b from-gray-200 to-gray-400',
      accentColor: 'text-gray-900'
    }
  ];

  const currentFrame = frameOptions.find(f => f.id === selectedFrame) || frameOptions[0];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedPhoto(url);
      cardEditor.updateCardField('image_url', url);
    }
  };

  const handleRegionClick = (regionId: string, regionType: 'photo' | 'text' | 'sticker') => {
    setSelectedRegion(regionId);
    console.log(`Selected ${regionType} region:`, regionId);
  };

  return (
    <div className="flex h-full bg-editor-darker">
      {/* Left Sidebar - Frame Selection */}
      <div className="w-64 bg-editor-dark border-r border-editor-border p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Choose Frame</h3>
        <div className="space-y-3">
          {frameOptions.map((frame) => (
            <Card 
              key={frame.id}
              className={`p-3 cursor-pointer transition-all hover:scale-105 ${
                selectedFrame === frame.id 
                  ? 'ring-2 ring-crd-green bg-crd-green/10' 
                  : 'bg-editor-border hover:bg-editor-border/80'
              }`}
              onClick={() => setSelectedFrame(frame.id)}
            >
              <div className="aspect-[3/4] rounded mb-2 overflow-hidden">
                <div className={`w-full h-full ${frame.borderStyle} flex items-center justify-center relative`}>
                  <div className="absolute inset-4 bg-gray-300 rounded"></div>
                  <span className={`relative z-10 text-xs font-bold ${frame.accentColor}`}>
                    {frame.name.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-white text-center">{frame.name}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Center - Main Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="relative">
          {/* Photo Upload Area */}
          {!uploadedPhoto ? (
            <div className="w-96 h-[520px] bg-editor-border border-2 border-dashed border-crd-green/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-editor-border/80 transition-colors">
              <Camera className="w-16 h-16 text-crd-green mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Upload Your Photo</h3>
              <p className="text-gray-400 text-center mb-4">Click to add a photo that will go behind your frame</p>
              <Button 
                onClick={() => document.getElementById('photo-upload')?.click()}
                className="bg-crd-green text-black hover:bg-crd-green/90"
              >
                Choose Photo
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative w-96 h-[520px] group">
              {/* Complete Card Preview */}
              <div className={`absolute inset-0 ${currentFrame.borderStyle} rounded-lg overflow-hidden`}>
                {/* Photo Background - Fitted within frame */}
                <div className="absolute inset-4 overflow-hidden rounded">
                  <img 
                    src={uploadedPhoto} 
                    alt="Card photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Frame Content Overlays */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Title Area */}
                  <div className="absolute top-2 left-4 right-4">
                    <div className={`text-center text-lg font-bold ${currentFrame.accentColor} bg-white/90 px-2 py-1 rounded shadow-sm`}>
                      CARD TITLE
                    </div>
                  </div>
                  
                  {/* Stats/Info Area */}
                  <div className="absolute bottom-2 left-4 right-4">
                    <div className={`text-center text-sm font-semibold ${currentFrame.accentColor} bg-white/90 px-2 py-1 rounded shadow-sm`}>
                      PLAYER STATS
                    </div>
                  </div>
                  
                  {/* Corner Logo Area */}
                  <div className="absolute top-2 right-2">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                      <span className="text-xl">⭐</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Invisible Interaction Overlay - Only visible on hover */}
              <CutoutFrameOverlay
                frameId={selectedFrame}
                onRegionClick={handleRegionClick}
                selectedRegion={selectedRegion}
              />
              
              {/* Quick Actions */}
              <div className="absolute -bottom-14 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  className="bg-black/50 border-white/20 text-white hover:bg-black/70"
                >
                  Change Photo
                </Button>
                <Button 
                  size="sm"
                  className="bg-crd-green text-black hover:bg-crd-green/90"
                  onClick={() => cardEditor.saveCard()}
                >
                  Save Card
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Helper Text */}
        {uploadedPhoto && (
          <div className="mt-16 text-center max-w-md">
            <p className="text-gray-400 text-sm">
              👆 Hover over the card and click on different areas to customize text, stickers, or effects
            </p>
          </div>
        )}
      </div>

      {/* Right Sidebar - Regional Content */}
      {selectedRegion && (
        <RegionalContentPanel
          regionId={selectedRegion}
          onClose={() => setSelectedRegion(null)}
          cardEditor={cardEditor}
        />
      )}
    </div>
  );
};
