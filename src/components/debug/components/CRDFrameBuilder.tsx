
import React from 'react';
import { Card } from '@/components/ui/card';

interface CRDFrameBuilderProps {
  selectedLayerId: string;
  hiddenLayers: Set<string>;
}

export const CRDFrameBuilder: React.FC<CRDFrameBuilderProps> = ({
  selectedLayerId,
  hiddenLayers
}) => {
  return (
    <div className="space-y-4">
      <Card className="bg-slate-800 border-slate-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-2">CRD Frame Builder</h3>
        <p className="text-slate-400 mb-4">
          Build advanced CRD frames using the layer composition system
        </p>
        
        <div className="space-y-2 text-sm text-slate-300">
          <div>Selected Layer: {selectedLayerId || 'None'}</div>
          <div>Hidden Layers: {hiddenLayers.size}</div>
        </div>
      </Card>

      <Card className="bg-slate-700 border-slate-600 p-4">
        <h4 className="text-md font-medium text-white mb-2">Frame Construction</h4>
        <p className="text-slate-400 text-sm">
          Advanced frame building features will be implemented here based on the CRD specifications.
        </p>
      </Card>
    </div>
  );
};
