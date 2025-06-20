
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image, Sparkles, Layers, Download, RotateCcw } from 'lucide-react';

type StudioPhase = 'upload' | 'frames' | 'effects' | 'layers' | 'export';

interface PhaseNavigationProps {
  currentPhase: StudioPhase;
  uploadedImage: string;
  selectedFrame: string;
  onPhaseChange: (phase: StudioPhase) => void;
  onReset?: () => void;
}

export const PhaseNavigation: React.FC<PhaseNavigationProps> = ({
  currentPhase,
  uploadedImage,
  selectedFrame,
  onPhaseChange,
  onReset
}) => {
  const phases = [
    { phase: 'upload' as StudioPhase, icon: Upload, label: 'Upload', description: 'Upload your image' },
    { phase: 'frames' as StudioPhase, icon: Image, label: 'Frames', description: 'Choose a frame style' },
    { phase: 'effects' as StudioPhase, icon: Sparkles, label: 'Effects', description: 'Add premium effects' },
    { phase: 'layers' as StudioPhase, icon: Layers, label: 'Layers', description: 'Manage card layers' },
    { phase: 'export' as StudioPhase, icon: Download, label: 'Export', description: 'Download your card' }
  ];

  const getPhaseStatus = (phase: StudioPhase) => {
    if (phase === currentPhase) return 'current';
    
    switch (phase) {
      case 'upload':
        return uploadedImage ? 'completed' : 'available';
      case 'frames':
        return selectedFrame ? 'completed' : uploadedImage ? 'available' : 'pending';
      case 'effects':
        return (uploadedImage && selectedFrame) ? 'available' : 'pending';
      case 'layers':
        return (uploadedImage && selectedFrame) ? 'available' : 'pending';
      case 'export':
        return (uploadedImage && selectedFrame) ? 'available' : 'pending';
      default:
        return 'available';
    }
  };

  const canNavigateToPhase = (phase: StudioPhase) => {
    const status = getPhaseStatus(phase);
    return status !== 'pending';
  };

  return (
    <div className="w-16 bg-editor-dark border-r border-editor-border flex flex-col items-center py-4 space-y-4">
      {/* Emergency Reset Button */}
      {onReset && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="w-12 h-12 p-0 rounded-lg transition-all text-red-400 hover:bg-red-500/10 hover:text-red-300"
          title="Start Over"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      )}

      {/* Phase Navigation */}
      {phases.map(({ phase, icon: Icon, label, description }) => {
        const status = getPhaseStatus(phase);
        const canNavigate = canNavigateToPhase(phase);
        
        return (
          <div key={phase} className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => canNavigate && onPhaseChange(phase)}
              disabled={!canNavigate}
              className={`w-12 h-12 p-0 rounded-lg transition-all relative ${
                status === 'current'
                  ? 'bg-crd-green text-black shadow-lg'
                  : status === 'completed'
                  ? 'text-crd-green hover:bg-crd-green/10 border border-crd-green/30'
                  : status === 'available'
                  ? 'text-white hover:bg-white/10 border border-white/20'
                  : 'text-gray-600 cursor-not-allowed opacity-30 border border-gray-700'
              }`}
              title={`${label}: ${description}${!canNavigate ? ' (Complete previous steps first)' : ''}`}
            >
              <Icon className="w-5 h-5" />
              
              {/* Enhanced status indicators */}
              {status === 'completed' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-crd-green rounded-full border-2 border-editor-dark">
                  <div className="w-full h-full bg-crd-green rounded-full animate-pulse" />
                </div>
              )}
              {status === 'current' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-black animate-pulse" />
              )}
              {status === 'pending' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-600 rounded-full border-2 border-editor-dark opacity-50" />
              )}
            </Button>

            {/* Progress connector */}
            {phase !== 'export' && (
              <div className={`absolute top-14 left-1/2 transform -translate-x-1/2 w-0.5 h-4 transition-all ${
                status === 'completed' || getPhaseStatus(phases[phases.findIndex(p => p.phase === phase) + 1]?.phase) === 'current'
                  ? 'bg-crd-green' 
                  : 'bg-gray-700'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};
