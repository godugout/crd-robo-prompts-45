
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Settings, Layers, Zap } from 'lucide-react';

interface DebugInfoPanelProps {
  selectedFrame: string;
  uploadedImage: string;
  currentPhase: string;
  cardData: {
    rating: number;
    views: number;
    editions: number;
    marketPrice: number;
  };
}

export const DebugInfoPanel: React.FC<DebugInfoPanelProps> = ({
  selectedFrame,
  uploadedImage,
  currentPhase,
  cardData
}) => {
  const debugInfo = [
    { label: 'Frame Template', value: selectedFrame, icon: Layers },
    { label: 'Image Status', value: uploadedImage ? 'Loaded' : 'Pending', icon: Activity },
    { label: 'Current Phase', value: currentPhase.toUpperCase(), icon: Settings },
    { label: 'Processing State', value: 'Real-time', icon: Zap },
  ];

  const liveStats = [
    { metric: 'Resolution', value: '300 DPI' },
    { metric: 'Dimensions', value: '2.5" × 3.5"' },
    { metric: 'Color Profile', value: 'sRGB' },
    { metric: 'Quality Score', value: `${Math.round(cardData.rating * 10)}%` },
  ];

  return (
    <div className="h-full flex flex-col bg-cardshow-bg-default">
      {/* Header */}
      <div className="p-4 border-b border-cardshow-gray-500">
        <h2 className="text-lg font-semibold text-white">Live Debug Info</h2>
        <p className="text-sm text-cardshow-gray-200 mt-1">Real-time creation parameters</p>
      </div>

      {/* Debug Information */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* System Status */}
        <Card className="cardshow-card p-4">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cardshow-collections" />
            System Status
          </h3>
          <div className="space-y-2">
            {debugInfo.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-3 h-3 text-cardshow-gray-300" />
                    <span className="text-sm text-cardshow-gray-200">{item.label}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.value}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Live Statistics */}
        <Card className="cardshow-card p-4">
          <h3 className="text-white font-medium mb-3">Live Statistics</h3>
          <div className="grid grid-cols-2 gap-3">
            {liveStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold text-cardshow-cards">{stat.value}</div>
                <div className="text-xs text-cardshow-gray-300">{stat.metric}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Processing Log */}
        <Card className="cardshow-card p-4">
          <h3 className="text-white font-medium mb-3">Processing Log</h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="text-cardshow-collections">✓ Studio initialized</div>
            <div className="text-cardshow-collections">✓ Frame system loaded</div>
            <div className="text-cardshow-gray-300">○ Waiting for image upload...</div>
            {uploadedImage && (
              <>
                <div className="text-cardshow-collections">✓ Image processed</div>
                <div className="text-cardshow-collections">✓ Preview generated</div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
