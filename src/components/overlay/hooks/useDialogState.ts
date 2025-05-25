
import { useState, useCallback } from 'react';
import type { EnhancedDialogStep, DragState } from './types';

export const useDialogState = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<EnhancedDialogStep>('upload');
  const [isEditMode, setIsEditMode] = useState(false);
  const [dragState, setDragState] = useState<DragState>({ 
    isDragging: false, 
    startX: 0, 
    startY: 0 
  });

  const goBack = useCallback(() => {
    if (currentStep === 'detect') setCurrentStep('upload');
    else if (currentStep === 'refine') setCurrentStep('detect');
    else if (currentStep === 'extract') setCurrentStep('refine');
  }, [currentStep]);

  const resetDialog = useCallback(() => {
    setCurrentStep('upload');
    setIsEditMode(false);
    setIsProcessing(false);
    setDragState({ isDragging: false, startX: 0, startY: 0 });
  }, []);

  return {
    isProcessing,
    currentStep,
    isEditMode,
    dragState,
    setIsProcessing,
    setCurrentStep,
    setIsEditMode,
    setDragState,
    goBack,
    resetDialog
  };
};
