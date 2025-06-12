
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Type, Sticker, Sparkles } from 'lucide-react';
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
    { id: 'classic-sports-cutout', name: 'Classic Sports', preview: '/api/placeholder/150/200' },
    { id: 'modern-holographic-cutout', name: 'Holographic', preview: '/api/placeholder/150/200' },
    { id: 'vintage-ornate-cutout', name: 'Vintage', preview: '/api/placeholder/150/200' },
    { id: 'chrome-edition-cutout', name: 'Chrome', preview: '/api/placeholder/150/200' }
  ];

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
              <div className="aspect-[3/4] bg-gray-200 rounded mb-2 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-xs text-gray-600">{frame.name}</span>
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
            <div className="relative w-96 h-[520px]">
              {/* Background Photo */}
              <img 
                src={uploadedPhoto} 
                alt="Uploaded photo"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
              
              {/* Frame Overlay */}
              <CutoutFrameOverlay
                frameId={selectedFrame}
                onRegionClick={handleRegionClick}
                selectedRegion={selectedRegion}
              />
              
              {/* Quick Actions */}
              <div className="absolute -bottom-14 left-0 right-0 flex justify-center gap-2">
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
              👆 Click on different areas of the frame to add text, stickers, or effects
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
