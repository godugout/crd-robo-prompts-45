
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCreatorCommunity } from '@/hooks/community/useCreatorCommunity';
import { Heart, MessageCircle, Share2, User, Calendar, Trophy, Sparkles } from 'lucide-react';

interface CreatorSocialProps {
  searchQuery: string;
}

export const CreatorSocial: React.FC<CreatorSocialProps> = ({ searchQuery }) => {
  const { activityFeed, loadingFeed, followCreator } = useCreatorCommunity();

  const filteredFeed = activityFeed.filter(activity =>
    activity.activity_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'template_published': return Sparkles;
      case 'collaboration_started': return User;
      case 'challenge_won': return Trophy;
      case 'course_completed': return Badge;
      case 'milestone_reached': return Trophy;
      default: return Sparkles;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'template_published': return 'text-blue-400';
      case 'collaboration_started': return 'text-green-400';
      case 'challenge_won': return 'text-yellow-400';
      case 'course_completed': return 'text-purple-400';
      case 'milestone_reached': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const formatActivityMessage = (activity: any) => {
    switch (activity.activity_type) {
      case 'template_published':
        return 'published a new template';
      case 'collaboration_started':
        return 'started a new collaboration';
      case 'challenge_won':
        return 'won a design challenge';
      case 'course_completed':
        return 'completed a course';
      case 'milestone_reached':
        return 'reached a new milestone';
      default:
        return 'had some activity';
    }
  };

  const getActivityDescription = (activityData: any) => {
    if (!activityData || typeof activityData !== 'object') {
      return 'No additional details available';
    }
    
    // Type guard to check if it's a plain object with description
    if (activityData && typeof activityData === 'object' && 'description' in activityData) {
      return typeof activityData.description === 'string' 
        ? activityData.description 
        : 'No additional details available';
    }
    
    return 'No additional details available';
  };

  if (loadingFeed) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="bg-crd-dark border-crd-mediumGray animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-crd-mediumGray rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-crd-mediumGray rounded mb-1"></div>
                  <div className="h-3 bg-crd-mediumGray rounded w-2/3"></div>
                </div>
              </div>
              <div className="h-3 bg-crd-mediumGray rounded mb-2"></div>
              <div className="h-3 bg-crd-mediumGray rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Creator Social Feed</h2>
        <p className="text-crd-lightGray">
          Stay updated with the latest activities from creators you follow
        </p>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        {filteredFeed.map((activity) => {
          const Icon = getActivityIcon(activity.activity_type);
          const iconColor = getActivityColor(activity.activity_type);
          
          return (
            <Card key={activity.id} className="bg-crd-dark border-crd-mediumGray hover:border-crd-green transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  {/* Creator Avatar */}
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder-avatar.png" />
                    <AvatarFallback className="bg-crd-mediumGray text-white">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    {/* Activity Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1 rounded-full ${iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className="text-white font-medium">Creator Name</span>
                        <span className="text-crd-lightGray ml-2">
                          {formatActivityMessage(activity)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-crd-lightGray text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(activity.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Activity Content */}
                    {activity.activity_data && (
                      <div className="bg-crd-mediumGray rounded-lg p-3 mb-3">
                        <p className="text-white text-sm">
                          {getActivityDescription(activity.activity_data)}
                        </p>
                      </div>
                    )}

                    {/* Activity Actions */}
                    <div className="flex items-center gap-4">
                      <Button size="sm" variant="ghost" className="text-crd-lightGray hover:text-white">
                        <Heart className="w-4 h-4 mr-1" />
                        Like
                      </Button>
                      <Button size="sm" variant="ghost" className="text-crd-lightGray hover:text-white">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Comment
                      </Button>
                      <Button size="sm" variant="ghost" className="text-crd-lightGray hover:text-white">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredFeed.length === 0 && (
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="text-center py-12">
            <Sparkles className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No activity found</h3>
            <p className="text-crd-lightGray mb-4">
              {searchQuery
                ? `No activities match "${searchQuery}"`
                : 'Follow some creators to see their latest activities here'
              }
            </p>
            <Button className="bg-crd-green hover:bg-green-600 text-black">
              Discover Creators
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
