
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface WorkflowState {
  phase: string;
  uploadedImages: any[];
  detectedCards: any[];
  selectedCards: string[];
  sessionId: string;
  timestamp: number;
}

const STORAGE_KEY = 'cardshow_workflow_state';
const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

export const useWorkflowPersistence = () => {
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveWorkflowState = useCallback((state: Partial<WorkflowState>) => {
    try {
      const currentState = localStorage.getItem(STORAGE_KEY);
      const existingState = currentState ? JSON.parse(currentState) : {};
      
      const newState: WorkflowState = {
        ...existingState,
        ...state,
        timestamp: Date.now()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setLastSaved(new Date());
      console.log('Workflow state saved:', newState);
    } catch (error) {
      console.error('Failed to save workflow state:', error);
      toast.error('Failed to auto-save progress');
    }
  }, []);

  const loadWorkflowState = useCallback((): WorkflowState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        // Check if state is recent (within 24 hours)
        if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
          console.log('Loaded workflow state:', state);
          return state;
        }
      }
    } catch (error) {
      console.error('Failed to load workflow state:', error);
    }
    return null;
  }, []);

  const clearWorkflowState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setLastSaved(null);
      toast.success('Workflow state cleared');
    } catch (error) {
      console.error('Failed to clear workflow state:', error);
    }
  }, []);

  const autoSave = useCallback((state: Partial<WorkflowState>) => {
    setIsAutoSaving(true);
    
    setTimeout(() => {
      saveWorkflowState(state);
      setIsAutoSaving(false);
    }, 100); // Small delay to batch multiple updates
  }, [saveWorkflowState]);

  // Auto-save interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger auto-save event for any listening components
      window.dispatchEvent(new CustomEvent('workflow-autosave'));
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Warn before page unload if there's unsaved work
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const state = loadWorkflowState();
      if (state && state.uploadedImages?.length > 0) {
        e.preventDefault();
        e.returnValue = 'You have unsaved work. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [loadWorkflowState]);

  return {
    saveWorkflowState,
    loadWorkflowState,
    clearWorkflowState,
    autoSave,
    isAutoSaving,
    lastSaved
  };
};
