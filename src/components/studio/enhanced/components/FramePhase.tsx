
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { FrameRenderer } from '@/components/editor/frames/FrameRenderer';

type CardOrientation = 'portrait' | 'landscape' | 'square';

interface FramePhaseProps {
  selectedFrame: string;
  onFrameSelect: (frameId: string) => void;
  orientation: CardOrientation;
}

const frameOptions = [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    description: 'Traditional sports card design',
    preview: '/api/placeholder/120/160',
    category: 'Sports'
  },
  {
    id: 'holographic-modern',
    name: 'Holographic Modern',
    description: 'Modern design with holographic effects',
    preview: '/api/placeholder/120/160',
    category: 'Modern'
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Ornate',
    description: 'Classic vintage styling with ornate borders',
    preview: '/api/placeholder/120/160',
    category: 'Vintage'
  },
  {
    id: 'donruss-special',
    name: 'Donruss Special',
    description: 'Special edition Donruss-style frame',
    preview: '/api/placeholder/120/160',
    category: 'Special'
  },
  {
    id: 'donruss-rookie',
    name: 'Donruss Rookie',
    description: 'Rookie card edition frame',
    preview: '/api/placeholder/120/160',
    category: 'Rookie'
  },
  {
    id: 'chrome-edition',
    name: 'Chrome Edition',
    description: 'Metallic chrome-style frame',
    preview: '/api/placeholder/120/160',
    category: 'Chrome'
  }
];

export const FramePhase: React.FC<FramePhaseProps> = ({
  selectedFrame,
  onFrameSelect,
  orientation
}) => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-white text-xl font-semibold mb-2">Choose a Frame</h3>
        <p className="text-crd-lightGray text-sm">
          Select a frame style that matches your card's theme
        </p>
      </div>

      {/* Selected Frame Preview */}
      {selectedFrame && (
        <div className="bg-editor-tool rounded-lg p-4 border border-editor-border">
          <h4 className="text-white font-medium mb-3">Selected Frame</h4>
          <div className="flex items-center gap-3">
            <div className="w-16 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded border-2 border-crd-green flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-crd-green" />
            </div>
            <div>
              <p className="text-white font-medium">
                {frameOptions.find(f => f.id === selectedFrame)?.name || selectedFrame}
              </p>
              <p className="text-crd-lightGray text-sm">
                {frameOptions.find(f => f.id === selectedFrame)?.description || 'Custom frame'}
              </p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-crd-green ml-auto" />
          </div>
        </div>
      )}

      {/* Frame Grid */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Available Frames</h4>
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {frameOptions.map((frame) => (
            <Card 
              key={frame.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedFrame === frame.id
                  ? 'bg-crd-green/10 border-crd-green shadow-lg'
                  : 'bg-editor-tool border-editor-border hover:border-crd-green/50 hover:bg-crd-green/5'
              }`}
              onClick={() => onFrameSelect(frame.id)}
            >
              <CardContent className="p-3">
                <div className="relative mb-3">
                  {/* Frame Preview - Simple geometric representation */}
                  <div className={`w-full h-24 rounded bg-gradient-to-br ${
                    frame.category === 'Sports' ? 'from-blue-600 to-blue-800' :
                    frame.category === 'Modern' ? 'from-purple-600 to-pink-600' :
                    frame.category === 'Vintage' ? 'from-amber-600 to-orange-700' :
                    frame.category === 'Special' ? 'from-red-600 to-red-800' :
                    frame.category === 'Rookie' ? 'from-green-600 to-green-800' :
                    frame.category === 'Chrome' ? 'from-gray-400 to-gray-600' :
                    'from-gray-600 to-gray-800'
                  } flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-2 border-2 border-white/30 rounded"></div>
                    <span className="text-white/80 text-xs font-medium">{frame.category}</span>
                    
                    {selectedFrame === frame.id && (
                      <div className="absolute top-1 right-1">
                        <CheckCircle2 className="w-4 h-4 text-crd-green bg-black rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <h5 className="text-white text-sm font-medium mb-1">{frame.name}</h5>
                  <p className="text-crd-lightGray text-xs leading-tight">{frame.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-2">
        <h4 className="text-white font-medium">Frame Tips:</h4>
        <ul className="text-crd-lightGray text-sm space-y-1">
          <li>• Sports frames work best for athletic photos</li>
          <li>• Holographic frames add premium visual effects</li>
          <li>• Vintage frames suit classic portraits</li>
          <li>• Chrome frames provide metallic finishes</li>
        </ul>
      </div>

      {/* Next Step Hint */}
      {selectedFrame && (
        <div className="p-4 bg-crd-green/10 border border-crd-green/20 rounded-lg">
          <p className="text-crd-green text-sm font-medium">✓ Frame selected!</p>
          <p className="text-crd-lightGray text-sm">Ready for effects phase - click "Effects" in the sidebar</p>
        </div>
      )}
    </div>
  );
};
