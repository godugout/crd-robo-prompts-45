
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  User, Trophy, TrendingUp, Star, Palette, Users, Zap, Target,
  Plus, Award, BarChart3, Crown
} from 'lucide-react';

export const CreatorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-crd-darkest via-crd-dark to-crd-darkGray border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-crd-green rounded-xl flex items-center justify-center">
                <Crown className="w-8 h-8 text-black" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Creator Dashboard
            </h1>
            
            <p className="text-xl text-crd-lightGray max-w-3xl mx-auto mb-8">
              Track your progress, discover new techniques, and connect with the CardShow community.
            </p>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-crd-dark border-crd-mediumGray/20 p-6 text-center">
                <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Palette className="w-6 h-6 text-crd-green" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">5</div>
                <div className="text-sm text-crd-lightGray">Cards Created</div>
              </Card>

              <Card className="bg-crd-dark border-crd-mediumGray/20 p-6 text-center">
                <div className="w-12 h-12 bg-crd-orange/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-crd-orange" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">23</div>
                <div className="text-sm text-crd-lightGray">Community Likes</div>
              </Card>

              <Card className="bg-crd-dark border-crd-mediumGray/20 p-6 text-center">
                <div className="w-12 h-12 bg-crd-blue/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-crd-blue" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">Level 3</div>
                <div className="text-sm text-crd-lightGray">Creator Level</div>
              </Card>

              <Card className="bg-crd-dark border-crd-mediumGray/20 p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">12</div>
                <div className="text-sm text-crd-lightGray">Followers</div>
              </Card>
            </div>

            {/* Badges */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge className="bg-crd-green/20 text-crd-green border-crd-green/30 px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                Creator Level 3
              </Badge>
              <Badge className="bg-crd-orange/20 text-crd-orange border-crd-orange/30 px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                5 Cards Created
              </Badge>
              <Badge className="bg-crd-blue/20 text-crd-blue border-crd-blue/30 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Community Member
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-crd-dark border-crd-mediumGray/20 h-auto mb-8">
            <TabsTrigger 
              value="overview" 
              className="flex flex-col items-center gap-3 py-6 data-[state=active]:bg-crd-green data-[state=active]:text-black text-crd-lightGray"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="font-semibold">Overview</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="skills" 
              className="flex flex-col items-center gap-3 py-6 data-[state=active]:bg-crd-orange data-[state=active]:text-black text-crd-lightGray"
            >
              <Palette className="w-6 h-6" />
              <span className="font-semibold">Skills</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="community" 
              className="flex flex-col items-center gap-3 py-6 data-[state=active]:bg-crd-blue data-[state=active]:text-black text-crd-lightGray"
            >
              <Users className="w-6 h-6" />
              <span className="font-semibold">Community</span>
            </TabsTrigger>
          </TabsList>

          <div className="bg-crd-dark/50 backdrop-blur rounded-xl border border-crd-mediumGray/20 p-8">
            <TabsContent value="overview" className="space-y-6 mt-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Progress</h2>
                <Button className="bg-crd-green hover:bg-crd-green/90 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Card
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-crd-darkGray border-crd-mediumGray/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-crd-green/20 rounded-lg flex items-center justify-center">
                      <Palette className="w-5 h-5 text-crd-green" />
                    </div>
                    <h3 className="text-white font-semibold">Cards Created</h3>
                  </div>
                  <div className="text-3xl font-bold text-crd-green mb-2">5</div>
                  <Progress value={50} className="mb-2 bg-crd-mediumGray" />
                  <p className="text-sm text-crd-lightGray">5 more to reach Level 4</p>
                </Card>

                <Card className="p-6 bg-crd-darkGray border-crd-mediumGray/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-crd-orange/20 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-crd-orange" />
                    </div>
                    <h3 className="text-white font-semibold">Community Likes</h3>
                  </div>
                  <div className="text-3xl font-bold text-crd-orange mb-2">23</div>
                  <Progress value={30} className="mb-2 bg-crd-mediumGray" />
                  <p className="text-sm text-crd-lightGray">Great engagement!</p>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="p-6 bg-crd-darkGray border-crd-mediumGray/20">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-crd-blue" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-crd-lightGray">
                    <div className="w-2 h-2 bg-crd-green rounded-full"></div>
                    <span>Created "Sunset Warrior" card</span>
                    <span className="text-xs text-crd-lightGray ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-crd-lightGray">
                    <div className="w-2 h-2 bg-crd-blue rounded-full"></div>
                    <span>Received 5 likes on "Mountain Dragon"</span>
                    <span className="text-xs text-crd-lightGray ml-auto">1 day ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-crd-lightGray">
                    <div className="w-2 h-2 bg-crd-orange rounded-full"></div>
                    <span>Reached Level 3 creator status</span>
                    <span className="text-xs text-crd-lightGray ml-auto">3 days ago</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6 mt-0">
              <h2 className="text-2xl font-bold text-white mb-6">Skill Development</h2>
              
              <div className="space-y-4">
                <Card className="p-6 bg-crd-darkGray border-crd-mediumGray/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-crd-green/20 rounded-lg flex items-center justify-center">
                        <Palette className="w-5 h-5 text-crd-green" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Design Fundamentals</h3>
                        <p className="text-sm text-crd-lightGray">Color theory, composition, typography</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-crd-green border-crd-green/30">Intermediate</Badge>
                  </div>
                  <Progress value={65} className="bg-crd-mediumGray" />
                </Card>

                <Card className="p-6 bg-crd-darkGray border-crd-mediumGray/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-crd-orange/20 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-crd-orange" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Effects & Animation</h3>
                        <p className="text-sm text-crd-lightGray">Motion graphics, transitions, particles</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-crd-orange border-crd-orange/30">Beginner</Badge>
                  </div>
                  <Progress value={25} className="bg-crd-mediumGray" />
                </Card>

                <Card className="p-6 bg-crd-darkGray border-crd-mediumGray/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-crd-blue/20 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-crd-blue" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">3D Modeling</h3>
                        <p className="text-sm text-crd-lightGray">Depth, lighting, materials</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-crd-blue border-crd-blue/30">Advanced</Badge>
                  </div>
                  <Progress value={85} className="bg-crd-mediumGray" />
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="community" className="space-y-6 mt-0">
              <h2 className="text-2xl font-bold text-white mb-6">Community Activity</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-crd-darkGray border-crd-mediumGray/20">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-crd-blue" />
                    Community Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-crd-lightGray">Total Followers</span>
                      <span className="text-white font-semibold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-crd-lightGray">Following</span>
                      <span className="text-white font-semibold">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-crd-lightGray">Total Likes Received</span>
                      <span className="text-white font-semibold">23</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-crd-darkGray border-crd-mediumGray/20">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-crd-orange" />
                    Achievements
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-crd-green/20 rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-crd-green" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">First Card</div>
                        <div className="text-xs text-crd-lightGray">Created your first card</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-crd-orange/20 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-crd-orange" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">Rising Star</div>
                        <div className="text-xs text-crd-lightGray">Received 10+ likes</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
