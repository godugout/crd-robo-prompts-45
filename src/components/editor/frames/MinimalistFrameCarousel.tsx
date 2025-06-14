
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

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

const MINIMALIST_FRAMES: MinimalistFrame[] = [
  {
    id: 'clean-white',
    name: 'Clean White',
    description: 'Pure and simple',
    category: 'minimal',
    borderStyle: 'border-2 border-gray-200',
    backgroundColor: 'bg-white',
    textColor: 'text-gray-900',
    accentColor: 'bg-gray-100'
  },
  {
    id: 'soft-shadow',
    name: 'Soft Shadow',
    description: 'Subtle depth',
    category: 'minimal',
    borderStyle: 'shadow-lg border border-gray-100',
    backgroundColor: 'bg-white',
    textColor: 'text-gray-800',
    accentColor: 'bg-gray-50'
  },
  {
    id: 'simple-black',
    name: 'Simple Black',
    description: 'Bold and clean',
    category: 'classic',
    borderStyle: 'border-2 border-black',
    backgroundColor: 'bg-black',
    textColor: 'text-white',
    accentColor: 'bg-gray-900'
  },
  {
    id: 'rounded-modern',
    name: 'Rounded Modern',
    description: 'Friendly curves',
    category: 'modern',
    borderStyle: 'border-2 border-blue-200 rounded-xl',
    backgroundColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    accentColor: 'bg-blue-100'
  },
  {
    id: 'neon-edge',
    name: 'Neon Edge',
    description: 'Vibrant accent',
    category: 'fun',
    borderStyle: 'border-2 border-crd-green shadow-lg shadow-crd-green/20',
    backgroundColor: 'bg-gray-900',
    textColor: 'text-white',
    accentColor: 'bg-crd-green/10'
  },
  {
    id: 'warm-cream',
    name: 'Warm Cream',
    description: 'Cozy and inviting',
    category: 'minimal',
    borderStyle: 'border-2 border-orange-200',
    backgroundColor: 'bg-orange-50',
    textColor: 'text-orange-900',
    accentColor: 'bg-orange-100'
  }
];

interface FrameCarouselProps {
  selectedFrame?: string;
  uploadedImage?: string;
  onFrameSelect: (frameId: string) => void;
  onImageUpload: (imageUrl: string) => void;
}

export const MinimalistFrameCarousel: React.FC<FrameCarouselProps> = ({
  selectedFrame,
  uploadedImage,
  onFrameSelect,
  onImageUpload
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    
    const file = acceptedFiles[0];
    const imageUrl = URL.createObjectURL(file);
    onImageUpload(imageUrl);
    toast.success('Image uploaded!');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    noClick: true
  });

  const nextFrame = () => {
    const newIndex = (currentIndex + 1) % MINIMALIST_FRAMES.length;
    setCurrentIndex(newIndex);
    onFrameSelect(MINIMALIST_FRAMES[newIndex].id);
  };

  const prevFrame = () => {
    const newIndex = currentIndex === 0 ? MINIMALIST_FRAMES.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onFrameSelect(MINIMALIST_FRAMES[newIndex].id);
  };

  const goToFrame = (index: number) => {
    setCurrentIndex(index);
    onFrameSelect(MINIMALIST_FRAMES[index].id);
  };

  useEffect(() => {
    if (!selectedFrame && MINIMALIST_FRAMES.length > 0) {
      onFrameSelect(MINIMALIST_FRAMES[0].id);
    }
  }, [selectedFrame, onFrameSelect]);

  const currentFrame = MINIMALIST_FRAMES[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Carousel Container */}
      <div className="relative" {...getRootProps()}>
        <input {...getInputProps()} />
        
        {/* Main Frame Display */}
        <div className="flex items-center justify-center mb-8">
          {/* Previous Frame Preview */}
          <div 
            className="hidden md:block opacity-30 scale-75 transform -translate-x-4 cursor-pointer hover:opacity-50 transition-all"
            onClick={prevFrame}
          >
            <FramePreview 
              frame={MINIMALIST_FRAMES[currentIndex === 0 ? MINIMALIST_FRAMES.length - 1 : currentIndex - 1]}
              imageUrl={uploadedImage}
              size="small"
            />
          </div>

          {/* Current Frame */}
          <div className="mx-8 transform scale-110 z-10">
            <FramePreview 
              frame={currentFrame}
              imageUrl={uploadedImage}
              size="large"
              isDragActive={isDragActive}
            />
          </div>

          {/* Next Frame Preview */}
          <div 
            className="hidden md:block opacity-30 scale-75 transform translate-x-4 cursor-pointer hover:opacity-50 transition-all"
            onClick={nextFrame}
          >
            <FramePreview 
              frame={MINIMALIST_FRAMES[(currentIndex + 1) % MINIMALIST_FRAMES.length]}
              imageUrl={uploadedImage}
              size="small"
            />
          </div>
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={prevFrame}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={nextFrame}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Frame Info */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">{currentFrame.name}</h3>
        <p className="text-gray-400">{currentFrame.description}</p>
        <span className="inline-block mt-2 px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm capitalize">
          {currentFrame.category}
        </span>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center space-x-2 mb-6">
        {MINIMALIST_FRAMES.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-crd-green' : 'bg-gray-600 hover:bg-gray-500'
            }`}
            onClick={() => goToFrame(index)}
          />
        ))}
      </div>

      {/* Upload Prompt */}
      {!uploadedImage && (
        <div className="text-center p-6 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/50">
          <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-300 mb-2">Drop your image here or click to upload</p>
          <p className="text-gray-500 text-sm">Your image will appear in the selected frame above</p>
        </div>
      )}
    </div>
  );
};

interface FramePreviewProps {
  frame: MinimalistFrame;
  imageUrl?: string;
  size: 'small' | 'large';
  isDragActive?: boolean;
}

const FramePreview: React.FC<FramePreviewProps> = ({ frame, imageUrl, size, isDragActive }) => {
  const dimensions = size === 'large' ? 'w-64 h-80' : 'w-32 h-40';
  
  return (
    <div className={`${dimensions} relative ${frame.borderStyle} ${frame.backgroundColor} overflow-hidden transition-all duration-300 ${
      isDragActive ? 'ring-2 ring-crd-green ring-opacity-50' : ''
    }`}>
      {/* Image Area */}
      <div className="w-full h-3/4 relative overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Your card" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full ${frame.accentColor} flex items-center justify-center`}>
            <div className="text-center">
              <Upload className={`w-6 h-6 mx-auto mb-2 ${frame.textColor} opacity-50`} />
              <p className={`text-xs ${frame.textColor} opacity-50`}>Your Image</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Text Area */}
      <div className="w-full h-1/4 p-2 flex flex-col justify-center">
        <h4 className={`${frame.textColor} font-semibold text-sm text-center truncate`}>
          Your Card Title
        </h4>
        <p className={`${frame.textColor} opacity-70 text-xs text-center truncate`}>
          Description
        </p>
      </div>
    </div>
  );
};
