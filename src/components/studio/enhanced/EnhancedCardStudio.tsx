
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedFrameBrowser } from './EnhancedFrameBrowser';
import { EnhancedUploadZone } from './EnhancedUploadZone';
import { Sparkles, Download, Share2, Eye, Settings } from 'lucide-react';

interface EnhancedCardStudioProps {
  selectedFrame?: string;
  uploadedImage?: string;
  onFrameSelect: (frameId: string) => void;
  onImageUpload: (imageUrl: string) => void;
}

export const EnhancedCardStudio: React.FC<EnhancedCardStudioProps> = ({
  selectedFrame,
  uploadedImage,
  onFrameSelect,
  onImageUpload
}) => {
  const [previewMode, setPreviewMode] = useState<'2d' | '3d'>('2d');

  const renderCardPreview = () => {
    return (
      <div className="relative w-full h-full">
        <Card className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 border-white/20 rounded-3xl overflow-hidden shadow-2xl">
          {/* Card Content */}
          <div className="relative w-full h-full p-8">
            {uploadedImage ? (
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <img 
                  src={uploadedImage} 
                  alt="Card content"
                  className="w-full h-full object-cover"
                />
                {/* Frame Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-2xl font-bold mb-2">Your Card</h3>
                  <p className="text-gray-200 text-sm">
                    Frame: {selectedFrame || 'None selected'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full rounded-2xl border-2 border-dashed border-white/30 flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-medium">Your card preview</p>
                  <p className="text-sm">Upload an image to see it here</p>
                </div>
              </div>
            )}
          </div>

          {/* Premium Effects Overlay */}
          {selectedFrame && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
            </div>
          )}
        </Card>

        {/* 3D/2D Toggle */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant={previewMode === '2d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('2d')}
            className={previewMode === '2d' ? 'bg-crd-green text-black' : 'bg-black/50 text-white border-white/20'}
          >
            2D
          </Button>
          <Button
            variant={previewMode === '3d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('3d')}
            className={previewMode === '3d' ? 'bg-crd-green text-black' : 'bg-black/50 text-white border-white/20'}
          >
            3D
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button size="sm" variant="outline" className="bg-black/50 text-white border-white/20 hover:bg-white/10">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-black/50 text-white border-white/20 hover:bg-white/10">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-crd-green text-black font-bold px-3 py-1">
                ENHANCED STUDIO
              </Badge>
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                PREMIUM
              </Badge>
            </div>
            <h1 className="text-4xl font-black text-white mb-2">
              Professional Card Creator
            </h1>
            <p className="text-xl text-gray-300">
              Create stunning cards with advanced 3D effects and premium templates
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button className="bg-crd-green hover:bg-crd-green/90 text-black font-bold">
              <Download className="w-4 h-4 mr-2" />
              Export HD
            </Button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-8 h-[calc(100vh-200px)]">
        {/* Left Side - Large Card Preview */}
        <div className="col-span-7">
          <div className="h-full max-w-lg mx-auto aspect-[3/4]">
            {renderCardPreview()}
          </div>
        </div>

        {/* Right Side - Controls */}
        <div className="col-span-5 space-y-6 overflow-y-auto">
          {/* Upload Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Upload Image</h2>
            <EnhancedUploadZone
              onImageUpload={onImageUpload}
              uploadedImage={uploadedImage}
            />
          </div>

          {/* Frame Selection */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Choose Frame</h2>
            <EnhancedFrameBrowser
              onFrameSelect={onFrameSelect}
              selectedFrame={selectedFrame}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
