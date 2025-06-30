
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, MessageCircle, Heart, Share2,
  TrendingUp, Award, Calendar
} from 'lucide-react';

export const CommunityHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Community Hub</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect with creators, share your work, and discover amazing cards from the community.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/50 backdrop-blur mb-8">
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-4 bg-black/30 border-white/20">
                  <div className="aspect-[3/4] bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mb-4"></div>
                  <h3 className="text-white font-semibold mb-2">Epic Fantasy Card #{i}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>by Creator{i}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{12 + i}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{3 + i}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="space-y-4">
              <Card className="p-6 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Weekly Theme: Nature</h3>
                  <Badge className="bg-yellow-500/20 text-yellow-400">Active</Badge>
                </div>
                <p className="text-gray-300 mb-4">Create cards inspired by the natural world. Best submissions win prizes!</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">23 submissions • 4 days left</span>
                  <Button className="bg-yellow-600 hover:bg-yellow-700">Join Challenge</Button>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Beginner's Contest</h3>
                  <Badge className="bg-blue-500/20 text-blue-400">New</Badge>
                </div>
                <p className="text-gray-300 mb-4">First time creating? This challenge is perfect for newcomers!</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">8 submissions • 6 days left</span>
                  <Button className="bg-blue-600 hover:bg-blue-700">Join Challenge</Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Upcoming Events</h3>
              <p className="text-gray-400">Check back soon for community events and workshops!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
