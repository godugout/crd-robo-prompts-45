
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Award, 
  Sparkles,
  ArrowRight,
  Heart,
  Share2,
  Star
} from 'lucide-react';

const CommunityHubPage: React.FC = () => {
  const communityFeatures = [
    {
      id: 'creators',
      title: 'Creator Profiles',
      description: 'Discover talented creators and follow your favorites',
      status: 'Active',
      color: 'bg-crd-green',
      icon: Users,
      features: ['Creator portfolios', 'Follow system', 'Creator stats', 'Featured artists']
    },
    {
      id: 'discussions',
      title: 'Community Discussions',
      description: 'Join conversations about card design and collecting',
      status: 'Active',
      color: 'bg-blue-500',
      icon: MessageCircle,
      features: ['Discussion forums', 'Card critiques', 'Design tips', 'Community help']
    },
    {
      id: 'trending',
      title: 'Trending Content',
      description: 'Stay up to date with the latest popular cards and collections',
      status: 'Active',
      color: 'bg-purple-500',
      icon: TrendingUp,
      features: ['Popular cards', 'Trending collections', 'Weekly highlights', 'Community picks']
    },
    {
      id: 'contests',
      title: 'Community Contests',
      description: 'Participate in design challenges and competitions',
      status: 'Beta',
      color: 'bg-orange-500',
      icon: Award,
      features: ['Design challenges', 'Monthly contests', 'Community voting', 'Winner showcases']
    }
  ];

  const featuredCreators = [
    {
      name: 'CardMaster Pro',
      specialty: 'Sports Cards',
      followers: '2.4k',
      cards: 156,
      rating: 4.9
    },
    {
      name: 'Fantasy Artist',
      specialty: 'Fantasy Art',
      followers: '1.8k',
      cards: 89,
      rating: 4.8
    },
    {
      name: 'Retro Designer',
      specialty: 'Vintage Style',
      followers: '3.1k',
      cards: 203,
      rating: 4.9
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-crd-green to-blue-500 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Community Hub</h1>
              <p className="text-gray-600">Connect, discover, and share with fellow creators</p>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-6">
              Join our vibrant community of card creators and collectors. Share your work, 
              get feedback, and discover amazing creations from artists around the world.
            </p>
            
            <Badge className="bg-crd-green/20 text-crd-green border-crd-green/50 mb-8">
              <Users className="w-3 h-3 mr-1" />
              Active Community
            </Badge>
          </div>
        </div>

        {/* Join Community CTA */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-crd-green/10 to-blue-500/10 border-crd-green/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-crd-green rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Join the Community</h3>
                    <p className="text-gray-600">Connect with creators and share your work</p>
                  </div>
                </div>
                <Button className="bg-crd-green hover:bg-crd-green/90 text-white">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {communityFeatures.map((feature) => (
            <Card key={feature.id} className="bg-white border-gray-200 hover:border-crd-green/50 transition-all duration-300 group hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      feature.status === 'Active' 
                        ? 'border-green-500/50 text-green-600 bg-green-50'
                        : 'border-blue-500/50 text-blue-600 bg-blue-50'
                    }
                  >
                    {feature.status}
                  </Badge>
                </div>
                <CardTitle className="text-gray-900 text-lg mb-2">{feature.title}</CardTitle>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                    <ul className="space-y-1">
                      {feature.features.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1 h-1 bg-crd-green rounded-full mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-gray-200 hover:border-crd-green hover:bg-crd-green hover:text-white transition-colors"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Creators */}
        <Card className="bg-white border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-crd-green" />
              Featured Creators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredCreators.map((creator, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-crd-green/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{creator.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{creator.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{creator.specialty}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {creator.followers}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {creator.cards}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      Follow
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-crd-green" />
              Community Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">12.5k</div>
                <div className="text-sm text-gray-600">Active Creators</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">89.2k</div>
                <div className="text-sm text-gray-600">Cards Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">2.3k</div>
                <div className="text-sm text-gray-600">Collections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">156k</div>
                <div className="text-sm text-gray-600">Community Likes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityHubPage;
