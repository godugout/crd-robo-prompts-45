
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Zap, Star, TrendingUp, MapPin } from 'lucide-react';

interface TimeLapseEvent {
  id: string;
  type: 'weather' | 'sports' | 'astronomical' | 'social';
  trigger: string;
  effect: string;
  scheduledFor: Date;
  duration: number; // in milliseconds
  completed: boolean;
}

interface TimeLapseCreationSystemProps {
  cardId: string;
  onScheduleEvent: (event: TimeLapseEvent) => void;
}

export const TimeLapseCreationSystem: React.FC<TimeLapseCreationSystemProps> = ({
  cardId,
  onScheduleEvent
}) => {
  const [activeEvents, setActiveEvents] = useState<TimeLapseEvent[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<string>('weather');
  
  const eventTemplates = {
    weather: [
      { trigger: 'rain', effect: 'Add shimmer droplets', duration: 3600000 },
      { trigger: 'snow', effect: 'Frost overlay appears', duration: 7200000 },
      { trigger: 'sunny', effect: 'Warm glow intensifies', duration: 1800000 },
      { trigger: 'storm', effect: 'Lightning effect pulses', duration: 900000 }
    ],
    sports: [
      { trigger: 'team_win', effect: 'Victory particles', duration: 86400000 },
      { trigger: 'season_start', effect: 'Team colors brighten', duration: 604800000 },
      { trigger: 'record_broken', effect: 'Record holder glow', duration: 172800000 }
    ],
    astronomical: [
      { trigger: 'full_moon', effect: 'Lunar silver tint', duration: 86400000 },
      { trigger: 'solar_eclipse', effect: 'Shadow corona', duration: 7200000 },
      { trigger: 'meteor_shower', effect: 'Shooting star trails', duration: 3600000 },
      { trigger: 'solstice', effect: 'Seasonal color shift', duration: 86400000 }
    ],
    social: [
      { trigger: 'viral_trend', effect: 'Trending sparkles', duration: 172800000 },
      { trigger: 'community_milestone', effect: 'Achievement badge', duration: 604800000 },
      { trigger: 'creator_anniversary', effect: 'Memory montage', duration: 86400000 }
    ]
  };

  useEffect(() => {
    // Simulate checking for triggered events
    const checkEvents = () => {
      setActiveEvents(prev => prev.map(event => {
        if (!event.completed && new Date() >= event.scheduledFor) {
          // Trigger the event
          console.log(`Triggering event: ${event.effect}`);
          return { ...event, completed: true };
        }
        return event;
      }));
    };

    const interval = setInterval(checkEvents, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const scheduleEvent = (template: any) => {
    const scheduledFor = new Date();
    scheduledFor.setMinutes(scheduledFor.getMinutes() + Math.random() * 60); // Random time in next hour

    const newEvent: TimeLapseEvent = {
      id: `event-${Date.now()}`,
      type: selectedEventType as any,
      trigger: template.trigger,
      effect: template.effect,
      scheduledFor,
      duration: template.duration,
      completed: false
    };

    setActiveEvents(prev => [...prev, newEvent]);
    onScheduleEvent(newEvent);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'weather': return <MapPin className="w-4 h-4" />;
      case 'sports': return <Star className="w-4 h-4" />;
      case 'astronomical': return <Zap className="w-4 h-4" />;
      case 'social': return <TrendingUp className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTimeUntilEvent = (scheduledFor: Date) => {
    const now = new Date();
    const diff = scheduledFor.getTime() - now.getTime();
    
    if (diff <= 0) return 'Now';
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Time-Lapse Creation
          </h3>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
            {activeEvents.filter(e => !e.completed).length} Scheduled
          </Badge>
        </div>

        <Tabs value={selectedEventType} onValueChange={setSelectedEventType}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="astronomical">Astro</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          {Object.entries(eventTemplates).map(([type, templates]) => (
            <TabsContent key={type} value={type} className="space-y-3">
              <div className="text-sm text-gray-300 mb-3">
                Schedule automatic card transformations based on real-world {type} events
              </div>
              
              {templates.map((template, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getEventIcon(type)}
                    <div>
                      <div className="font-medium">{template.effect}</div>
                      <div className="text-xs text-gray-400">
                        Trigger: {template.trigger} • Duration: {Math.floor(template.duration / 3600000)}h
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => scheduleEvent(template)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Schedule
                  </Button>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* Active Events */}
        {activeEvents.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Scheduled Transformations</h4>
            {activeEvents.map(event => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border ${
                  event.completed 
                    ? 'bg-green-500/10 border-green-500/50' 
                    : 'bg-blue-500/10 border-blue-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getEventIcon(event.type)}
                    <span className="font-medium">{event.effect}</span>
                  </div>
                  <Badge 
                    className={
                      event.completed 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }
                  >
                    {event.completed ? 'Active' : getTimeUntilEvent(event.scheduledFor)}
                  </Badge>
                </div>
                
                {!event.completed && (
                  <Progress
                    value={Math.max(0, 100 - ((event.scheduledFor.getTime() - Date.now()) / event.duration * 100))}
                    className="h-1"
                  />
                )}
                
                <div className="text-xs text-gray-400 mt-1">
                  {event.completed ? 'Transformation active' : `Scheduled for ${event.scheduledFor.toLocaleTimeString()}`}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="text-sm font-medium text-purple-400 mb-2">Pro Tips:</div>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Weather effects sync with your local conditions</li>
            <li>• Sports events track your favorite teams</li>
            <li>• Astronomical events follow real celestial phenomena</li>
            <li>• Social effects respond to community engagement</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
