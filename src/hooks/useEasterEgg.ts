
import { useState, useCallback, useRef, useEffect } from 'react';

export const useEasterEgg = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const REQUIRED_CLICKS = 7;
  const RESET_TIMEOUT = 2000; // 2 seconds

  const handleClick = useCallback(() => {
    setClickCount(prev => {
      const newCount = prev + 1;
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout to reset counter
      timeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, RESET_TIMEOUT);
      
      // Show brief flash effect
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 150);
      
      // Check if easter egg should activate
      if (newCount >= REQUIRED_CLICKS) {
        setIsActivated(true);
        setClickCount(0);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
      
      return newCount;
    });
  }, []);

  const resetEasterEgg = useCallback(() => {
    setIsActivated(false);
    setClickCount(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    clickCount,
    isActivated,
    showFlash,
    handleClick,
    resetEasterEgg
  };
};
