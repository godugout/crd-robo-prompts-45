
import { useState, useCallback, useRef, useEffect } from 'react';

export const useEasterEgg = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [showScriptLogo, setShowScriptLogo] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const REQUIRED_CLICKS = 7;
  const RESET_TIMEOUT = 2000; // 2 seconds
  const TRANSITION_DURATION = 600; // 600ms for smooth crossfade

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
      
      // Check if easter egg should toggle
      if (newCount >= REQUIRED_CLICKS) {
        setIsTransitioning(true);
        
        // Start crossfade transition
        setTimeout(() => {
          setIsActivated(!isActivated);
          setShowScriptLogo(!showScriptLogo);
          
          // End transition after animation completes
          setTimeout(() => {
            setIsTransitioning(false);
          }, TRANSITION_DURATION);
        }, 50);
        
        setClickCount(0);
        
        // Clear the reset timeout since we've activated
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
      
      return newCount;
    });
  }, [isActivated, showScriptLogo]);

  const resetEasterEgg = useCallback(() => {
    setIsActivated(false);
    setShowScriptLogo(false);
    setClickCount(0);
    setIsTransitioning(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Cleanup timeouts on unmount
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
    showScriptLogo,
    showFlash,
    isTransitioning,
    handleClick,
    resetEasterEgg
  };
};
