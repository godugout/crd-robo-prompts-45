
import { useState, useEffect } from 'react';

export const useCraftBoardMode = () => {
  const [isCraftBoardMode, setIsCraftBoardMode] = useState(false);

  // Listen for the easter egg key combination (Ctrl+Shift+C)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        setIsCraftBoardMode(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isCraftBoardMode,
    toggleCraftBoardMode: () => setIsCraftBoardMode(prev => !prev)
  };
};
