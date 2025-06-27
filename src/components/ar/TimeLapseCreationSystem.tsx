
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Calendar, Zap, Play, Pause, Settings } from 'lucide-react';

export interface TimeLapseCreationSystemProps {
  onTransformationScheduled: (data: any) => void;
  onEvolutionCompleted: (data: any) => void;
}

export const TimeLapseCreationSystem: React.FC<TimeLapseCreationSystemProps> = ({
  onTransformationScheduled,
  onEvolutionCompleted
}) => {
  const [activeTransformations, setActiveTransformations] = useState<any[]>([]);
  const [scheduledEvents, setScheduledEvents] = useState<any[]>([]);
  const [selectedTrigger, setSelectedTrigger] = useState('time');

  const handleScheduleTransformation = () => {
    const transformation = {
      id: Date.now().toString(),
      type: selectedTrigger,
      scheduled_at: new Date(),
      card_id: 'sample-card',
      trigger_conditions: ['time_passed', 'event_occurred']
    };

    setScheduledEvents(prev => [...prev, transformation]);
    onTransformationScheduled(transformation);
  };

  const handleEvolutionComplete = (data: any) => {
    setActiveTransformations(prev => prev.filter(t => t.id !== data.id));
    onEvolutionCompleted(data);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
              <Clock className="w-4 h-4 mr-2" />
              Time-Lapse Active
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              {scheduledEvents.length} Scheduled
            </Badge>
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="absolute top-20 left-4 z-50 w-80">
        <Card className="p-4 bg-black/50 backdrop-blur border-white/10">
          <div className="space-y-4">
            <h3 className="text-white font-medium">Schedule Transformation</h3>
            
            <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">Time-based</SelectItem>
                <SelectItem value="event">Event-based</SelectItem>
                <SelectItem value="sports">Sports Score</SelectItem>
                <SelectItem value="astronomical">Astronomical</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={handleScheduleTransformation}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>
        </Card>
      </div>

      {/* Scheduled Events */}
      <div className="absolute bottom-4 left-4 z-50 w-80 max-h-60 overflow-y-auto">
        <Card className="p-4 bg-black/50 backdrop-blur border-white/10">
          <h4 className="text-white font-medium mb-3">Scheduled Events</h4>
          <div className="space-y-2">
            {scheduledEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                <div>
                  <span className="text-white text-sm">{event.type}</span>
                  <p className="text-gray-400 text-xs">{event.scheduled_at.toLocaleString()}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Pending
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 3D Visualization */}
      <Canvas className="w-full h-full">
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Simple placeholder for transformation visualization */}
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
      </Canvas>
    </div>
  );
};
