
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { 
  ClassicSportsFrame, 
  ModernHolographicFrame, 
  VintageOrnateFrame,
  ENHANCED_FRAME_TEMPLATES 
} from './EnhancedFrameTemplates';

interface FramePreviewGridProps {
  selectedFrame?: string;
  onSelectFrame: (frameId: string) => void;
  searchQuery?: string;
}

export const FramePreviewGrid: React.FC<FramePreviewGridProps> = ({
  selectedFrame,
  onSelectFrame,
  searchQuery = ''
}) => {
  const frameComponents = {
    'classic-sports': ClassicSportsFrame,
    'holographic-modern': ModernHolographicFrame,
    'vintage-ornate': VintageOrnateFrame
  };

  const filteredFrames = ENHANCED_FRAME_TEMPLATES.filter(frame =>
    frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    frame.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      {filteredFrames.map((frame) => {
        const FrameComponent = frameComponents[frame.id as keyof typeof frameComponents];
        const isSelected = selectedFrame === frame.id;
        
        return (
          <Card
            key={frame.id}
            className={`cursor-pointer transition-all duration-300 ${
              isSelected 
                ? 'ring-2 ring-crd-green scale-105 bg-editor-tool' 
                : 'bg-editor-dark hover:bg-editor-tool'
            } border-editor-border`}
            onClick={() => onSelectFrame(frame.id)}
          >
            <CardContent className="p-4">
              {/* Frame Preview */}
              <div className="aspect-[3/4] mb-4 relative overflow-hidden rounded-lg bg-gradient-to-br from-crd-mediumGray to-crd-lightGray">
                <div className="w-full h-full flex items-center justify-center">
                  <FrameComponent 
                    width={180}
                    height={240}
                    title={frame.name.toUpperCase()}
                    subtitle={frame.category}
                  />
                </div>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-crd-dark" />
                  </div>
                )}
              </div>

              {/* Frame Info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-crd-white font-semibold text-sm">{frame.name}</h3>
                  <Badge variant="outline" className="text-xs border-editor-border text-crd-lightGray">
                    {frame.category}
                  </Badge>
                </div>
                
                <p className="text-crd-lightGray text-xs mb-3">{frame.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs border-crd-blue/30 text-crd-blue">
                    Professional
                  </Badge>
                  <Badge variant="outline" className="text-xs border-crd-green/30 text-crd-green">
                    Layered
                  </Badge>
                  <Badge variant="outline" className="text-xs border-crd-purple/30 text-crd-purple">
                    Premium
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
