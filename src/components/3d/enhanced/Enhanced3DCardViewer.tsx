
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { detectWebGLCapabilities } from '../utils/webglDetection';
import type { CardData } from '@/types/card';

// Lazy load 3D components for code splitting
const Card3DViewer = lazy(() => 
  import('../core/Card3DViewer').then(module => ({ default: module.Card3DViewer }))
);

interface Enhanced3DCardViewerProps {
  card: CardData;
  fallbackComponent?: React.ReactNode;
  className?: string;
  autoEnable?: boolean;
  onModeChange?: (is3D: boolean) => void;
}

export const Enhanced3DCardViewer: React.FC<Enhanced3DCardViewerProps> = ({
  card,
  fallbackComponent,
  className = '',
  autoEnable = true,
  onModeChange
}) => {
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  const [is3DSupported, setIs3DSupported] = useState<boolean | null>(null);
  const [userPreference, setUserPreference] = useState<boolean | null>(null);

  // Check WebGL support on mount
  useEffect(() => {
    const capabilities = detectWebGLCapabilities();
    const supported = capabilities.supported && capabilities.performanceScore > 30;
    setIs3DSupported(supported);
    
    // Load user preference from localStorage
    const saved = localStorage.getItem('crd-3d-enabled');
    const preference = saved ? JSON.parse(saved) : null;
    setUserPreference(preference);
    
    // Auto-enable if supported and no user preference set
    if (autoEnable && supported && preference === null) {
      setIs3DEnabled(true);
    } else if (preference !== null) {
      setIs3DEnabled(preference && supported);
    }
  }, [autoEnable]);

  // Save user preference
  const handleToggle3D = () => {
    const newState = !is3DEnabled;
    setIs3DEnabled(newState);
    setUserPreference(newState);
    localStorage.setItem('crd-3d-enabled', JSON.stringify(newState));
    onModeChange?.(newState);
  };

  // Handle fallback when 3D fails
  const handleFallback = () => {
    setIs3DEnabled(false);
    onModeChange?.(false);
  };

  // Handle performance issues
  const handlePerformanceIssue = () => {
    console.warn('3D performance issues detected, suggesting fallback');
  };

  if (is3DSupported === null) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 ${className}`}>
        <div className="text-white text-sm">Checking 3D compatibility...</div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* 3D Toggle Button */}
      {is3DSupported && (
        <button
          onClick={handleToggle3D}
          className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
            is3DEnabled 
              ? 'bg-crd-green text-black hover:bg-crd-green/90' 
              : 'bg-black/50 text-white hover:bg-black/70'
          }`}
        >
          {is3DEnabled ? '3D' : '2D'}
        </button>
      )}

      {/* 3D Viewer */}
      {is3DEnabled && is3DSupported && (
        <Suspense fallback={
          <div className={`flex items-center justify-center bg-gray-900 w-full h-full ${className}`}>
            <div className="text-white text-sm">Loading 3D viewer...</div>
          </div>
        }>
          <Card3DViewer
            card={card}
            enabled={true}
            className="w-full h-full"
            onFallback={handleFallback}
            onPerformanceIssue={handlePerformanceIssue}
          />
        </Suspense>
      )}

      {/* 2D Fallback with Proper Centering */}
      {(!is3DEnabled || !is3DSupported) && (
        <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 ${className}`}>
          {fallbackComponent || (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <div className="relative max-w-full max-h-full aspect-[2.5/3.5]">
                <img
                  src={card.image_url || '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png'}
                  alt={card.title}
                  className="w-full h-full object-contain rounded-lg shadow-2xl"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
              </div>
            </div>
          )}
          
          {/* 3D Not Supported Message */}
          {!is3DSupported && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white text-xs p-2 rounded">
              3D view not supported on this device
            </div>
          )}
        </div>
      )}
    </div>
  );
};
