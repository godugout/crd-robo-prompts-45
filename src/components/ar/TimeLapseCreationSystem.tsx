
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Zap } from 'lucide-react';

interface TimeLapseCreationSystemProps {
  onTransformationScheduled: (data: any) => void;
  onEvolutionCompleted: (data: any) => void;
}

export const TimeLapseCreationSystem: React.FC<TimeLapseCreationSystemProps> = ({
  onTransformationScheduled,
  onEvolutionCompleted
}) => {
  const [activeTransformations, setActiveTransformations] = useState<string[]>([]);

  const handleScheduleTransformation = (type: string) => {
    const transformationId = `transform-${Date.now()}`;
    setActiveTransformations(prev => [...prev, transformationId]);
    
    onTransformationScheduled({
      id: transformationId,
      type,
      scheduledAt: new Date(),
      duration: 5000
    });

    // Simulate completion
    setTimeout(() => {
      setActiveTransformations(prev => prev.filter(id => id !== transformationId));
      onEvolutionCompleted({
        id: transformationId,
        completedAt: new Date()
      });
    }, 5000);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Time-Lapse Creation System
          </h1>
          <p className="text-white/80 text-lg">
            Schedule card transformations based on real-world events
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-black/50 backdrop-blur border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-400" />
              <h3 className="text-white font-semibold">Scheduled Events</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Transform cards based on time-based triggers
            </p>
            <Button 
              onClick={() => handleScheduleTransformation('time-based')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Schedule Transformation
            </Button>
          </Card>

          <Card className="p-6 bg-black/50 backdrop-blur border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-green-400" />
              <h3 className="text-white font-semibold">Sports Events</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              React to live sports scores and results
            </p>
            <Button 
              onClick={() => handleScheduleTransformation('sports-based')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Link to Sports API
            </Button>
          </Card>

          <Card className="p-6 bg-black/50 backdrop-blur border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-purple-400" />
              <h3 className="text-white font-semibold">Astronomical</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Transform with moon phases and celestial events
            </p>
            <Button 
              onClick={() => handleScheduleTransformation('astronomical')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Sync with Stars
            </Button>
          </Card>
        </div>

        {/* Active Transformations */}
        {activeTransformations.length > 0 && (
          <Card className="p-6 bg-black/50 backdrop-blur border-white/10">
            <h3 className="text-white font-semibold mb-4">Active Transformations</h3>
            <div className="space-y-2">
              {activeTransformations.map(id => (
                <div key={id} className="flex items-center gap-3">
                  <Badge className="bg-yellow-500/20 text-yellow-400">
                    Processing
                  </Badge>
                  <span className="text-white/70 text-sm">{id}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
