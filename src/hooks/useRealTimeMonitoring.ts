
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealtimeConnection {
  id: string;
  status: 'connected' | 'disconnected' | 'error';
  latency: number;
  lastMessage: Date;
  messageCount: number;
}

export const useRealTimeMonitoring = () => {
  const connectionsRef = useRef<Map<string, RealtimeConnection>>(new Map());
  const metricsRef = useRef({
    totalConnections: 0,
    activeSubscriptions: 0,
    messageRate: 0,
    averageLatency: 0,
    errorRate: 0
  });

  const trackConnection = useCallback((connectionId: string, status: RealtimeConnection['status']) => {
    const connections = connectionsRef.current;
    const existing = connections.get(connectionId);
    
    if (existing) {
      connections.set(connectionId, {
        ...existing,
        status,
        lastMessage: new Date()
      });
    } else {
      connections.set(connectionId, {
        id: connectionId,
        status,
        latency: 0,
        lastMessage: new Date(),
        messageCount: 0
      });
    }

    // Update metrics
    metricsRef.current.totalConnections = connections.size;
    metricsRef.current.activeSubscriptions = Array.from(connections.values())
      .filter(conn => conn.status === 'connected').length;
  }, []);

  const trackMessage = useCallback((connectionId: string, latency: number) => {
    const connections = connectionsRef.current;
    const connection = connections.get(connectionId);
    
    if (connection) {
      connections.set(connectionId, {
        ...connection,
        latency,
        messageCount: connection.messageCount + 1,
        lastMessage: new Date()
      });

      // Update message rate
      metricsRef.current.messageRate++;
      
      // Update average latency
      const allLatencies = Array.from(connections.values())
        .filter(conn => conn.latency > 0)
        .map(conn => conn.latency);
      
      if (allLatencies.length > 0) {
        metricsRef.current.averageLatency = 
          allLatencies.reduce((sum, lat) => sum + lat, 0) / allLatencies.length;
      }
    }
  }, []);

  const trackError = useCallback((connectionId: string, error: any) => {
    console.error(`Realtime connection error for ${connectionId}:`, error);
    trackConnection(connectionId, 'error');
    metricsRef.current.errorRate++;
  }, [trackConnection]);

  // Monitor Supabase realtime connections
  useEffect(() => {
    const channel = supabase.channel('monitoring');
    
    const startTime = Date.now();
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const latency = Date.now() - startTime;
        trackMessage('main-channel', latency);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        trackConnection(key, 'connected');
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        trackConnection(key, 'disconnected');
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          trackConnection('main-channel', 'connected');
        } else if (status === 'CHANNEL_ERROR') {
          trackError('main-channel', 'Subscription failed');
        }
      });

    // Reset message rate counter every minute
    const resetInterval = setInterval(() => {
      metricsRef.current.messageRate = 0;
    }, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(resetInterval);
    };
  }, [trackConnection, trackMessage, trackError]);

  const getMetrics = useCallback(() => {
    return { ...metricsRef.current };
  }, []);

  const getConnections = useCallback(() => {
    return Array.from(connectionsRef.current.values());
  }, []);

  return {
    trackConnection,
    trackMessage,
    trackError,
    getMetrics,
    getConnections
  };
};
