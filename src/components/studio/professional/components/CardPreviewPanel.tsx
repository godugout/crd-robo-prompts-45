
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Star } from 'lucide-react';
import { FramePreviewRenderer } from '@/components/studio/frames/FramePreviewRenderer';
import { ENHANCED_FRAME_TEMPLATES } from '@/components/studio/frames/EnhancedFrameTemplates';

interface CardPreviewPanelProps {
  selectedFrame: string;
  uploadedImage: string;
  onImageUpload: (imageUrl: string) => void;
  onFrameSelect: (frameId: string) => void;
  rating: number;
}

export const CardPreviewPanel: React.FC<CardPreviewPanelProps> = ({
  selectedFrame,
  uploadedImage,
  onImageUpload,
  onFrameSelect,
  rating
}) => {
  const frameTemplate = ENHANCED_FRAME_TEMPLATES.find(f => f.id === selectedFrame);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageUpload(url);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-cardshow-gray-500">
        <h2 className="text-lg font-semibold text-white">Card Preview</h2>
        <p className="text-sm text-cardshow-gray-200 mt-1">Professional grading visualization</p>
      </div>

      {/* Card Preview Area */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="relative">
          {/* Grading Slab Effect */}
          <div className="bg-gradient-to-br from-cardshow-gray-700 to-cardshow-gray-800 p-4 rounded-lg border border-cardshow-gray-500 shadow-elevated">
            <div className="bg-cardshow-bg-default p-2 rounded">
              {frameTemplate && uploadedImage ? (
                <FramePreviewRenderer
                  template={frameTemplate}
                  width={280}
                  height={392}
                  showContent={true}
                  uploadedImage={uploadedImage}
                  cardName="Professional Card"
                  previewMode="interactive"
                />
              ) : (
                <div className="w-[280px] h-[392px] bg-cardshow-gray-700 rounded border-2 border-dashed border-cardshow-gray-500 flex items-center justify-center">
                  <div className="text-center text-cardshow-gray-200">
                    <Camera className="w-12 h-12 mx-auto mb-3 text-cardshow-cards" />
                    <p className="text-sm">Upload image to preview</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Professional Grade Display */}
            <div className="mt-3 flex items-center justify-between bg-cardshow-bg-default rounded px-3 py-2">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white font-semibold">Grade {rating}</span>
              </div>
              <div className="text-xs text-cardshow-gray-200">PROFESSIONAL</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="p-4 border-t border-cardshow-gray-500">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button 
            className="w-full bg-cardshow-cards hover:bg-cardshow-cards/90 text-white"
            asChild
          >
            <div className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </div>
          </Button>
        </label>
      </div>
    </div>
  );
};
