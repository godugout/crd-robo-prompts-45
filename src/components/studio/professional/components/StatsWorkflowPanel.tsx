
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Eye, Copy, DollarSign, TrendingUp, Upload, Square, Sparkles, Wrench, CheckCircle } from 'lucide-react';
import { 
  ProfessionalPanel,
  ProfessionalCard,
  ProfessionalButton,
  ProfessionalStat 
} from '@/components/ui/design-system/professional-components';

interface StatsWorkflowPanelProps {
  cardData: {
    rating: number;
    views: number;
    editions: number;
    marketPrice: number;
  };
  currentPhase: 'upload' | 'frame' | 'effects' | 'studio';
  onPhaseChange: (phase: 'upload' | 'frame' | 'effects' | 'studio') => void;
}

export const StatsWorkflowPanel: React.FC<StatsWorkflowPanelProps> = ({
  cardData,
  currentPhase,
  onPhaseChange
}) => {
  const phases = [
    { id: 'upload', name: 'Upload', icon: Upload, context: 'cards' as const },
    { id: 'frame', name: 'Frame', icon: Square, context: 'shops' as const },
    { id: 'effects', name: 'Effects', icon: Sparkles, context: 'collections' as const },
    { id: 'studio', name: 'Studio', icon: Wrench, context: 'currency' as const },
  ];

  const getPhaseProgress = () => {
    const phaseIndex = phases.findIndex(p => p.id === currentPhase);
    return ((phaseIndex + 1) / phases.length) * 100;
  };

  const isPhaseCompleted = (phaseId: string) => {
    const currentIndex = phases.findIndex(p => p.id === currentPhase);
    const phaseIndex = phases.findIndex(p => p.id === phaseId);
    return phaseIndex < currentIndex;
  };

  return (
    <ProfessionalPanel
      header={
        <div>
          <h2 className="text-lg font-semibold text-[#FFFFFF]">Card Statistics & Workflow</h2>
          <p className="text-sm text-[#9CA3AF] mt-1">Professional creation tools</p>
        </div>
      }
    >
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#0A0A0B]">
        {/* Card Statistics */}
        <ProfessionalCard variant="elevated" context="shops">
          <h3 className="text-[#FFFFFF] font-medium mb-3">Card Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <ProfessionalStat
              label="Views"
              value={cardData.views.toLocaleString()}
              icon={<Eye className="w-4 h-4" />}
              context="shops"
            />
            <ProfessionalStat
              label="Editions"
              value={cardData.editions}
              icon={<Copy className="w-4 h-4" />}
              context="collections"
            />
          </div>
        </ProfessionalCard>

        {/* Market Preview */}
        <ProfessionalCard variant="professional" context="currency">
          <h3 className="text-[#FFFFFF] font-medium mb-3">Market Preview</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#E5E5E7]">Est. Value</span>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-[#FACC15]" />
                <span className="font-bold text-[#FACC15]">${cardData.marketPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#E5E5E7]">Trending</span>
              <Badge variant="secondary" className="text-xs bg-[#252526] text-[#22C55E] border border-[#404040]">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5%
              </Badge>
            </div>
          </div>
        </ProfessionalCard>

        {/* Professional Workflow */}
        <ProfessionalCard variant="elevated" context="professional">
          <h3 className="text-[#FFFFFF] font-medium mb-3">Professional Workflow</h3>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
              <span>Progress</span>
              <span>{Math.round(getPhaseProgress())}% Complete</span>
            </div>
            <Progress value={getPhaseProgress()} className="h-2 bg-[#252526]" />
          </div>

          {/* Phase List */}
          <div className="space-y-2">
            {phases.map((phase, index) => {
              const PhaseIcon = phase.icon;
              const isCurrent = currentPhase === phase.id;
              const isCompleted = isPhaseCompleted(phase.id);
              
              return (
                <ProfessionalButton
                  key={phase.id}
                  variant={isCurrent ? "primary" : "ghost"}
                  context={isCurrent ? phase.context : 'none'}
                  className={`w-full justify-start h-auto p-3 ${
                    isCompleted ? 'bg-[#252526] border border-[#22C55E]' : ''
                  }`}
                  onClick={() => onPhaseChange(phase.id as any)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                      ) : (
                        <PhaseIcon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-[#9CA3AF]'}`} />
                      )}
                      <span className={`font-medium ${
                        isCurrent ? 'text-white' : 
                        isCompleted ? 'text-[#22C55E]' : 'text-[#E5E5E7]'
                      }`}>
                        {phase.name}
                      </span>
                    </div>
                    <div className="ml-auto">
                      {isCurrent && <Badge variant="secondary" className="text-xs bg-[#F97316] text-white">Active</Badge>}
                      {isCompleted && <Badge variant="secondary" className="text-xs bg-[#22C55E] text-white">Done</Badge>}
                    </div>
                  </div>
                </ProfessionalButton>
              );
            })}
          </div>
        </ProfessionalCard>

        {/* Pro Tips */}
        <ProfessionalCard variant="glass">
          <h3 className="text-[#FFFFFF] font-medium mb-3">Pro Tips</h3>
          <div className="space-y-2 text-sm text-[#E5E5E7]">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-[#F97316] rounded-full mt-2 flex-shrink-0"></div>
              <span>Use high-resolution images (300 DPI) for best results</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-[#22C55E] rounded-full mt-2 flex-shrink-0"></div>
              <span>Professional frames enhance perceived value</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-[#3B82F6] rounded-full mt-2 flex-shrink-0"></div>
              <span>Preview in 3D mode before finalizing</span>
            </div>
          </div>
        </ProfessionalCard>
      </div>
    </ProfessionalPanel>
  );
};
