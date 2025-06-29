
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Eye, Copy, DollarSign, TrendingUp, Upload, Square, Sparkles, Wrench, CheckCircle } from 'lucide-react';

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
    { id: 'upload', name: 'Upload', icon: Upload, color: 'text-cardshow-cards' },
    { id: 'frame', name: 'Frame', icon: Square, color: 'text-cardshow-shops' },
    { id: 'effects', name: 'Effects', icon: Sparkles, color: 'text-cardshow-collections' },
    { id: 'studio', name: 'Studio', icon: Wrench, color: 'text-cardshow-currency' },
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-cardshow-gray-500">
        <h2 className="text-lg font-semibold text-white">Card Statistics & Workflow</h2>
        <p className="text-sm text-cardshow-gray-200 mt-1">Professional creation tools</p>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Card Statistics */}
        <Card className="cardshow-card p-4">
          <h3 className="text-white font-medium mb-3">Card Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Eye className="w-4 h-4 text-cardshow-shops mr-1" />
                <span className="text-lg font-bold text-white">{cardData.views.toLocaleString()}</span>
              </div>
              <div className="text-xs text-cardshow-gray-300">Views</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Copy className="w-4 h-4 text-cardshow-collections mr-1" />
                <span className="text-lg font-bold text-white">{cardData.editions}</span>
              </div>
              <div className="text-xs text-cardshow-gray-300">Editions</div>
            </div>
          </div>
        </Card>

        {/* Market Preview */}
        <Card className="cardshow-card p-4">
          <h3 className="text-white font-medium mb-3">Market Preview</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-cardshow-gray-200">Est. Value</span>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-cardshow-currency" />
                <span className="font-bold text-cardshow-currency">${cardData.marketPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-cardshow-gray-200">Trending</span>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5%
              </Badge>
            </div>
          </div>
        </Card>

        {/* Professional Workflow */}
        <Card className="cardshow-card p-4">
          <h3 className="text-white font-medium mb-3">Professional Workflow</h3>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-cardshow-gray-300 mb-1">
              <span>Progress</span>
              <span>{Math.round(getPhaseProgress())}% Complete</span>
            </div>
            <Progress value={getPhaseProgress()} className="h-2" />
          </div>

          {/* Phase List */}
          <div className="space-y-2">
            {phases.map((phase, index) => {
              const PhaseIcon = phase.icon;
              const isCurrent = currentPhase === phase.id;
              const isCompleted = isPhaseCompleted(phase.id);
              
              return (
                <Button
                  key={phase.id}
                  variant={isCurrent ? "default" : "ghost"}
                  className={`w-full justify-start h-auto p-3 ${
                    isCurrent ? 'bg-cardshow-cards hover:bg-cardshow-cards/90' : 
                    isCompleted ? 'bg-cardshow-collections/20 hover:bg-cardshow-collections/30' : 
                    'hover:bg-cardshow-gray-700/50'
                  }`}
                  onClick={() => onPhaseChange(phase.id as any)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-cardshow-collections" />
                      ) : (
                        <PhaseIcon className={`w-4 h-4 ${isCurrent ? 'text-white' : phase.color}`} />
                      )}
                      <span className={`font-medium ${isCurrent ? 'text-white' : isCompleted ? 'text-cardshow-collections' : 'text-cardshow-gray-200'}`}>
                        {phase.name}
                      </span>
                    </div>
                    <div className="ml-auto">
                      {isCurrent && <Badge variant="secondary" className="text-xs">Active</Badge>}
                      {isCompleted && <Badge variant="secondary" className="text-xs bg-cardshow-collections/20 text-cardshow-collections">Done</Badge>}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Pro Tips */}
        <Card className="cardshow-card p-4">
          <h3 className="text-white font-medium mb-3">Pro Tips</h3>
          <div className="space-y-2 text-sm text-cardshow-gray-200">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-cardshow-cards rounded-full mt-2 flex-shrink-0"></div>
              <span>Use high-resolution images (300 DPI) for best results</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-cardshow-collections rounded-full mt-2 flex-shrink-0"></div>
              <span>Professional frames enhance perceived value</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-cardshow-shops rounded-full mt-2 flex-shrink-0"></div>
              <span>Preview in 3D mode before finalizing</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
