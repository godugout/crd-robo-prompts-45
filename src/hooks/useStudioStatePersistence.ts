
import { useState, useEffect, useCallback, useRef } from 'react';
import { localStorageManager } from '@/lib/storage/LocalStorageManager';
import { useStudioState } from './useStudioState';
import { toast } from 'sonner';

export interface PersistedStudioState {
  studioState: any;
  currentPhase: string;
  uploadedImages: Array<{ url: string; name: string; timestamp: number }>;
  appliedEffects: Record<string, any>;
  toolSelections: Record<string, any>;
  activeTabs: Record<string, string>;
  viewSettings: {
    mode: '2d' | '3d';
    orientation: { x: number; y: number; z: number };
    zoom: number;
    position: { x: number; y: number; z: number };
  };
  workSession: {
    id: string;
    startTime: number;
    lastActivity: number;
    autoSaveEnabled: boolean;
  };
  recoveryData?: {
    crashDetected: boolean;
    lastSaveTime: number;
    unsavedChanges: boolean;
  };
}

export const useStudioStatePersistence = (sessionId?: string) => {
  const { studioState, updateLighting, updateDesign, updateLayer } = useStudioState();
  const [persistedState, setPersistedState] = useState<PersistedStudioState | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout>();
  const lastSaveRef = useRef<number>(Date.now());

  const currentSessionId = sessionId || `studio-session-${Date.now()}`;

  // Generate storage key
  const getStorageKey = useCallback((suffix: string = '') => {
    return `studio-state-${currentSessionId}${suffix}`;
  }, [currentSessionId]);

  // Save current state
  const saveCurrentState = useCallback((isAutoSave = false) => {
    try {
      const stateToSave: PersistedStudioState = {
        studioState,
        currentPhase: 'design', // This would come from your current phase
        uploadedImages: [], // This would come from your upload state
        appliedEffects: {},
        toolSelections: {},
        activeTabs: {},
        viewSettings: {
          mode: '3d',
          orientation: { x: 0, y: 0, z: 0 },
          zoom: 1,
          position: { x: 0, y: 0, z: 0 }
        },
        workSession: {
          id: currentSessionId,
          startTime: Date.now(),
          lastActivity: Date.now(),
          autoSaveEnabled: true
        }
      };

      localStorageManager.setItem(
        getStorageKey(),
        stateToSave,
        'studio-state',
        'high'
      );

      lastSaveRef.current = Date.now();
      setHasUnsavedChanges(false);

      if (!isAutoSave) {
        toast.success('Studio state saved');
      }
    } catch (error) {
      console.error('Failed to save studio state:', error);
      if (!isAutoSave) {
        toast.error('Failed to save studio state');
      }
    }
  }, [studioState, currentSessionId, getStorageKey]);

  // Load persisted state
  const loadPersistedState = useCallback(() => {
    try {
      const stored = localStorageManager.getItem<PersistedStudioState>(getStorageKey());
      if (stored) {
        setPersistedState(stored);
        return stored;
      }
    } catch (error) {
      console.error('Failed to load persisted state:', error);
    }
    return null;
  }, [getStorageKey]);

  // Check for crash recovery
  const checkForCrashRecovery = useCallback(() => {
    try {
      const recoveryKey = getStorageKey('-recovery');
      const recoveryData = localStorageManager.getItem<{ timestamp: number; hasUnsavedChanges: boolean }>(recoveryKey);
      
      if (recoveryData && recoveryData.hasUnsavedChanges) {
        const timeSinceLastSave = Date.now() - recoveryData.timestamp;
        if (timeSinceLastSave > 10000) { // 10 seconds threshold
          setIsRecovering(true);
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to check crash recovery:', error);
    }
    return false;
  }, [getStorageKey]);

  // Restore from persisted state
  const restoreState = useCallback((state: PersistedStudioState) => {
    try {
      // Restore studio state
      if (state.studioState) {
        updateLighting(state.studioState.lighting);
        updateDesign(state.studioState.design);
        // Restore layers, etc.
      }

      toast.success('Studio state restored');
      setIsRecovering(false);
    } catch (error) {
      console.error('Failed to restore state:', error);
      toast.error('Failed to restore studio state');
    }
  }, [updateLighting, updateDesign]);

  // Discard recovery data
  const discardRecovery = useCallback(() => {
    try {
      localStorageManager.removeItem(getStorageKey());
      localStorageManager.removeItem(getStorageKey('-recovery'));
      setIsRecovering(false);
      toast.success('Starting fresh session');
    } catch (error) {
      console.error('Failed to discard recovery:', error);
    }
  }, [getStorageKey]);

  // Set up auto-save
  const setupAutoSave = useCallback((interval: number = 30000) => {
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
    }

    autoSaveIntervalRef.current = setInterval(() => {
      if (hasUnsavedChanges) {
        saveCurrentState(true);
      }
    }, interval);
  }, [hasUnsavedChanges, saveCurrentState]);

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [studioState]);

  // Set up recovery tracking
  useEffect(() => {
    const updateRecoveryData = () => {
      try {
        localStorageManager.setItem(
          getStorageKey('-recovery'),
          {
            timestamp: Date.now(),
            hasUnsavedChanges
          },
          'recovery-data',
          'critical'
        );
      } catch (error) {
        console.error('Failed to update recovery data:', error);
      }
    };

    const interval = setInterval(updateRecoveryData, 5000);
    return () => clearInterval(interval);
  }, [hasUnsavedChanges, getStorageKey]);

  // Check for crash on mount
  useEffect(() => {
    const hasCrashRecovery = checkForCrashRecovery();
    if (!hasCrashRecovery) {
      loadPersistedState();
    }
    setupAutoSave();

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [checkForCrashRecovery, loadPersistedState, setupAutoSave]);

  return {
    persistedState,
    isRecovering,
    hasUnsavedChanges,
    saveCurrentState,
    restoreState,
    discardRecovery,
    setupAutoSave
  };
};
