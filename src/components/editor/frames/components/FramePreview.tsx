
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
  const dimensions = {
    small: { width: 120, height: 168 },
    medium: { width: 180, height: 252 },
    large: { width: 400, height: 560 }
  };

  const iconSize = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const textSize = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl'
  };

  const subtextSize = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const padding = {
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6'
  };

  const { width, height } = dimensions[size];
  
  return (
    <div 
      className={`relative ${frame.borderStyle} ${frame.backgroundColor} overflow-hidden transition-all duration-300 ${
        isDragActive ? 'ring-2 ring-crd-green ring-opacity-50' : ''
      }`}
      style={{ width, height }}
    >
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
              <Upload className={`${iconSize[size]} mx-auto mb-2 ${frame.textColor} opacity-50`} />
              <p className={`${subtextSize[size]} ${frame.textColor} opacity-50`}>Your Image</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Text Area */}
      <div className={`w-full h-1/4 ${padding[size]} flex flex-col justify-center`}>
        <h4 className={`${frame.textColor} font-semibold ${textSize[size]} text-center truncate`}>
          Your Card Title
        </h4>
        <p className={`${frame.textColor} opacity-70 ${subtextSize[size]} text-center truncate`}>
          Description
        </p>
      </div>
    </div>
  );
};
