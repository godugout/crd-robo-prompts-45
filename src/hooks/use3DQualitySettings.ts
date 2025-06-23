
import { useState, useEffect } from 'react';

interface QualitySettings {
  renderQuality: 'low' | 'medium' | 'high' | 'ultra';
  enableShadows: boolean;
  antialias: boolean;
  particleCount: number;
}

export const use3DQualitySettings = () => {
  const [settings, setSettings] = useState<QualitySettings>({
    renderQuality: 'high',
    enableShadows: true,
    antialias: true,
    particleCount: 500
  });

  // Auto-detect device capabilities and adjust quality
  useEffect(() => {
    const detectQuality = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        setSettings(prev => ({ ...prev, renderQuality: 'low' }));
        return;
      }

      const renderer = gl.getParameter(gl.RENDERER);
      const vendor = gl.getParameter(gl.VENDOR);
      
      // Check for mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        setSettings(prev => ({ 
          ...prev, 
          renderQuality: 'medium',
          enableShadows: false,
          particleCount: 100
        }));
      } else {
        // Desktop - check GPU capabilities
        const isHighEnd = renderer && (
          renderer.includes('GTX') || 
          renderer.includes('RTX') || 
          renderer.includes('Radeon RX')
        );
        
        setSettings(prev => ({ 
          ...prev, 
          renderQuality: isHighEnd ? 'ultra' : 'high'
        }));
      }
    };

    detectQuality();
  }, []);

  const updateSettings = (newSettings: Partial<QualitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    updateSettings
  };
};
