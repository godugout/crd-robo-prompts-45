
import { useState, useCallback } from 'react';

interface CropState {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface CropHistory {
  states: CropState[];
  currentIndex: number;
}

const initialCropState: CropState = {
  x: 0,
  y: 0,
  width: 200,
  height: 280, // 200 / (2.5/3.5) = 280
  rotation: 0,
};

export const useCropState = () => {
  const [history, setHistory] = useState<CropHistory>({
    states: [initialCropState],
    currentIndex: 0
  });

  const currentState = history.states[history.currentIndex];

  const addToHistory = useCallback((newState: CropState) => {
    setHistory(prev => {
      const newStates = prev.states.slice(0, prev.currentIndex + 1);
      newStates.push(newState);
      
      // Limit history to 50 states
      if (newStates.length > 50) {
        newStates.shift();
      }

      return {
        states: newStates,
        currentIndex: newStates.length - 1
      };
    });
  }, []);

  const updateCropPosition = useCallback((x: number, y: number) => {
    const newState = { ...currentState, x, y };
    addToHistory(newState);
  }, [currentState, addToHistory]);

  const updateCropSize = useCallback((width: number, height: number) => {
    const newState = { ...currentState, width, height };
    addToHistory(newState);
  }, [currentState, addToHistory]);

  const updateCropRotation = useCallback((rotation: number) => {
    const newState = { ...currentState, rotation };
    addToHistory(newState);
  }, [currentState, addToHistory]);

  const resetCrop = useCallback(() => {
    addToHistory(initialCropState);
  }, [addToHistory]);

  const undo = useCallback(() => {
    setHistory(prev => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1)
    }));
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => ({
      ...prev,
      currentIndex: Math.min(prev.states.length - 1, prev.currentIndex + 1)
    }));
  }, []);

  const canUndo = history.currentIndex > 0;
  const canRedo = history.currentIndex < history.states.length - 1;

  return {
    cropState: currentState,
    updateCropPosition,
    updateCropSize,
    updateCropRotation,
    resetCrop,
    canUndo,
    canRedo,
    undo,
    redo
  };
};
