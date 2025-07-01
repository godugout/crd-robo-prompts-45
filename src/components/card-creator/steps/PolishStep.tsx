
import React from 'react';
import { Wand2, Sparkles } from 'lucide-react';
import { Typography } from '@/components/ui/design-system';

export const PolishStep: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="space-y-4">
        <Typography variant="h3" className="mb-4">
          Add Some Magic
        </Typography>
        <Typography variant="body" className="text-crd-lightGray">
          Your card looks great! You can add effects or adjustments here, or continue to preview.
        </Typography>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#353945] rounded-lg border border-crd-mediumGray">
          <Wand2 className="w-8 h-8 mx-auto mb-2 text-crd-green" />
          <h4 className="text-white font-medium mb-1">Quick Effects</h4>
          <p className="text-crd-lightGray text-sm">Add instant visual polish</p>
        </div>
        
        <div className="p-4 bg-[#353945] rounded-lg border border-crd-mediumGray">
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-crd-green" />
          <h4 className="text-white font-medium mb-1">Fine Adjustments</h4>
          <p className="text-crd-lightGray text-sm">Perfect positioning & colors</p>
        </div>
      </div>
    </div>
  );
};
