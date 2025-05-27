import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { DetectedCard, CardDetectionResult } from '@/services/cardDetection';
import type { 
  UploadedImage, 
  CreatedCard, 
  WorkflowPhase, 
  SessionState, 
  UseCardUploadSessionReturn 
} from '../types';

const SESSION_STORAGE_KEY = 'cardshow_upload_session';

export const useCardUploadSession = (): UseCardUploadSessionReturn => {
  const [phase, setPhase] = useState<WorkflowPhase>('idle');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [detectionResults, setDetectionResults] = useState<CardDetectionResult[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [createdCards, setCreatedCards] = useState<CreatedCard[]>([]);
  const [sessionId, setSessionId] = useState<string>('');

  // Load session state on component mount
  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSession) {
      try {
        const sessionState: SessionState = JSON.parse(savedSession);
        console.log('Restoring session state:', sessionState);
        
        setPhase(sessionState.phase);
        setUploadedImages(sessionState.uploadedImages || []);
        setDetectionResults(sessionState.detectionResults || []);
        setSelectedCards(new Set(sessionState.selectedCards || []));
        setCreatedCards(sessionState.createdCards || []);
        setSessionId(sessionState.sessionId || `session-${Date.now()}`);
        
        if (sessionState.phase !== 'idle' && sessionState.phase !== 'complete') {
          toast.success('Session restored! Continuing from where you left off.');
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        clearSession();
      }
    } else {
      setSessionId(`session-${Date.now()}`);
    }
  }, []);

  // Save session state whenever it changes
  useEffect(() => {
    if (sessionId) {
      const sessionState: SessionState = {
        phase,
        uploadedImages,
        detectionResults,
        selectedCards: Array.from(selectedCards),
        createdCards,
        sessionId
      };
      
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionState));
      console.log('Session state saved:', sessionState);
    }
  }, [phase, uploadedImages, detectionResults, selectedCards, createdCards, sessionId]);

  // Clear session and reset to initial state
  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setPhase('idle');
    setUploadedImages([]);
    setDetectionResults([]);
    setSelectedCards(new Set());
    setCreatedCards([]);
    setSessionId(`session-${Date.now()}`);
    toast.success('Session cleared. Starting fresh!');
  }, []);

  return {
    phase,
    setPhase,
    uploadedImages,
    setUploadedImages,
    detectionResults,
    setDetectionResults,
    selectedCards,
    setSelectedCards,
    createdCards,
    setCreatedCards,
    sessionId,
    clearSession
  };
};

export type { UploadedImage, CreatedCard, WorkflowPhase };
