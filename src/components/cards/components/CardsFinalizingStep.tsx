
import React from 'react';
import { Loader2, Sparkles, Wand2, Palette } from 'lucide-react';

interface CardsFinalizingStepProps {
  selectedCards: number;
}

export const CardsFinalizingStep: React.FC<CardsFinalizingStepProps> = ({ selectedCards }) => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 rounded-full bg-crd-green/20 flex items-center justify-center mx-auto mb-6">
        <Loader2 className="w-10 h-10 text-crd-green animate-spin" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4">Creating Your CRDs...</h3>
      
      <p className="text-crd-lightGray max-w-lg mx-auto mb-6">
        We're processing {selectedCards} selected cards and minting them as Cardshow CRDs. 
        Each card is being enhanced and prepared for your collection.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div className="text-center p-4">
          <Wand2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-sm text-crd-lightGray">Enhancing image quality</p>
        </div>
        <div className="text-center p-4">
          <Palette className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-sm text-crd-lightGray">Applying CRD styling</p>
        </div>
        <div className="text-center p-4">
          <Sparkles className="w-8 h-8 text-crd-green mx-auto mb-2" />
          <p className="text-sm text-crd-lightGray">Adding to collection</p>
        </div>
      </div>
    </div>
  );
};
