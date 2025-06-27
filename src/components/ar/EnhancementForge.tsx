
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ARCreationStudio } from './ARCreationStudio';
import { TimeLapseCreationSystem } from './TimeLapseCreationSystem';
import { Smartphone, Clock, Sparkles, Eye } from 'lucide-react';

interface EnhancementForgeProps {
  className?: string;
}

export const EnhancementForge: React.FC<EnhancementForgeProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('ar-studio');
  const [createdCards, setCreatedCards] = useState<any[]>([]);
  const [activePortals, setActivePortals] = useState<string[]>([]);

  const handleCardCreate = (cardData: any) => {
    setCreatedCards(prev => [...prev, cardData]);
    console.log('Card created in AR:', cardData);
  };

  const handlePortalActivate = (cardId: string) => {
    setActivePortals(prev => [...prev, cardId]);
    console.log('Portal activated for card:', cardId);
  };

  const handleTimelapseSchedule = (event: any) => {
    console.log('Time-lapse event scheduled:', event);
  };

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-400" />
          The Enhancement Forge
          <Sparkles className="w-8 h-8 text-purple-400" />
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Step into the future of card creation with AR-first design tools, environmental effects, 
          and time-based evolution systems that bring your cards to life in the real world.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 h-auto">
          <TabsTrigger 
            value="ar-studio" 
            className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-purple-600"
          >
            <Smartphone className="w-5 h-5" />
            <span className="text-sm">AR Studio</span>
          </TabsTrigger>
          <TabsTrigger 
            value="environmental" 
            className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-blue-600"
          >
            <Eye className="w-5 h-5" />
            <span className="text-sm">Environmental</span>
          </TabsTrigger>
          <TabsTrigger 
            value="timelapse" 
            className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-green-600"
          >
            <Clock className="w-5 h-5" />
            <span className="text-sm">Time-Lapse</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="ar-studio" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <Smartphone className="w-6 h-6 text-purple-400" />
                AR Creation Studio
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Design cards in physical space using WebXR. Place virtual cards on real surfaces, 
                paint effects with hand gestures, and share through dimensional portals.
              </p>
            </div>
            
            <div className="h-[600px] rounded-xl overflow-hidden border border-purple-500/30">
              <ARCreationStudio
                onCardCreate={handleCardCreate}
                onPortalActivate={handlePortalActivate}
              />
            </div>
          </TabsContent>

          <TabsContent value="environmental" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <Eye className="w-6 h-6 text-blue-400" />
                Environmental Effects
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Cards that respond to real-world conditions. Weather integration makes them frost in winter, 
                shimmer in sunlight, and sparkle with raindrops during storms.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-900 to-cyan-900 text-white">
                <h3 className="text-xl font-bold mb-4">Weather Integration</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Rain Effects</span>
                    <Badge className="bg-blue-500/20 text-blue-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Snow Overlays</span>
                    <Badge className="bg-gray-500/20 text-gray-400">Seasonal</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Heat Waves</span>
                    <Badge className="bg-orange-500/20 text-orange-400">Summer</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Lightning Flash</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400">Storm</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-amber-900 to-orange-900 text-white">
                <h3 className="text-xl font-bold mb-4">Lighting Conditions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Sunlight Shimmer</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400">Bright</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Candlelight Glow</span>
                    <Badge className="bg-orange-500/20 text-orange-400">Warm</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Moonlight Tint</span>
                    <Badge className="bg-blue-500/20 text-blue-400">Cool</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Neon Reflection</span>
                    <Badge className="bg-purple-500/20 text-purple-400">Urban</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timelapse" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <Clock className="w-6 h-6 text-green-400" />
                Time-Lapse Evolution
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Schedule card transformations over days or weeks. Cards evolve based on real-world events, 
                sports scores, weather patterns, and astronomical phenomena.
              </p>
            </div>
            
            <TimeLapseCreationSystem
              cardId="demo-card"
              onScheduleEvent={handleTimelapseSchedule}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Enhancement Forge Stats */}
      <Card className="mt-8 p-6 bg-gradient-to-br from-slate-900 to-gray-900 text-white">
        <h3 className="text-xl font-bold mb-4 text-center">Enhancement Forge Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{createdCards.length}</div>
            <div className="text-sm opacity-75">AR Cards Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{activePortals.length}</div>
            <div className="text-sm opacity-75">Active Portals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">47</div>
            <div className="text-sm opacity-75">Scheduled Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">12</div>
            <div className="text-sm opacity-75">Environmental Effects</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
