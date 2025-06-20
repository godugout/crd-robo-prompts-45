
import { useCallback } from 'react';
import { imageProcessingService } from '@/services/imageProcessing/ImageProcessingService';
import { autoSaveService } from '@/services/autosave/AutoSaveService';
import { toast } from 'sonner';
import { useStudioState } from './useStudioState';

export const useImageActions = () => {
  const {
    currentPhase,
    setCurrentPhase,
    uploadedImage,
    setUploadedImage,
    setProcessedImage,
    setCurrentDraft,
    setIsProcessingImage,
    setImageLoadError,
    setShowBackgroundRemoval,
    showBackgroundRemoval,
    currentDraft,
    triggerAutoSave
  } = useStudioState();

  const handleImageUpload = useCallback(async (imageUrl: string) => {
    console.log('🔄 Processing uploaded image:', imageUrl);
    setIsProcessingImage(true);
    setImageLoadError('');
    
    try {
      // Handle empty/clear requests
      if (!imageUrl) {
        console.log('🗑️ Clearing uploaded image');
        setUploadedImage('');
        setProcessedImage(null);
        if (currentDraft) {
          autoSaveService.updateDraft({ uploadedImage: '' }, 'image_clear');
        }
        setIsProcessingImage(false);
        return;
      }

      // Check if this is already a proper MediaManager/Supabase URL
      const isMediaManagerUrl = imageUrl.includes('supabase') && 
                               (imageUrl.includes('card-assets') || imageUrl.includes('wxlwhqlbxyuyujhqeyur'));
      
      if (isMediaManagerUrl) {
        console.log('✅ MediaManager URL detected, using directly:', imageUrl);
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
        setIsProcessingImage(false);
        return;
      }

      // For blob URLs or other formats, validate first
      const isValid = await imageProcessingService.isImageValid(imageUrl);
      if (!isValid) {
        throw new Error('Invalid or corrupted image file');
      }

      // Process the image if needed (background removal, etc.)
      let finalUrl = imageUrl;
      if (showBackgroundRemoval) {
        const processed = await imageProcessingService.processImage(imageUrl, {
          removeBackground: true
        });
        setProcessedImage(processed);
        finalUrl = processed.processedUrl || imageUrl;
      }

      // Update uploaded image
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

  const handleToggleBackgroundRemoval = useCallback(() => {
    setShowBackgroundRemoval(!showBackgroundRemoval);
    toast.info(`Background removal ${!showBackgroundRemoval ? 'enabled' : 'disabled'}`);
  }, [showBackgroundRemoval, setShowBackgroundRemoval]);

  return {
    handleImageUpload,
    handleToggleBackgroundRemoval
  };
};
