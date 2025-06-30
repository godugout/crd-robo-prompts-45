
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { PWAInstallPrompt } from '@/components/common/PWAInstallPrompt';
import { cn } from '@/lib/utils';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  showInstallPrompt?: boolean;
}

export const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({
  children,
  showInstallPrompt = true
}) => {
  const isMobile = useIsMobile();
  const { isLowPowerMode, networkSpeed, getOptimalSettings } = useMobileOptimizations();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Apply performance optimizations globally
  useEffect(() => {
    const settings = getOptimalSettings();
    document.documentElement.style.setProperty(
      '--render-quality', 
      settings.renderQuality.toString()
    );
  }, [getOptimalSettings]);

  return (
    <div className={cn(
      'min-h-screen bg-crd-darkest relative',
      isMobile && 'touch-manipulation',
      isLowPowerMode && 'low-power-mode'
    )}>
      {/* Network status indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50 text-sm">
          You're offline. Some features may be limited.
        </div>
      )}

      {/* Low power mode indicator */}
      {isLowPowerMode && (
        <div className="fixed top-8 left-0 right-0 bg-orange-600 text-white text-center py-1 z-50 text-xs">
          Power saving mode active - reduced graphics quality
        </div>
      )}

      {/* Connection speed indicator for slow networks */}
      {(networkSpeed === '2g' || networkSpeed === 'slow-2g') && (
        <div className="fixed top-16 left-0 right-0 bg-yellow-600 text-white text-center py-1 z-50 text-xs">
          Slow connection detected - optimizing content
        </div>
      )}

      {/* Main content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* PWA install prompt */}
      {showInstallPrompt && <PWAInstallPrompt />}
    </div>
  );
};
