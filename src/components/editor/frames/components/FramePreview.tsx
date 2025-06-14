
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
  size: 'small' | 'large';
  isDragActive?: boolean;
}

export const FramePreview: React.FC<FramePreviewProps> = ({ 
  frame, 
  imageUrl, 
  size, 
  isDragActive 
}) => {
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
