
import { useState, useEffect } from 'react';

interface QualitySettings {
  renderQuality: 'low' | 'medium' | 'high' | 'ultra';
  shadows: boolean;
  antialiasing: boolean;
  particleCount: number;
  effectsIntensity: number;
}

export const use3DQualitySettings = () => {
  const [settings, setSettings] = useState<QualitySettings>({
    renderQuality: 'high',
    shadows: true,
    antialiasing: true,
    particleCount: 100,
    effectsIntensity: 1.0
  });

  useEffect(() => {
    // Auto-detect device capabilities
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (gl) {
      const vendor = gl.getParameter(gl.VENDOR);
      const renderer = gl.getParameter(gl.RENDERER);
      
      // Simplified device detection
      if (renderer.includes('Mali') || renderer.includes('Adreno')) {
        // Mobile GPU - lower settings
        setSettings(prev => ({
          ...prev,
          renderQuality: 'medium',
          shadows: false,
          particleCount: 50,
          effectsIntensity: 0.7
        }));
      }
    }
  }, []);

  return { settings, setSettings };
};
