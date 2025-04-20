
import React, { useEffect, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase-client';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader, Settings, Edit, Image } from 'lucide-react';
import { useFeed } from '@/hooks/use-feed';
import { MemoryCard } from '@/components/memory/MemoryCard';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { getUserFollowers, getUserFollowing } from '@/repositories/social/follows';

const Profile = () => {
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('memories');
  const { 
    profile, 
    isLoading: profileLoading, 
    updateProfile 
  } = useProfile(user?.id);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  
  const {
    memories,
    loading: memoriesLoading,
    hasMore,
    page,
    setPage,
    fetchMemories
  } = useFeed(user?.id);

  useEffect(() => {
    const getFollowerAndFollowingCounts = async () => {
      if (!user?.id) return;
      
      try {
        const followerData = await getUserFollowers(user.id);
        const followingData = await getUserFollowing(user.id);
        
        setFollowers(followerData.length);
        setFollowing(followingData.length);
      } catch (error) {
        console.error('Error fetching follower/following data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load social data',
          variant: 'destructive'
        });
      }
    };
    
    getFollowerAndFollowingCounts();
  }, [user?.id]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMemories(nextPage, 'forYou');
  };

  const isLoading = userLoading || profileLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <Loader className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Please sign in to view your profile</h2>
        <Button asChild>
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex flex-1 space-x-4 items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || user.email} />
              <AvatarFallback className="text-2xl">{(profile?.username?.[0] || user.email?.[0] || '').toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile?.username || user.email}</CardTitle>
              <CardDescription>{profile?.bio || 'No bio set yet'}</CardDescription>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-2 flex space-x-6">
            <div className="text-center">
              <p className="font-bold text-xl">{memories.length || 0}</p>
              <p className="text-sm text-gray-500">Cards</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-xl">{followers}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-xl">{following}</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="memories">My Cards</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="liked">Liked</TabsTrigger>
        </TabsList>
        
        <TabsContent value="memories">
          {memoriesLoading && memories.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="h-64 animate-pulse bg-gray-100"></Card>
              ))}
            </div>
          ) : memories.length === 0 ? (
            <div className="text-center py-16">
              <Image className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">No cards yet</h3>
              <p className="text-gray-500 mb-6">Start creating beautiful cards to share with the world</p>
              <Button asChild>
                <Link to="/editor">Create Your First Card</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memories.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} onReaction={() => {}} />
                ))}
              </div>
              
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button 
                    variant="outline" 
                    onClick={handleLoadMore} 
                    disabled={memoriesLoading}
                  >
                    {memoriesLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="collections">
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No collections yet</h3>
            <p className="text-gray-500 mb-6">Create collections to organize your cards</p>
            <Button asChild>
              <Link to="/collections">Create Collection</Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="liked">
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No liked cards</h3>
            <p className="text-gray-500 mb-6">Cards you like will appear here</p>
            <Button asChild>
              <Link to="/feed">Explore Feed</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
