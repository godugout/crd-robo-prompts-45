
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useStudioState } from './useStudioState';

export const useFrameActions = () => {
  const {
    uploadedImage,
    selectedFrame,
    currentPhase,
    setSelectedFrame,
    triggerAutoSave
  } = useStudioState();

  const handleFrameSelect = useCallback((frameId: string) => {
    console.log('🖼️ Frame selected:', frameId);
    console.log('📊 Current state before frame selection:', {
      uploadedImage: uploadedImage ? 'Present' : 'None',
      selectedFrame,
      currentPhase
    });
    
    // Use the synchronized version to ensure proper state propagation
    setSelectedFrame(frameId);
    
    // Trigger auto-save with frame selection
    try {
      triggerAutoSave('frame_select', { selectedFrame: frameId });
    } catch (error) {
      console.warn('⚠️ Auto-save failed for frame selection:', error);
    }
    
    console.log('🎯 Frame selection complete, state should update preview');
    toast.success(`Frame "${frameId}" applied successfully!`);
  }, [selectedFrame, uploadedImage, currentPhase, setSelectedFrame, triggerAutoSave]);

  return {
    handleFrameSelect
  };
};
