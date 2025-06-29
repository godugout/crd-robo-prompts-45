
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Activity, Settings, Layers, Zap } from 'lucide-react';
import { 
  ProfessionalPanel,
  ProfessionalCard,
  ProfessionalStat 
} from '@/components/ui/design-system/professional-components';

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
    <ProfessionalPanel
      header={
        <div>
          <h2 className="text-lg font-semibold text-[#FFFFFF]">Live Debug Info</h2>
          <p className="text-sm text-[#9CA3AF] mt-1">Real-time creation parameters</p>
        </div>
      }
    >
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#0A0A0B]">
        {/* System Status */}
        <ProfessionalCard variant="elevated" context="collections">
          <h3 className="text-[#FFFFFF] font-medium mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#22C55E]" />
            System Status
          </h3>
          <div className="space-y-2">
            {debugInfo.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-3 h-3 text-[#9CA3AF]" />
                    <span className="text-sm text-[#E5E5E7]">{item.label}</span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-[#252526] text-[#E5E5E7] border border-[#404040]"
                  >
                    {item.value}
                  </Badge>
                </div>
              );
            })}
          </div>
        </ProfessionalCard>

        {/* Live Statistics */}
        <ProfessionalCard variant="elevated" context="cards">
          <h3 className="text-[#FFFFFF] font-medium mb-3">Live Statistics</h3>
          <div className="grid grid-cols-2 gap-3">
            {liveStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold text-[#F97316]">{stat.value}</div>
                <div className="text-xs text-[#9CA3AF]">{stat.metric}</div>
              </div>
            ))}
          </div>
        </ProfessionalCard>

        {/* Processing Log */}
        <ProfessionalCard variant="elevated" context="professional">
          <h3 className="text-[#FFFFFF] font-medium mb-3">Processing Log</h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="text-[#22C55E]">✓ Studio initialized</div>
            <div className="text-[#22C55E]">✓ Frame system loaded</div>
            <div className="text-[#9CA3AF]">○ Waiting for image upload...</div>
            {uploadedImage && (
              <>
                <div className="text-[#22C55E]">✓ Image processed</div>
                <div className="text-[#22C55E]">✓ Preview generated</div>
              </>
            )}
          </div>
        </ProfessionalCard>
      </div>
    </ProfessionalPanel>
  );
};
