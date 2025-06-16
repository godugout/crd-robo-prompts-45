
import React from 'react';
import { FramePreview } from './FramePreview';
import { MinimalistFrameInfo } from './MinimalistFrameInfo';
import { FrameUploadPrompt } from './FrameUploadPrompt';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface ProfessionalShowcaseViewProps {
  frames: MinimalistFrame[];
  currentIndex: number;
  uploadedImage?: string;
  isDragActive: boolean;
  onFrameSelect: (index: number) => void;
  onImageUpload: (imageUrl: string) => void;
  getRootProps: () => any;
  getInputProps: () => any;
}

export const ProfessionalShowcaseView: React.FC<ProfessionalShowcaseViewProps> = ({
  frames,
  currentIndex,
  uploadedImage,
  isDragActive,
  onFrameSelect,
  onImageUpload,
  getRootProps,
  getInputProps
}) => {
  const currentFrame = frames[currentIndex];

  const handleImageUpdate = (newImageUrl: string) => {
    onImageUpload(newImageUrl);
  };

  return (
    <div className="w-full min-h-[700px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 h-full" {...getRootProps()}>
        <input {...getInputProps()} />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 p-8 h-full items-center max-w-7xl mx-auto">
          
          {/* Left: Large Frame Preview */}
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-3xl blur-xl scale-110" />
              
              {/* Main card preview */}
              <div className="relative w-80 h-[448px] mx-auto">
                <FramePreview
                  frame={currentFrame}
                  imageUrl={uploadedImage}
                  size="large"
                  isDragActive={isDragActive}
                  onImageUpdate={handleImageUpdate}
                />
              </div>
            </div>

            {/* Upload prompt if no image */}
            {!uploadedImage && (
              <div className="text-center space-y-4 animate-fade-in">
                <FrameUploadPrompt show={true} />
              </div>
            )}
          </div>

          {/* Right: Frame Selection & Info */}
          <div className="space-y-8">
            
            {/* Frame Info */}
            <div className="animate-fade-in">
              <MinimalistFrameInfo frame={currentFrame} />
            </div>

            {/* Frame Selection Grid */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h3 className="text-white font-semibold text-lg">Choose Your Frame</h3>
              
              <div className="grid grid-cols-4 gap-4 max-h-80 overflow-y-auto pr-2">
                {frames.map((frame, index) => (
                  <button
                    key={frame.id}
                    onClick={() => onFrameSelect(index)}
                    className={`relative aspect-[2.5/3.5] group transition-all duration-300 rounded-xl overflow-hidden ${
                      index === currentIndex
                        ? 'ring-2 ring-crd-green scale-105'
                        : 'hover:scale-102 hover:ring-1 hover:ring-white/30'
                    }`}
                  >
                    <FramePreview
                      frame={frame}
                      imageUrl={uploadedImage}
                      size="small"
                      isDragActive={false}
                    />
                    
                    {/* Selection overlay */}
                    <div className={`absolute inset-0 transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-crd-green/20 border-2 border-crd-green'
                        : 'bg-transparent group-hover:bg-white/10'
                    } rounded-xl`} />
                    
                    {/* Check mark for selected */}
                    {index === currentIndex && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
