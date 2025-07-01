
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Save, Eye, Layers } from 'lucide-react';

interface CRDFrameBuilderProps {
  selectedLayerId: string;
  hiddenLayers: Set<string>;
}

export const CRDFrameBuilder: React.FC<CRDFrameBuilderProps> = ({
  selectedLayerId,
  hiddenLayers
}) => {
  const [selectedFrameType, setSelectedFrameType] = useState<'classic' | 'modern' | 'minimal'>('classic');

  const frameTypes = [
    {
      id: 'classic' as const,
      name: 'Classic Card',
      description: 'Traditional trading card layout with borders and stats',
      preview: '🎴'
    },
    {
      id: 'modern' as const,
      name: 'Modern Frame',
      description: 'Clean, contemporary design with subtle effects',
      preview: '🖼️'
    },
    {
      id: 'minimal' as const,
      name: 'Minimal Style',
      description: 'Simple, focus on content with minimal decoration',
      preview: '⬜'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">CRD Frame Builder</h3>
            <p className="text-slate-400">
              Transform your PSD layers into a professional CRD frame
            </p>
          </div>
          <Sparkles className="w-8 h-8 text-crd-green" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">Layer Status</span>
            </div>
            <div className="text-sm text-slate-300">
              Selected: {selectedLayerId || 'None'}
            </div>
            <div className="text-sm text-slate-300">
              Hidden: {hiddenLayers.size} layers
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">Frame Ready</span>
            </div>
            <Badge variant="outline" className="text-crd-green border-crd-green">
              Ready to Build
            </Badge>
          </div>
        </div>
      </Card>

      {/* Frame Type Selection */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <h4 className="text-md font-medium text-white mb-4">Choose Frame Style</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {frameTypes.map((frame) => (
            <button
              key={frame.id}
              onClick={() => setSelectedFrameType(frame.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedFrameType === frame.id
                  ? 'border-crd-green bg-crd-green/10'
                  : 'border-slate-600 bg-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="text-2xl mb-2">{frame.preview}</div>
              <div className="text-sm font-medium text-white mb-1">{frame.name}</div>
              <div className="text-xs text-slate-400">{frame.description}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Build Actions */}
      <Card className="bg-slate-700 border-slate-600 p-4">
        <h4 className="text-md font-medium text-white mb-3">Build Your CRD</h4>
        
        <div className="space-y-3">
          <p className="text-sm text-slate-400">
            Your reconstructed layers will be composed into a {frameTypes.find(f => f.id === selectedFrameType)?.name.toLowerCase()} 
            ready for the CRD Catalog.
          </p>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-slate-500 text-slate-300 hover:bg-slate-600"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Frame
            </Button>
            
            <Button
              className="flex-1 bg-crd-green text-black hover:bg-crd-green/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Build & Save
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
