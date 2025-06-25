
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreatorForums } from './CreatorForums';
import { CreatorChallenges } from './CreatorChallenges';
import { CreatorEducation } from './CreatorEducation';
import { CreatorCollaboration } from './CreatorCollaboration';
import { CreatorSocial } from './CreatorSocial';
import { CreatorAnalytics } from './CreatorAnalytics';
import { useCreatorCommunity } from '@/hooks/community/useCreatorCommunity';
import { useCreatorProfile } from '@/hooks/creator/useCreatorProfile';
import { Users, Trophy, BookOpen, GitBranch, Activity, BarChart3, Search, Bell } from 'lucide-react';

export const CreatorCommunityHub: React.FC = () => {
  const { profile, isVerified } = useCreatorProfile();
  const { activityFeed, loadingFeed } = useCreatorCommunity();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('forums');

  if (!profile) {
    return (
      <div className="min-h-screen bg-crd-darkest p-6 flex items-center justify-center">
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-4">Creator Profile Required</h2>
            <p className="text-crd-lightGray mb-6">
              You need to create a creator profile to access the community features.
            </p>
            <Button className="bg-crd-green hover:bg-green-600 text-black">
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabItems = [
    { id: 'forums', label: 'Forums', icon: Users, description: 'Discuss and share with fellow creators' },
    { id: 'challenges', label: 'Challenges', icon: Trophy, description: 'Compete in design contests' },
    { id: 'education', label: 'Learn', icon: BookOpen, description: 'Courses and workshops' },
    { id: 'collaboration', label: 'Collaborate', icon: GitBranch, description: 'Work together on projects' },
    { id: 'social', label: 'Social', icon: Activity, description: 'Follow creators and stay updated' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Track your performance' },
  ];

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-dark border-b border-crd-mediumGray p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Creator Community</h1>
              <p className="text-crd-lightGray">
                Connect, learn, and grow with fellow creators
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isVerified && (
                <Badge className="bg-crd-green text-black">
                  Verified Creator
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray" />
            <Input
              placeholder="Search community..."
              className="pl-10 bg-crd-mediumGray border-crd-lightGray text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          {/* Navigation */}
          <div className="mb-6">
            <TabsList className="grid grid-cols-6 w-full bg-crd-mediumGray">
              {tabItems.map(({ id, label, icon: Icon }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="flex items-center gap-2 data-[state=active]:bg-crd-green data-[state=active]:text-black"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <TabsContent value="forums" className="mt-0">
                <CreatorForums searchQuery={searchQuery} />
              </TabsContent>

              <TabsContent value="challenges" className="mt-0">
                <CreatorChallenges searchQuery={searchQuery} />
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <CreatorEducation searchQuery={searchQuery} />
              </TabsContent>

              <TabsContent value="collaboration" className="mt-0">
                <CreatorCollaboration searchQuery={searchQuery} />
              </TabsContent>

              <TabsContent value="social" className="mt-0">
                <CreatorSocial searchQuery={searchQuery} />
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <CreatorAnalytics />
              </TabsContent>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="bg-crd-dark border-crd-mediumGray">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-crd-lightGray">Templates</span>
                    <span className="text-white font-semibold">{profile.cards_created}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-crd-lightGray">Earnings</span>
                    <span className="text-crd-green font-semibold">
                      ${profile.total_earnings.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-crd-lightGray">Rating</span>
                    <span className="text-white font-semibold">
                      {profile.avg_rating.toFixed(1)} ★
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-crd-dark border-crd-mediumGray">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loadingFeed ? (
                    <div className="text-crd-lightGray">Loading...</div>
                  ) : activityFeed.length > 0 ? (
                    activityFeed.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="text-sm">
                        <div className="text-white">
                          {activity.activity_type.replace('_', ' ')}
                        </div>
                        <div className="text-crd-lightGray text-xs">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-crd-lightGray text-sm">
                      No recent activity
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Featured Programs */}
              <Card className="bg-crd-dark border-crd-mediumGray">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Featured Programs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-crd-mediumGray rounded-lg">
                    <h4 className="text-white font-semibold mb-1">Creator Residency</h4>
                    <p className="text-crd-lightGray text-sm mb-2">
                      6-month program with guaranteed income
                    </p>
                    <Button size="sm" className="bg-crd-green hover:bg-green-600 text-black">
                      Apply Now
                    </Button>
                  </div>
                  
                  <div className="p-3 bg-crd-mediumGray rounded-lg">
                    <h4 className="text-white font-semibold mb-1">Ambassador Program</h4>
                    <p className="text-crd-lightGray text-sm mb-2">
                      Represent Cardshow at events
                    </p>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
