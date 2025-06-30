
import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

interface CustomMetrics {
  cardRenderTime: number;
  threeDLoadTime: number;
  apiResponseTime: number;
  imageLoadTime: number;
}

export const usePerformanceMonitoring = () => {
  const reportMetrics = useCallback((metrics: Partial<PerformanceMetrics & CustomMetrics>) => {
    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      console.log('Performance metrics:', metrics);
      // TODO: Integrate with Sentry, DataDog, or other monitoring service
    }
  }, []);

  const measureCardRender = useCallback(() => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      reportMetrics({ cardRenderTime: renderTime });
    };
  }, [reportMetrics]);

  const measure3DLoad = useCallback((modelUrl: string) => {
    const startTime = performance.now();
    
    return () => {
      const loadTime = performance.now() - startTime;
      reportMetrics({ threeDLoadTime: loadTime });
    };
  }, [reportMetrics]);

  const measureApiCall = useCallback((endpoint: string) => {
    const startTime = performance.now();
    
    return (success: boolean) => {
      const responseTime = performance.now() - startTime;
      reportMetrics({ apiResponseTime: responseTime });
      
      // Track API errors
      if (!success) {
        console.warn(`API call failed: ${endpoint} (${responseTime}ms)`);
      }
    };
  }, [reportMetrics]);

  // Core Web Vitals monitoring
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              reportMetrics({ fcp: entry.startTime });
            }
            break;
            
          case 'largest-contentful-paint':
            reportMetrics({ lcp: entry.startTime });
            break;
            
          case 'first-input':
            reportMetrics({ fid: (entry as any).processingStart - entry.startTime });
            break;
            
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              reportMetrics({ cls: (entry as any).value });
            }
            break;
            
          case 'navigation':
            const navEntry = entry as PerformanceNavigationTiming;
            reportMetrics({ 
              ttfb: navEntry.responseStart - navEntry.requestStart 
            });
            break;
        }
      }
    });

    // Observe all relevant performance entries
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }

    return () => observer.disconnect();
  }, [reportMetrics]);

  // Memory usage monitoring
  useEffect(() => {
    const checkMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        if (usagePercent > 80) {
          console.warn('High memory usage detected:', usagePercent.toFixed(2) + '%');
        }
      }
    };

    const interval = setInterval(checkMemoryUsage, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return {
    measureCardRender,
    measure3DLoad,
    measureApiCall,
    reportMetrics
  };
};
