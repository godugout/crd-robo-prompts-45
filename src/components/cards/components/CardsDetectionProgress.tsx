
import React from 'react';
import { Loader2, Search, Sparkles } from 'lucide-react';

interface CardsDetectionProgressProps {
  isProcessing: boolean;
}

export const CardsDetectionProgress: React.FC<CardsDetectionProgressProps> = ({ isProcessing }) => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 rounded-full bg-crd-blue/20 flex items-center justify-center mx-auto mb-6">
        {isProcessing ? (
          <Loader2 className="w-10 h-10 text-crd-blue animate-spin" />
        ) : (
          <Search className="w-10 h-10 text-crd-blue" />
        )}
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4">
        {isProcessing ? 'Analyzing Your Images...' : 'Ready to Analyze'}
      </h3>
      
      <p className="text-crd-lightGray max-w-lg mx-auto mb-6">
        {isProcessing 
          ? 'Our AI is scanning your images to detect individual trading cards. This may take a moment for high-resolution images.'
          : 'Upload images to begin AI-powered card detection.'
        }
      </p>

      {isProcessing && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center p-4">
            <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-crd-lightGray">Detecting card boundaries</p>
          </div>
          <div className="text-center p-4">
            <Sparkles className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-crd-lightGray">Applying perspective correction</p>
          </div>
          <div className="text-center p-4">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-crd-lightGray">Enhancing image quality</p>
          </div>
        </div>
      )}
    </div>
  );
};
