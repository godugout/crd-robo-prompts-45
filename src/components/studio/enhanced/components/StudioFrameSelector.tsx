
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles, Gem, Chrome } from 'lucide-react';
import { STUDIO_CARD_FRAMES } from '../frames/CardFrameConfigs';
import { toast } from 'sonner';

interface StudioFrameSelectorProps {
  selectedFrame?: string;
  onFrameSelect: (frameId: string) => void;
}

const getFrameIcon = (frameId: string) => {
  switch (frameId) {
    case 'classic-sports': return <Sparkles className="w-4 h-4" />;
    case 'vintage-ornate': return <Crown className="w-4 h-4" />;
    case 'holographic-modern': return <Gem className="w-4 h-4" />;
    case 'chrome-edition': return <Chrome className="w-4 h-4" />;
    default: return <Sparkles className="w-4 h-4" />;
  }
};

const getFramePreviewStyle = (frameId: string) => {
  const frame = STUDIO_CARD_FRAMES.find(f => f.id === frameId);
  if (!frame) return {};
  
  return {
    background: frame.background.type === 'gradient' 
      ? `linear-gradient(135deg, ${frame.background.colors.join(', ')})`
      : frame.background.colors[0]
  };
};

export const StudioFrameSelector: React.FC<StudioFrameSelectorProps> = ({
  selectedFrame,
  onFrameSelect
}) => {
  const handleFrameClick = (frameId: string, frameName: string) => {
    onFrameSelect(frameId);
    toast.success(`Applied ${frameName} frame`);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-white font-semibold text-lg mb-2">Choose Your Frame</h3>
        <p className="text-crd-lightGray text-sm">
          Select a professional card frame design
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STUDIO_CARD_FRAMES.map((frame) => (
          <div
            key={frame.id}
            className={`relative cursor-pointer group transition-all duration-200 ${
              selectedFrame === frame.id 
                ? 'ring-2 ring-crd-green scale-105' 
                : 'hover:scale-102'
            }`}
            onClick={() => handleFrameClick(frame.id, frame.name)}
          >
            {/* Frame Preview */}
            <div 
              className="aspect-[3/4] rounded-lg border-2 border-editor-border group-hover:border-crd-green/50 transition-colors overflow-hidden"
              style={getFramePreviewStyle(frame.id)}
            >
              {/* Mock card layout */}
              <div className="relative w-full h-full p-2">
                {/* Outer border simulation */}
                <div 
                  className="absolute inset-1 rounded border-2"
                  style={{ borderColor: frame.borders.outer?.color }}
                />
                
                {/* Inner content area */}
                <div className="absolute inset-3 bg-white/20 rounded flex flex-col">
                  {/* Top emblem area */}
                  <div className="h-4 flex items-center justify-center">
                    <div 
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ 
                        color: frame.emblem?.color,
                        backgroundColor: 'rgba(0,0,0,0.3)'
                      }}
                    >
                      {frame.emblem?.text.split(' ')[0]}
                    </div>
                  </div>
                  
                  {/* Image area simulation */}
                  <div className="flex-1 mx-2 my-1 bg-gray-400/50 rounded flex items-center justify-center">
                    <div className="w-6 h-4 bg-white/40 rounded"></div>
                  </div>
                  
                  {/* Text area simulation */}
                  <div className="h-6 flex flex-col items-center justify-center px-2">
                    <div 
                      className="w-12 h-1.5 rounded mb-0.5"
                      style={{ backgroundColor: frame.textStyles.title.color }}
                    />
                    <div 
                      className="w-8 h-1 rounded"
                      style={{ backgroundColor: frame.textStyles.subtitle.color }}
                    />
                  </div>
                </div>

                {/* Corner decorations */}
                {frame.corners && (
                  <>
                    <div 
                      className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 rounded-tl"
                      style={{ borderColor: frame.corners.color }}
                    />
                    <div 
                      className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 rounded-tr"
                      style={{ borderColor: frame.corners.color }}
                    />
                    <div 
                      className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 rounded-bl"
                      style={{ borderColor: frame.corners.color }}
                    />
                    <div 
                      className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 rounded-br"
                      style={{ borderColor: frame.corners.color }}
                    />
                  </>
                )}
              </div>
              
              {/* Selected indicator */}
              {selectedFrame === frame.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-full" />
                </div>
              )}
            </div>

            {/* Frame Info */}
            <div className="mt-2 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {getFrameIcon(frame.id)}
                <p className="text-white font-medium text-sm">{frame.name}</p>
              </div>
              
              <div className="flex items-center justify-center gap-1">
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-white/10 text-white/70"
                >
                  {frame.background.type}
                </Badge>
                {frame.corners && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-white/10 text-white/70"
                  >
                    {frame.corners.style}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Tip */}
      <div className="mt-6 p-3 bg-crd-green/10 border border-crd-green/20 rounded-lg">
        <p className="text-crd-green text-sm font-medium mb-1">💡 Pro Tip</p>
        <p className="text-white/80 text-xs">
          After selecting a frame, you can adjust image positioning with the "Adjust Image" tool in the preview.
        </p>
      </div>
    </div>
  );
};
