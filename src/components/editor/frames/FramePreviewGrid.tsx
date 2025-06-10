
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Settings } from 'lucide-react';
import { ENHANCED_FRAME_TEMPLATES } from './EnhancedFrameTemplates';
import { FrameCustomizer } from './FrameCustomizer';
import { FrameConfiguration } from './ModularFrameBuilder';

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
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customFrame, setCustomFrame] = useState<FrameConfiguration | null>(null);

  const frameComponents = ENHANCED_FRAME_TEMPLATES.reduce((acc, template) => {
    acc[template.id] = template.preview_component;
    return acc;
  }, {} as Record<string, React.ComponentType<any>>);

  const filteredFrames = ENHANCED_FRAME_TEMPLATES.filter(frame =>
    frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    frame.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    frame.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomFrameChange = (config: FrameConfiguration) => {
    setCustomFrame(config);
  };

  if (showCustomizer) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium">Customize Frame</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCustomizer(false)}
            className="border-editor-border text-white"
          >
            Back to Gallery
          </Button>
        </div>
        <FrameCustomizer
          initialConfig={ENHANCED_FRAME_TEMPLATES[0].config}
          onConfigChange={handleCustomFrameChange}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Custom Frame Option */}
      <Card className="cursor-pointer bg-editor-dark border-editor-border hover:bg-editor-tool transition-colors">
        <CardContent className="p-4">
          <div className="aspect-[3/4] mb-4 relative overflow-hidden rounded-lg bg-gradient-to-br from-crd-purple to-crd-blue flex items-center justify-center">
            <div className="text-center">
              <Settings className="w-8 h-8 text-white mb-2 mx-auto" />
              <span className="text-white text-sm font-medium">Custom Frame</span>
            </div>
          </div>
          <div>
            <h3 className="text-crd-white font-semibold text-sm mb-2">Create Custom</h3>
            <p className="text-crd-lightGray text-xs mb-3">Design your own frame with modular elements</p>
            <Button
              onClick={() => setShowCustomizer(true)}
              className="w-full bg-crd-purple hover:bg-crd-purple/90 text-white"
              size="sm"
            >
              Customize Frame
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Frame Templates Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredFrames.map((frame) => {
          const FrameComponent = frameComponents[frame.id];
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
                      Layered
                    </Badge>
                    <Badge variant="outline" className="text-xs border-crd-green/30 text-crd-green">
                      Authentic
                    </Badge>
                    {frame.category === 'Vintage' && (
                      <Badge variant="outline" className="text-xs border-crd-orange/30 text-crd-orange">
                        1987 Style
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
