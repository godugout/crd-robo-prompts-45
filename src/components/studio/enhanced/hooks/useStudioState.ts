
import { useState, useCallback, useEffect, useRef } from 'react';
import { imageProcessingService, ProcessedImage } from '@/services/imageProcessing/ImageProcessingService';
import { autoSaveService, CardDraft } from '@/services/autosave/AutoSaveService';
import { toast } from 'sonner';

type StudioPhase = 'upload' | 'frames' | 'effects' | 'layers' | 'export';
type CardOrientation = 'portrait' | 'landscape';

export const useStudioState = () => {
  // Core state
  const [currentPhase, setCurrentPhase] = useState<StudioPhase>('upload');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [selectedFrame, setSelectedFrame] = useState<string>('');
  const [effectValues, setEffectValues] = useState<Record<string, any>>({});
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [cardOrientation, setCardOrientation] = useState<CardOrientation>('portrait');
  
  // Enhanced state for new features
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [currentDraft, setCurrentDraft] = useState<CardDraft | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<string>('');
  const [showBackgroundRemoval, setShowBackgroundRemoval] = useState(false);
  
  // Auto-save tracking
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSaveTimeRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  // Initialize from existing draft
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    const existingDraft = autoSaveService.getCurrentDraft();
    if (existingDraft) {
      console.log('📋 Loading existing draft:', existingDraft.id);
      setCurrentDraft(existingDraft);
      
      // Only load if we don't have current state
      if (!uploadedImage && existingDraft.uploadedImage) {
        setUploadedImage(existingDraft.uploadedImage);
      }
      if (!selectedFrame && existingDraft.selectedFrame) {
        setSelectedFrame(existingDraft.selectedFrame);
      }
      if (Object.keys(effectValues).length === 0 && existingDraft.effectValues) {
        setEffectValues(existingDraft.effectValues);
      }
      
      if (existingDraft.uploadedImage && currentPhase === 'upload') {
        setCurrentPhase('frames');
      }
      
      toast.success('Resumed previous session');
    }
    
    isInitializedRef.current = true;
  }, []);

  // Auto-save functionality with debouncing
  const triggerAutoSave = useCallback((action: string, updates: Partial<CardDraft>) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      try {
        if (currentDraft) {
          autoSaveService.updateDraft(updates, action);
          lastSaveTimeRef.current = Date.now();
          console.log('💾 Auto-saved:', action);
        }
      } catch (error) {
        console.warn('⚠️ Auto-save failed:', error);
      }
    }, 300);
  }, [currentDraft]);

  // Enhanced setters that immediately update state
  const setUploadedImageWithSync = useCallback((imageUrl: string) => {
    console.log('🖼️ Setting uploaded image:', imageUrl);
    setUploadedImage(imageUrl);
    setImageLoadError(''); // Clear any previous errors
    
    // Show immediate UI feedback
    if (imageUrl) {
      toast.success('Image uploaded successfully!', {
        duration: 2000,
        className: 'bg-crd-green text-black'
      });
      triggerAutoSave('image_upload', { uploadedImage: imageUrl });
    }
  }, [triggerAutoSave]);

  const setSelectedFrameWithSync = useCallback((frameId: string) => {
    console.log('🖼️ Setting selected frame:', frameId);
    setSelectedFrame(frameId);
    
    if (frameId) {
      triggerAutoSave('frame_select', { selectedFrame: frameId });
    }
  }, [triggerAutoSave]);

  const setEffectValuesWithSync = useCallback((newEffectValues: Record<string, any>) => {
    console.log('✨ Setting effect values:', newEffectValues);
    setEffectValues(newEffectValues);
    triggerAutoSave('effect_change', { effectValues: newEffectValues });
  }, [triggerAutoSave]);

  const setCardOrientationWithSync = useCallback((orientation: CardOrientation) => {
    console.log('📱 Setting card orientation:', orientation);
    setCardOrientation(orientation);
    triggerAutoSave('orientation_change', { cardOrientation: orientation });
  }, [triggerAutoSave]);

  return {
    // State
    currentPhase,
    setCurrentPhase,
    uploadedImage,
    setUploadedImage: setUploadedImageWithSync,
    selectedFrame,
    setSelectedFrame: setSelectedFrameWithSync,
    effectValues,
    setEffectValues: setEffectValuesWithSync,
    showExportDialog,
    setShowExportDialog,
    cardOrientation,
    setCardOrientation: setCardOrientationWithSync,
    processedImage,
    setProcessedImage,
    currentDraft,
    setCurrentDraft,
    isProcessingImage,
    setIsProcessingImage,
    imageLoadError,
    setImageLoadError,
    showBackgroundRemoval,
    setShowBackgroundRemoval,
    
    // Methods
    triggerAutoSave,
    autoSaveTimeoutRef,
    lastSaveTimeRef
  };
};
