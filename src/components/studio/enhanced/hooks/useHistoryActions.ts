
import { useCallback } from 'react';
import { autoSaveService } from '@/services/autosave/AutoSaveService';
import { imageProcessingService } from '@/services/imageProcessing/ImageProcessingService';
import { toast } from 'sonner';
import { useStudioState } from './useStudioState';

export const useHistoryActions = () => {
  const {
    setCurrentDraft,
    setUploadedImage,
    setSelectedFrame,
    setEffectValues,
    setCurrentPhase,
    setProcessedImage,
    setIsProcessingImage,
    setImageLoadError,
    setShowBackgroundRemoval
  } = useStudioState();

  const handleUndo = useCallback(() => {
    try {
      if (autoSaveService.canUndo()) {
        const success = autoSaveService.undo();
        if (success) {
          const updatedDraft = autoSaveService.getCurrentDraft();
          if (updatedDraft) {
            setCurrentDraft(updatedDraft);
            setUploadedImage(updatedDraft.uploadedImage || '');
            setSelectedFrame(updatedDraft.selectedFrame || '');
            setEffectValues(updatedDraft.effectValues || {});
            toast.success('Action undone');
          }
        } else {
          toast.info('Nothing to undo');
        }
      } else {
        toast.info('Nothing to undo');
      }
    } catch (error) {
      console.error('❌ Undo failed:', error);
      toast.error('Failed to undo action');
    }
  }, [setCurrentDraft, setUploadedImage, setSelectedFrame, setEffectValues]);

  const handleReset = useCallback(() => {
    console.log('🔄 Emergency reset triggered');
    
    try {
      autoSaveService.clearDraft();
    } catch (error) {
      console.warn('⚠️ Failed to clear auto-save:', error);
    }
    
    try {
      imageProcessingService.clearCache();
    } catch (error) {
      console.warn('⚠️ Failed to clear image cache:', error);
    }
    
    // Reset all state
    setCurrentPhase('upload');
    setUploadedImage('');
    setSelectedFrame('');
    setEffectValues({});
    setCurrentDraft(null);
    setProcessedImage(null);
    setIsProcessingImage(false);
    setImageLoadError('');
    setShowBackgroundRemoval(false);
    
    toast.success('Studio reset successfully');
  }, [
    setCurrentPhase, setUploadedImage, setSelectedFrame, setEffectValues,
    setCurrentDraft, setProcessedImage, setIsProcessingImage, 
    setImageLoadError, setShowBackgroundRemoval
  ]);

  return {
    handleUndo,
    handleReset
  };
};
