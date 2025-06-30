
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share2, Eye, Settings } from 'lucide-react';

interface ExportPublishPhaseProps {
  cardData: any;
  onExport: (format: string) => void;
}

export const ExportPublishPhase: React.FC<ExportPublishPhaseProps> = ({
  cardData,
  onExport
}) => {
  const exportFormats = [
    { id: 'png', name: 'PNG', description: 'High quality image', size: '2400x3600px' },
    { id: 'jpg', name: 'JPG', description: 'Compressed image', size: '2400x3600px' },
    { id: 'gif', name: 'GIF', description: 'Animated version', size: '1200x1800px' },
    { id: 'webp', name: 'WebP', description: 'Web optimized', size: '2400x3600px' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="cardshow-hero-text mb-4">Export & Publish</h2>
        <p className="cardshow-body-text max-w-2xl mx-auto">
          Your card is complete! Choose your export format and share your creation with the world.
        </p>
      </div>

      {/* Card Summary */}
      <Card className="bg-cardshow-dark-100 border-cardshow-dark-100">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card Preview */}
            <div className="space-y-4">
              <h3 className="cardshow-section-text">Final Preview</h3>
              <div className="aspect-[3/4] bg-cardshow-dark-100 rounded-lg border-2 border-cardshow-primary/50 flex items-center justify-center">
                <div className="text-center">
                  <Eye className="w-12 h-12 text-cardshow-primary mx-auto mb-2" />
                  <div className="cardshow-body-text">3D Card Preview</div>
                </div>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-6">
              <h3 className="cardshow-section-text">Card Details</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="cardshow-label-text">Frame:</span>
                  <span className="text-cardshow-light font-medium">{cardData.frame?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="cardshow-label-text">Effects:</span>
                  <span className="text-cardshow-light font-medium">
                    {cardData.effects?.length || 0} applied
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="cardshow-label-text">Showcase:</span>
                  <span className="text-cardshow-light font-medium">{cardData.showcase?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="cardshow-label-text">Created:</span>
                  <span className="text-cardshow-light font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-cardshow-dark-100">
                <div className="cardshow-label-text mb-3">Applied Effects:</div>
                <div className="flex flex-wrap gap-2">
                  {cardData.effects?.map((effect: any) => (
                    <Badge key={effect.id} className="bg-cardshow-primary/20 text-cardshow-primary border-cardshow-primary/50">
                      {effect.type} {effect.intensity}%
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {exportFormats.map(format => (
          <Card
            key={format.id}
            className="cursor-pointer hover:ring-1 hover:ring-cardshow-primary/50 transition-all duration-300"
            onClick={() => onExport(format.id)}
          >
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 text-cardshow-primary mx-auto mb-3" />
              <h4 className="font-bold text-cardshow-light text-lg mb-2">
                {format.name}
              </h4>
              <p className="cardshow-body-text text-sm mb-2">
                {format.description}
              </p>
              <div className="cardshow-label-text">
                {format.size}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="cardshow" 
          size="lg"
          className="flex items-center gap-2"
          onClick={() => onExport('png')}
        >
          <Download className="w-5 h-5" />
          Download PNG
        </Button>
        <Button 
          variant="secondary" 
          size="lg"
          className="flex items-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share Creation
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          className="flex items-center gap-2"
        >
          <Settings className="w-5 h-5" />
          Advanced Settings
        </Button>
      </div>
    </div>
  );
};
