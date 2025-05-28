
import { useState, useRef } from 'react';

export interface ProcessingState {
  isProcessing: boolean;
  canCancel: boolean;
  processingComplete: boolean;
  processingRef: React.MutableRefObject<boolean>;
  completedBatchesRef: React.MutableRefObject<Set<string>>;
}

export const useProcessingState = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  
  const processingRef = useRef(false);
  const completedBatchesRef = useRef<Set<string>>(new Set());

  const startProcessing = () => {
    processingRef.current = true;
    setIsProcessing(true);
    setCanCancel(true);
    setProcessingComplete(false);
    completedBatchesRef.current.clear();
  };

  const stopProcessing = () => {
    processingRef.current = false;
    setIsProcessing(false);
    setCanCancel(false);
  };

  const completeProcessing = () => {
    processingRef.current = false;
    setIsProcessing(false);
    setCanCancel(false);
    setProcessingComplete(true);
  };

  const resetProcessing = () => {
    setProcessingComplete(false);
    completedBatchesRef.current.clear();
  };

  const markBatchCompleted = (batchId: string) => {
    completedBatchesRef.current.add(batchId);
  };

  const isBatchCompleted = (batchId: string): boolean => {
    return completedBatchesRef.current.has(batchId);
  };

  return {
    isProcessing,
    canCancel,
    processingComplete,
    processingRef,
    completedBatchesRef,
    startProcessing,
    stopProcessing,
    completeProcessing,
    resetProcessing,
    markBatchCompleted,
    isBatchCompleted
  };
};
