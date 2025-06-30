
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  BarChart3, 
  DollarSign, 
  Settings, 
  Users,
  ArrowRight,
  TrendingUp,
  Eye,
  Heart,
  Download
} from 'lucide-react';

const CreatorDashboardPage: React.FC = () => {
  const dashboardFeatures = [
    {
      id: 'analytics',
      title: 'Performance Analytics',
      description: 'Track your card performance and audience engagement',
      status: 'Active',
      color: 'bg-crd-green',
      icon: BarChart3,
      features: ['View statistics', 'Engagement metrics', 'Growth tracking', 'Audience insights']
    },
    {
      id: 'earnings',
      title: 'Earnings Tracking',
      description: 'Monitor your revenue and financial performance',
      status: 'Active',
      color: 'bg-blue-500',
      icon: DollarSign,
      features: ['Revenue reports', 'Payment history', 'Earnings forecasts', 'Financial insights']
    },
    {
      id: 'templates',
      title: 'Template Management',
      description: 'Manage your card templates and design assets',
      status: 'Active',
      color: 'bg-purple-500',
      icon: Settings,
      features: ['Template library', 'Asset management', 'Version control', 'Sharing settings']
    },
    {
      id: 'audience',
      title: 'Audience Insights',
      description: 'Understand your followers and community engagement',
      status: 'Beta',
      color: 'bg-orange-500',
      icon: Users,
      features: ['Follower analytics', 'Engagement patterns', 'Demographic data', 'Growth trends']
    }
  ];

  const recentStats = [
    { label: 'Total Views', value: '24.8k', change: '+12%', icon: Eye },
    { label: 'Likes Received', value: '3.2k', change: '+8%', icon: Heart },
    { label: 'Downloads', value: '891', change: '+23%', icon: Download },
    { label: 'Followers', value: '1.4k', change: '+15%', icon: Users }
  ];

  const topPerformingCards = [
    {
      title: 'Legendary Dragon',
      views: '2.3k',
      likes: 456,
      downloads: 89
    },
    {
      title: 'Cyber Warrior',
      views: '1.8k',
      likes: 321,
      downloads: 67
    },
    {
      title: 'Mystic Forest',
      views: '1.5k',
      likes: 298,
      downloads: 45
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-crd-green to-blue-500 rounded-2xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Creator Dashboard</h1>
              <p className="text-gray-600">Track your performance and manage your creations</p>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-6">
              Get insights into your card performance, track earnings, manage templates, 
              and understand your audience with comprehensive analytics tools.
            </p>
            
            <Badge className="bg-crd-green/20 text-crd-green border-crd-green/50 mb-8">
              <Trophy className="w-3 h-3 mr-1" />
              Creator Tools
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {recentStats.map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <div className="w-10 h-10 bg-crd-green/20 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-crd-green" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-crd-green/10 to-blue-500/10 border-crd-green/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-crd-green rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">View Detailed Analytics</h3>
                    <p className="text-gray-600">Get comprehensive insights into your performance</p>
                  </div>
                </div>
                <Button className="bg-crd-green hover:bg-crd-green/90 text-white">
                  Open Analytics
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {dashboardFeatures.map((feature) => (
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
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Performing Cards */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-crd-green" />
              Top Performing Cards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingCards.map((card, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{card.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {card.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {card.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {card.downloads}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorDashboardPage;
