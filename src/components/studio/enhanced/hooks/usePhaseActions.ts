
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useStudioState } from './useStudioState';

type StudioPhase = 'upload' | 'frames' | 'effects' | 'layers' | 'export';

export const usePhaseActions = () => {
  const {
    currentPhase,
    uploadedImage,
    selectedFrame,
    setCurrentPhase,
    triggerAutoSave
  } = useStudioState();

  const handlePhaseChange = useCallback((phase: StudioPhase) => {
    console.log('🔄 Phase change:', currentPhase, '->', phase);
    
    // Less restrictive validation - just warn if missing critical components
    if (phase === 'effects' && !uploadedImage) {
      toast.warning('Upload an image first for the best experience');
    }
    
    if (phase === 'export' && (!uploadedImage || !selectedFrame)) {
      toast.warning('Complete previous steps for the best export results');
    }
    
    setCurrentPhase(phase);
    
    try {
      triggerAutoSave('phase_change', {});
    } catch (error) {
      console.warn('⚠️ Auto-save failed for phase change:', error);
    }
  }, [currentPhase, uploadedImage, selectedFrame, triggerAutoSave, setCurrentPhase]);

  return {
    handlePhaseChange
  };
};
