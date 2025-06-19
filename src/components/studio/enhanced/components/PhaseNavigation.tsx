
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image, Sparkles, Layers, Download } from 'lucide-react';

type StudioPhase = 'upload' | 'frames' | 'effects' | 'layers' | 'export';

interface PhaseNavigationProps {
  currentPhase: StudioPhase;
  uploadedImage: string;
  selectedFrame: string;
  onPhaseChange: (phase: StudioPhase) => void;
}

export const PhaseNavigation: React.FC<PhaseNavigationProps> = ({
  currentPhase,
  uploadedImage,
  selectedFrame,
  onPhaseChange
}) => {
  const phases = [
    { phase: 'upload' as StudioPhase, icon: Upload, label: 'Upload' },
    { phase: 'frames' as StudioPhase, icon: Image, label: 'Frames' },
    { phase: 'effects' as StudioPhase, icon: Sparkles, label: 'Effects' },
    { phase: 'layers' as StudioPhase, icon: Layers, label: 'Layers' },
    { phase: 'export' as StudioPhase, icon: Download, label: 'Export' }
  ];

  return (
    <div className="w-16 bg-editor-dark border-r border-editor-border flex flex-col items-center py-4 space-y-4">
      {phases.map(({ phase, icon: Icon, label }) => {
        const isDisabled = (phase === 'frames' && !uploadedImage) ||
                          (phase === 'effects' && (!uploadedImage || !selectedFrame));
        
        return (
          <Button
            key={phase}
            variant="ghost"
            size="sm"
            onClick={() => !isDisabled && onPhaseChange(phase)}
            disabled={isDisabled}
            className={`w-12 h-12 p-0 rounded-lg transition-all ${
              currentPhase === phase
                ? 'bg-crd-green text-black'
                : 'text-white hover:bg-white/10'
            } ${isDisabled ? 'opacity-30 cursor-not-allowed' : ''}`}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </Button>
        );
      })}
    </div>
  );
};
