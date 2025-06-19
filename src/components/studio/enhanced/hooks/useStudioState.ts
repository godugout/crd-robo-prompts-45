
import { useState, useCallback, useEffect, useRef } from 'react';
import { imageProcessingService, ProcessedImage } from '@/services/imageProcessing/ImageProcessingService';
import { autoSaveService, CardDraft } from '@/services/autosave/AutoSaveService';
import { toast } from 'sonner';

type StudioPhase = 'upload' | 'frames' | 'effects' | 'layers' | 'export';

export const useStudioState = () => {
  // Core state
  const [currentPhase, setCurrentPhase] = useState<StudioPhase>('upload');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [selectedFrame, setSelectedFrame] = useState<string>('');
  const [effectValues, setEffectValues] = useState<Record<string, any>>({});
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  // Enhanced state for new features
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [currentDraft, setCurrentDraft] = useState<CardDraft | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<string>('');
  const [showBackgroundRemoval, setShowBackgroundRemoval] = useState(false);
  
  // Auto-save tracking
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSaveTimeRef = useRef<number>(0);

  // Initialize from existing draft
  useEffect(() => {
    const existingDraft = autoSaveService.getCurrentDraft();
    if (existingDraft) {
      console.log('📋 Loading existing draft:', existingDraft.id);
      setCurrentDraft(existingDraft);
      setUploadedImage(existingDraft.uploadedImage || '');
      setSelectedFrame(existingDraft.selectedFrame || '');
      setEffectValues(existingDraft.effectValues || {});
      
      if (existingDraft.uploadedImage) {
        setCurrentPhase('frames');
      }
      
      toast.success('Resumed previous session');
    }
  }, []);

  // Auto-save functionality
  const triggerAutoSave = useCallback((action: string, updates: Partial<CardDraft>) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (currentDraft) {
        autoSaveService.updateDraft(updates, action);
        lastSaveTimeRef.current = Date.now();
        console.log('💾 Auto-saved:', action);
      }
    }, 300); // Auto-save after 300ms of inactivity
  }, [currentDraft]);

  return {
    // State
    currentPhase,
    setCurrentPhase,
    uploadedImage,
    setUploadedImage,
    selectedFrame,
    setSelectedFrame,
    effectValues,
    setEffectValues,
    showExportDialog,
    setShowExportDialog,
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
