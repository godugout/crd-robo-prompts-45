
import { useState, useEffect } from 'react';

export const useRememberCredentials = () => {
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Load remembered credentials
    const remembered = localStorage.getItem('cardshow_remember_credentials');
    if (remembered) {
      try {
        const { username: savedUsername, rememberMe: savedRemember } = JSON.parse(remembered);
        if (savedRemember) {
          setRememberMe(true);
          return savedUsername;
        }
      } catch (error) {
        console.error('Error loading remembered credentials:', error);
      }
    }
    return '';
  }, []);

  const saveCredentials = (username: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem('cardshow_remember_credentials', JSON.stringify({
        username,
        rememberMe: true
      }));
    } else {
      localStorage.removeItem('cardshow_remember_credentials');
    }
  };

  return {
    rememberMe,
    setRememberMe,
    saveCredentials,
  };
};
