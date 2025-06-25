
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseMetrics {
  queryCount: number;
  slowQueries: number;
  avgQueryTime: number;
  errorRate: number;
  connectionCount: number;
}

interface RealtimeMetrics {
  activeConnections: number;
  subscriptionCount: number;
  messageRate: number;
  connectionErrors: number;
  latency: number;
}

interface RenderingMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  gpuUtilization: number;
  renderErrors: number;
}

interface PaymentMetrics {
  successRate: number;
  processingTime: number;
  errorCount: number;
  totalTransactions: number;
  failureReasons: Record<string, number>;
}

interface EngagementMetrics {
  activeUsers: number;
  sessionDuration: number;
  conversionRate: number;
  bounceRate: number;
  featureUsage: Record<string, number>;
}

interface PerformanceData {
  database: DatabaseMetrics;
  realtime: RealtimeMetrics;
  rendering: RenderingMetrics;
  payments: PaymentMetrics;
  engagement: EngagementMetrics;
}

export const usePerformanceAnalytics = () => {
  const [metrics, setMetrics] = useState<PerformanceData>({
    database: {
      queryCount: 0,
      slowQueries: 0,
      avgQueryTime: 0,
      errorRate: 0,
      connectionCount: 0
    },
    realtime: {
      activeConnections: 0,
      subscriptionCount: 0,
      messageRate: 0,
      connectionErrors: 0,
      latency: 0
    },
    rendering: {
      fps: 60,
      frameTime: 16.67,
      memoryUsage: 0,
      gpuUtilization: 0,
      renderErrors: 0
    },
    payments: {
      successRate: 0,
      processingTime: 0,
      errorCount: 0,
      totalTransactions: 0,
      failureReasons: {}
    },
    engagement: {
      activeUsers: 0,
      sessionDuration: 0,
      conversionRate: 0,
      bounceRate: 0,
      featureUsage: {}
    }
  });

  const [alerts, setAlerts] = useState<Array<{
    type: 'warning' | 'error' | 'info';
    category: string;
    message: string;
    timestamp: Date;
  }>>([]);

  // Database performance tracking
  const trackDatabaseQuery = useCallback((queryTime: number, success: boolean, queryType: string) => {
    setMetrics(prev => ({
      ...prev,
      database: {
        ...prev.database,
        queryCount: prev.database.queryCount + 1,
        slowQueries: queryTime > 1000 ? prev.database.slowQueries + 1 : prev.database.slowQueries,
        avgQueryTime: (prev.database.avgQueryTime * prev.database.queryCount + queryTime) / (prev.database.queryCount + 1),
        errorRate: success ? prev.database.errorRate : prev.database.errorRate + 1
      }
    }));

    if (queryTime > 2000) {
      setAlerts(prev => [...prev, {
        type: 'warning',
        category: 'Database',
        message: `Slow query detected: ${queryType} took ${queryTime}ms`,
        timestamp: new Date()
      }]);
    }
  }, []);

  // Real-time performance tracking
  const trackRealtimeMetrics = useCallback((connections: number, subscriptions: number, latency: number) => {
    setMetrics(prev => ({
      ...prev,
      realtime: {
        ...prev.realtime,
        activeConnections: connections,
        subscriptionCount: subscriptions,
        latency,
        messageRate: prev.realtime.messageRate + 1
      }
    }));
  }, []);

  // 3D rendering performance tracking
  const trackRenderingMetrics = useCallback((fps: number, memoryUsage: number) => {
    setMetrics(prev => ({
      ...prev,
      rendering: {
        ...prev.rendering,
        fps,
        frameTime: 1000 / fps,
        memoryUsage,
        gpuUtilization: Math.min(100, memoryUsage / 1024 / 1024 * 10) // Estimated
      }
    }));

    if (fps < 30) {
      setAlerts(prev => [...prev, {
        type: 'warning',
        category: '3D Rendering',
        message: `Low FPS detected: ${fps.toFixed(1)} FPS`,
        timestamp: new Date()
      }]);
    }
  }, []);

  // Payment processing tracking
  const trackPaymentMetric = useCallback((success: boolean, processingTime: number, errorReason?: string) => {
    setMetrics(prev => {
      const newTotal = prev.payments.totalTransactions + 1;
      const successCount = success ? 1 : 0;
      const newSuccessRate = ((prev.payments.successRate * prev.payments.totalTransactions) + successCount) / newTotal * 100;

      return {
        ...prev,
        payments: {
          ...prev.payments,
          successRate: newSuccessRate,
          processingTime: (prev.payments.processingTime + processingTime) / 2,
          errorCount: success ? prev.payments.errorCount : prev.payments.errorCount + 1,
          totalTransactions: newTotal,
          failureReasons: errorReason ? {
            ...prev.payments.failureReasons,
            [errorReason]: (prev.payments.failureReasons[errorReason] || 0) + 1
          } : prev.payments.failureReasons
        }
      };
    });
  }, []);

  // User engagement tracking
  const trackEngagementMetric = useCallback((eventType: string, duration?: number) => {
    setMetrics(prev => ({
      ...prev,
      engagement: {
        ...prev.engagement,
        featureUsage: {
          ...prev.engagement.featureUsage,
          [eventType]: (prev.engagement.featureUsage[eventType] || 0) + 1
        },
        sessionDuration: duration ? (prev.engagement.sessionDuration + duration) / 2 : prev.engagement.sessionDuration
      }
    }));
  }, []);

  // Fetch performance data from Supabase
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Simulate fetching real metrics - in production, this would query actual performance tables
        const mockData = {
          database: {
            queryCount: Math.floor(Math.random() * 1000) + 500,
            slowQueries: Math.floor(Math.random() * 10),
            avgQueryTime: Math.random() * 500 + 100,
            errorRate: Math.random() * 5,
            connectionCount: Math.floor(Math.random() * 50) + 10
          },
          realtime: {
            activeConnections: Math.floor(Math.random() * 100) + 20,
            subscriptionCount: Math.floor(Math.random() * 200) + 50,
            messageRate: Math.random() * 1000 + 100,
            connectionErrors: Math.floor(Math.random() * 5),
            latency: Math.random() * 100 + 20
          }
        };

        setMetrics(prev => ({
          ...prev,
          database: mockData.database,
          realtime: mockData.realtime
        }));
      } catch (error) {
        console.error('Failed to fetch performance metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    alerts,
    trackDatabaseQuery,
    trackRealtimeMetrics,
    trackRenderingMetrics,
    trackPaymentMetric,
    trackEngagementMetric
  };
};
