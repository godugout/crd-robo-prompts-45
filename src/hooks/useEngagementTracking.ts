
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EngagementEvent {
  eventType: string;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  properties: Record<string, any>;
}

interface ConversionFunnel {
  step: string;
  users: number;
  conversionRate: number;
}

interface UserBehavior {
  pageViews: number;
  sessionDuration: number;
  bounceRate: number;
  featureInteractions: Record<string, number>;
  conversionEvents: number;
}

export const useEngagementTracking = () => {
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [sessionStart] = useState(() => Date.now());
  const [events, setEvents] = useState<EngagementEvent[]>([]);
  const [funnelData, setFunnelData] = useState<ConversionFunnel[]>([
    { step: 'Landing Page', users: 1000, conversionRate: 100 },
    { step: 'Sign Up', users: 250, conversionRate: 25 },
    { step: 'First Card Created', users: 180, conversionRate: 18 },
    { step: 'Card Published', users: 120, conversionRate: 12 },
    { step: 'Premium Upgrade', users: 45, conversionRate: 4.5 }
  ]);

  const trackEvent = useCallback(async (eventType: string, properties: Record<string, any> = {}) => {
    const event: EngagementEvent = {
      eventType,
      timestamp: new Date(),
      sessionId,
      properties
    };

    setEvents(prev => [...prev, event]);

    try {
      // In production, send to analytics service or Supabase
      console.log('Engagement Event:', event);
      
      // Example: Save to Supabase analytics table
      // await supabase.from('analytics_events').insert({
      //   event_type: eventType,
      //   session_id: sessionId,
      //   properties,
      //   timestamp: event.timestamp.toISOString()
      // });
    } catch (error) {
      console.error('Failed to track engagement event:', error);
    }
  }, [sessionId]);

  const trackPageView = useCallback((page: string) => {
    trackEvent('page_view', { page, timestamp: Date.now() });
  }, [trackEvent]);

  const trackFeatureUsage = useCallback((feature: string, duration?: number) => {
    trackEvent('feature_usage', { feature, duration });
  }, [trackEvent]);

  const trackConversion = useCallback((step: string, value?: number) => {
    trackEvent('conversion', { step, value });
  }, [trackEvent]);

  const getSessionMetrics = useCallback((): UserBehavior => {
    const sessionDuration = Date.now() - sessionStart;
    const pageViews = events.filter(e => e.eventType === 'page_view').length;
    const featureInteractions = events
      .filter(e => e.eventType === 'feature_usage')
      .reduce((acc, event) => {
        const feature = event.properties.feature;
        acc[feature] = (acc[feature] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      pageViews,
      sessionDuration: sessionDuration / 1000, // Convert to seconds
      bounceRate: pageViews <= 1 ? 100 : 0,
      featureInteractions,
      conversionEvents: events.filter(e => e.eventType === 'conversion').length
    };
  }, [events, sessionStart]);

  const getConversionFunnel = useCallback(() => {
    return funnelData;
  }, [funnelData]);

  // Track page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackEvent('page_hidden');
      } else {
        trackEvent('page_visible');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [trackEvent]);

  // Track session end
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionMetrics = getSessionMetrics();
      trackEvent('session_end', sessionMetrics);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [trackEvent, getSessionMetrics]);

  // Auto-track common interactions
  useEffect(() => {
    const trackClicks = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const buttonText = target.textContent || 'Unknown Button';
        trackEvent('button_click', { buttonText, element: target.tagName });
      }
    };

    const trackFormSubmissions = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      trackEvent('form_submit', { formId: form.id || 'unknown' });
    };

    document.addEventListener('click', trackClicks);
    document.addEventListener('submit', trackFormSubmissions);

    return () => {
      document.removeEventListener('click', trackClicks);
      document.removeEventListener('submit', trackFormSubmissions);
    };
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackFeatureUsage,
    trackConversion,
    getSessionMetrics,
    getConversionFunnel,
    events,
    sessionId
  };
};
