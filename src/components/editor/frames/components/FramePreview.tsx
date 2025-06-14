
import React from 'react';
import { Upload } from 'lucide-react';

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

interface FramePreviewProps {
  frame: MinimalistFrame;
  imageUrl?: string;
  size: 'small' | 'medium' | 'large';
  isDragActive?: boolean;
}

export const FramePreview: React.FC<FramePreviewProps> = ({ 
  frame, 
  imageUrl, 
  size, 
  isDragActive 
}) => {
  const iconSize = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const textSize = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const subtextSize = {
    small: 'text-xs',
    medium: 'text-xs',
    large: 'text-sm'
  };

  const padding = {
    small: 'p-1',
    medium: 'p-2',
    large: 'p-3'
  };
  
  return (
    <div 
      className={`relative ${frame.borderStyle} ${frame.backgroundColor} overflow-hidden transition-all duration-300 w-full h-full ${
        isDragActive ? 'ring-2 ring-crd-green ring-opacity-50' : ''
      }`}
    >
      {/* Image Area - Takes up most of the card space */}
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
              <Upload className={`${iconSize[size]} mx-auto mb-1 ${frame.textColor} opacity-50`} />
              <p className={`${subtextSize[size]} ${frame.textColor} opacity-50`}>Your Image</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Text Area - Compact bottom section */}
      <div className={`w-full h-1/4 ${padding[size]} flex flex-col justify-center`}>
        <h4 className={`${frame.textColor} font-semibold ${textSize[size]} text-center truncate leading-tight`}>
          Your Card Title
        </h4>
        <p className={`${frame.textColor} opacity-70 ${subtextSize[size]} text-center truncate leading-tight`}>
          Description
        </p>
      </div>
    </div>
  );
};
