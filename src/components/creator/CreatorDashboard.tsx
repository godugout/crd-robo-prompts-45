
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, Trophy, TrendingUp, Star,
  Palette, Users, Zap, Target
} from 'lucide-react';

export const CreatorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Trophy className="w-12 h-12 text-yellow-400" />
          <User className="w-16 h-16 text-purple-400" />
          <Star className="w-12 h-12 text-yellow-400" />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          Creator Dashboard
        </h1>
        
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
          Track your progress, discover new techniques, and connect with the CardShow community.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge className="bg-purple-600/20 text-purple-300 px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            Creator Level 3
          </Badge>
          <Badge className="bg-yellow-600/20 text-yellow-400 px-4 py-2">
            <Trophy className="w-4 h-4 mr-2" />
            5 Cards Created
          </Badge>
          <Badge className="bg-blue-600/20 text-blue-400 px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            Community Member
          </Badge>
        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 bg-black/50 backdrop-blur h-auto mb-8">
          <TabsTrigger 
            value="overview" 
            className="flex flex-col items-center gap-3 py-6 data-[state=active]:bg-purple-600/50"
          >
            <TrendingUp className="w-6 h-6" />
            <span className="font-semibold">Overview</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="skills" 
            className="flex flex-col items-center gap-3 py-6 data-[state=active]:bg-yellow-600/50"
          >
            <Palette className="w-6 h-6" />
            <span className="font-semibold">Skills</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="community" 
            className="flex flex-col items-center gap-3 py-6 data-[state=active]:bg-blue-600/50"
          >
            <Users className="w-6 h-6" />
            <span className="font-semibold">Community</span>
          </TabsTrigger>
        </TabsList>

        <div className="bg-black/20 backdrop-blur rounded-lg p-8">
          <TabsContent value="overview" className="space-y-6 mt-0">
            <h2 className="text-2xl font-bold text-white mb-6">Your Progress</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/30 border-white/20">
                <h3 className="text-white font-semibold mb-4">Cards Created</h3>
                <div className="text-3xl font-bold text-purple-400 mb-2">5</div>
                <Progress value={50} className="mb-2" />
                <p className="text-sm text-gray-400">5 more to reach Level 4</p>
              </Card>

              <Card className="p-6 bg-black/30 border-white/20">
                <h3 className="text-white font-semibold mb-4">Community Likes</h3>
                <div className="text-3xl font-bold text-yellow-400 mb-2">23</div>
                <Progress value={30} className="mb-2" />
                <p className="text-sm text-gray-400">Great engagement!</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6 mt-0">
            <h2 className="text-2xl font-bold text-white mb-6">Skill Development</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Palette className="w-6 h-6 text-purple-400" />
                  <span className="text-white">Design Fundamentals</span>
                </div>
                <Badge variant="outline" className="text-purple-300">Intermediate</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <span className="text-white">Effects & Animation</span>
                </div>
                <Badge variant="outline" className="text-yellow-300">Beginner</Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6 mt-0">
            <h2 className="text-2xl font-bold text-white mb-6">Community Activity</h2>
            
            <Card className="p-6 bg-black/30 border-white/20">
              <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Created "Sunset Warrior" card</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Received 5 likes on "Mountain Dragon"</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
