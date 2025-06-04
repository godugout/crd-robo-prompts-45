
import { useState, useEffect } from 'react';

export const useRememberCredentials = () => {
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Load remembered credentials
    try {
      const remembered = localStorage.getItem('cardshow_remember_credentials');
      if (remembered) {
        const { rememberMe: savedRemember } = JSON.parse(remembered);
        if (savedRemember) {
          setRememberMe(true);
        }
      }
    } catch (error) {
      console.error('Error loading remembered credentials:', error);
      // Clear corrupted data
      localStorage.removeItem('cardshow_remember_credentials');
    }
  }, []);

  const saveCredentials = (username: string, remember: boolean) => {
    try {
      if (remember) {
        localStorage.setItem('cardshow_remember_credentials', JSON.stringify({
          username,
          rememberMe: true
        }));
      } else {
        localStorage.removeItem('cardshow_remember_credentials');
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };

  return {
    rememberMe,
    setRememberMe,
    saveCredentials,
  };
};
