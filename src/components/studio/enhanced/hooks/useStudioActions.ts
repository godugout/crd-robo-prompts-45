
import { useCallback } from 'react';
import { imageProcessingService } from '@/services/imageProcessing/ImageProcessingService';
import { autoSaveService } from '@/services/autosave/AutoSaveService';
import { MediaManager } from '@/lib/storage/MediaManager';
import { toast } from 'sonner';
import { useStudioState } from './useStudioState';

type StudioPhase = 'upload' | 'frames' | 'effects' | 'layers' | 'export';

export const useStudioActions = () => {
  const {
    currentPhase,
    setCurrentPhase,
    uploadedImage,
    selectedFrame,
    effectValues,
    setEffectValues,
    setUploadedImage,
    setSelectedFrame,
    setProcessedImage,
    setCurrentDraft,
    setIsProcessingImage,
    setImageLoadError,
    setShowBackgroundRemoval,
    showBackgroundRemoval,
    currentDraft,
    triggerAutoSave
  } = useStudioState();

  // Enhanced image upload handler with MediaManager integration
  const handleImageUpload = useCallback(async (imageUrl: string) => {
    console.log('🔄 Processing uploaded image:', imageUrl);
    setIsProcessingImage(true);
    setImageLoadError('');
    
    try {
      // Check if this is already a proper MediaManager URL
      if (imageUrl.includes('supabase') && imageUrl.includes('card-assets')) {
        console.log('✅ Already a MediaManager URL, using directly:', imageUrl);
        setUploadedImage(imageUrl);
        
        // Create or update draft with the MediaManager URL
        try {
          if (!currentDraft) {
            const newDraft = autoSaveService.createDraft(imageUrl);
            setCurrentDraft(newDraft);
          } else {
            autoSaveService.updateDraft({
              uploadedImage: imageUrl
            }, 'image_upload');
          }
        } catch (autoSaveError) {
          console.warn('⚠️ Auto-save failed, continuing anyway:', autoSaveError);
        }

        // Auto-advance to frames phase for better UX
        if (currentPhase === 'upload') {
          setTimeout(() => setCurrentPhase('frames'), 500);
        }
        
        toast.success('Image ready! Select a frame next.');
        return;
      }

      // For blob URLs or other formats, validate first
      const isValid = await imageProcessingService.isImageValid(imageUrl);
      if (!isValid) {
        throw new Error('Invalid or corrupted image file');
      }

      // Process the image if needed
      const processed = await imageProcessingService.processImage(imageUrl, {
        removeBackground: showBackgroundRemoval
      });

      // Update processed image
      setProcessedImage(processed);
      
      // Use the processed URL
      const finalUrl = processed.processedUrl || imageUrl;
      setUploadedImage(finalUrl);

      // Create or update draft
      try {
        if (!currentDraft) {
          const newDraft = autoSaveService.createDraft(finalUrl);
          setCurrentDraft(newDraft);
        } else {
          autoSaveService.updateDraft({
            uploadedImage: finalUrl
          }, 'image_upload');
        }
      } catch (autoSaveError) {
        console.warn('⚠️ Auto-save failed, continuing anyway:', autoSaveError);
      }

      // Auto-advance to frames phase for better UX
      if (currentPhase === 'upload') {
        setTimeout(() => setCurrentPhase('frames'), 500);
      }
      
      toast.success('Image uploaded successfully! Select a frame next.');
    } catch (error) {
      console.error('❌ Image processing failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
      setImageLoadError(errorMessage);
      toast.error(errorMessage);
      
      // Clear the uploaded image on error
      setUploadedImage('');
    } finally {
      setIsProcessingImage(false);
    }
  }, [currentPhase, currentDraft, showBackgroundRemoval, setIsProcessingImage, setImageLoadError, setProcessedImage, setUploadedImage, setCurrentDraft, setCurrentPhase]);

  const handleFrameSelect = useCallback((frameId: string) => {
    console.log('🖼️ Frame selected:', frameId);
    setSelectedFrame(frameId);
    toast.success(`Frame "${frameId}" applied successfully!`);
  }, [setSelectedFrame]);

  const handleEffectChange = useCallback((effectId: string, value: any) => {
    console.log('✨ Effect changed:', effectId, value);
    const newEffectValues = {
      ...effectValues,
      [effectId]: value
    };
    setEffectValues(newEffectValues);
  }, [effectValues, setEffectValues]);

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

  const handleToggleBackgroundRemoval = useCallback(() => {
    setShowBackgroundRemoval(!showBackgroundRemoval);
    toast.info(`Background removal ${!showBackgroundRemoval ? 'enabled' : 'disabled'}`);
  }, [showBackgroundRemoval, setShowBackgroundRemoval]);

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
    handleImageUpload,
    handleFrameSelect,
    handleEffectChange,
    handlePhaseChange,
    handleUndo,
    handleToggleBackgroundRemoval,
    handleReset
  };
};
