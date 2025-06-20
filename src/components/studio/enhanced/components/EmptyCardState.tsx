
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImagePlus } from 'lucide-react';

interface EmptyCardStateProps {
  onImageUpload?: () => void;
}

export const EmptyCardState: React.FC<EmptyCardStateProps> = ({ onImageUpload }) => {
  return (
    <Card className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 border-white/20 rounded-3xl overflow-hidden shadow-2xl">
      <div 
        className="w-full h-full rounded-2xl border-2 border-dashed border-white/30 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-crd-green/50 hover:bg-crd-green/5"
        onClick={onImageUpload}
      >
        <div className="text-center text-white/80 max-w-xs px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
            <ImagePlus className="w-8 h-8 text-crd-green" />
          </div>
          <h3 className="text-lg font-bold mb-2">Upload Your Image</h3>
          <p className="text-sm mb-4 text-white/70">
            Add your photo to start creating
          </p>
          <Button 
            className="bg-crd-green hover:bg-crd-green/90 text-black font-bold px-6 py-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onImageUpload?.();
            }}
          >
            Browse Files
          </Button>
        </div>
      </div>
    </Card>
  );
};
