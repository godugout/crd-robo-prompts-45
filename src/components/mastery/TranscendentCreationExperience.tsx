
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIDirectorOrchestrator } from './AIDirectorOrchestrator';
import { LegacyMentorshipSystem } from './LegacyMentorshipSystem';
import { PerformanceBudgetManager } from './PerformanceBudgetManager';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, Users, Zap, Star, 
  Sparkles, Trophy, Heart, Target 
} from 'lucide-react';

export const TranscendentCreationExperience: React.FC = () => {
  const [activeSystem, setActiveSystem] = useState('director');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      {/* Transcendent Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
          <Crown className="w-16 h-16 text-yellow-400" />
          <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
        </div>
        
        <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
          Transcendent Creation Experience
        </h1>
        
        <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-6">
          Where magic meets technology. An AI-orchestrated journey that transforms 
          card creation into a transcendent experience of mastery, mentorship, and community.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge className="bg-purple-600/20 text-purple-300 px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            AI Orchestrated
          </Badge>
          <Badge className="bg-yellow-600/20 text-yellow-400 px-4 py-2">
            <Trophy className="w-4 h-4 mr-2" />
            Mastery Moments
          </Badge>
          <Badge className="bg-pink-600/20 text-pink-300 px-4 py-2">
            <Heart className="w-4 h-4 mr-2" />
            Legacy System
          </Badge>
          <Badge className="bg-blue-600/20 text-blue-400 px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Quantum Achievements
          </Badge>
        </div>
      </div>

      {/* Main Experience Tabs */}
      <Tabs value={activeSystem} onValueChange={setActiveSystem} className="w-full max-w-7xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 bg-black/50 backdrop-blur h-auto mb-8">
          <TabsTrigger 
            value="director" 
            className="flex flex-col items-center gap-3 py-6 data-[state=active]:bg-purple-600/50"
          >
            <Crown className="w-8 h-8" />
            <div className="text-center">
              <div className="font-semibold">AI Director</div>
              <div className="text-xs opacity-75">Personal Guide</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="mentorship" 
            className="flex flex-col items-center gap-3 py-6 data-[state=active]:bg-yellow-600/50"
          >
            <Users className="w-8 h-8" />
            <div className="text-center">
              <div className="font-semibold">Legacy System</div>
              <div className="text-xs opacity-75">Master Techniques</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="performance" 
            className="flex flex-col items-center gap-3 py-6 data-[state=active]:bg-blue-600/50"
          >
            <Zap className="w-8 h-8" />
            <div className="text-center">
              <div className="font-semibold">Performance</div>
              <div className="text-xs opacity-75">Adaptive Quality</div>
            </div>
          </TabsTrigger>
        </TabsList>

        <div className="bg-black/20 backdrop-blur rounded-lg p-8">
          <TabsContent value="director" className="space-y-6 mt-0">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Crown className="w-8 h-8 text-purple-400" />
                AI Director Orchestration
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Your personal AI guide that analyzes your creative patterns, suggests challenges, 
                and orchestrates magical moments throughout your journey.
              </p>
            </div>
            <AIDirectorOrchestrator />
          </TabsContent>

          <TabsContent value="mentorship" className="space-y-6 mt-0">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Users className="w-8 h-8 text-yellow-400" />
                Legacy Mentorship System
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Learn from retired masters and inherit legendary techniques. 
                Carry forward creative traditions while evolving them for the future.
              </p>
            </div>
            <LegacyMentorshipSystem />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6 mt-0">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Zap className="w-8 h-8 text-blue-400" />
                Performance Excellence
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Adaptive quality system that ensures optimal performance across all devices. 
                From 120fps on high-end to 30fps on modest phones - nobody gets left behind.
              </p>
            </div>
            <PerformanceBudgetManager />
          </TabsContent>
        </div>
      </Tabs>

      {/* Floating Mastery Indicator */}
      <div className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-full shadow-lg shadow-purple-500/30">
        <Target className="w-6 h-6 text-white" />
      </div>
    </div>
  );
};
