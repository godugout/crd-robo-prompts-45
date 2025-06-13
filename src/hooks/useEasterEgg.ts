
import { useState, useCallback, useRef, useEffect } from 'react';

export const useEasterEgg = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [showScriptLogo, setShowScriptLogo] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scriptLogoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const REQUIRED_CLICKS = 7;
  const RESET_TIMEOUT = 2000; // 2 seconds
  const SCRIPT_LOGO_DURATION = 5000; // 5 seconds

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
        setShowScriptLogo(true);
        setClickCount(0);
        
        // Clear the reset timeout since we've activated
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Auto-hide script logo after duration
        scriptLogoTimeoutRef.current = setTimeout(() => {
          setShowScriptLogo(false);
          setIsActivated(false);
        }, SCRIPT_LOGO_DURATION);
      }
      
      return newCount;
    });
  }, []);

  const resetEasterEgg = useCallback(() => {
    setIsActivated(false);
    setShowScriptLogo(false);
    setClickCount(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (scriptLogoTimeoutRef.current) {
      clearTimeout(scriptLogoTimeoutRef.current);
    }
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (scriptLogoTimeoutRef.current) {
        clearTimeout(scriptLogoTimeoutRef.current);
      }
    };
  }, []);

  return {
    clickCount,
    isActivated,
    showScriptLogo,
    showFlash,
    handleClick,
    resetEasterEgg
  };
};
