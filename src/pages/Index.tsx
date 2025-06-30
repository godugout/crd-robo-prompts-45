
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Plus, 
  Palette, 
  Camera, 
  Users, 
  Trophy,
  ArrowRight,
  Play,
  Zap
} from 'lucide-react';

const Index: React.FC = () => {
  const features = [
    {
      id: 'create',
      title: 'Create Cards',
      description: 'Design stunning trading cards with our advanced creation tools',
      status: 'Active',
      route: '/create/enhanced',
      color: 'bg-crd-green',
      icon: Plus,
      features: ['AI-powered design', 'Professional frames', 'Advanced effects', 'Real-time preview']
    },
    {
      id: 'studio',
      title: 'Professional Studio',
      description: 'Advanced card creation with 3D preview and professional tools',
      status: 'Beta',
      route: '/studio',
      color: 'bg-blue-500',
      icon: Palette,
      features: ['3D card preview', 'Advanced lighting', 'Material editor', 'Export options']
    },
    {
      id: 'collections',
      title: 'Collections',
      description: 'Organize and showcase your card collections',
      status: 'Active',
      route: '/collections',
      color: 'bg-purple-500',
      icon: Camera,
      features: ['Collection management', 'Public galleries', 'Social features', 'Statistics']
    },
    {
      id: 'community',
      title: 'Community Hub',
      description: 'Connect with creators and discover amazing cards',
      status: 'Active',
      route: '/community',
      color: 'bg-orange-500',
      icon: Users,
      features: ['Creator profiles', 'Community feeds', 'Social features', 'Trending cards']
    },
    {
      id: 'dashboard',
      title: 'Creator Dashboard',
      description: 'Manage your creations and track performance',
      status: 'Active',
      route: '/creator-dashboard',
      color: 'bg-indigo-500',
      icon: Trophy,
      features: ['Analytics dashboard', 'Earnings tracking', 'Template management', 'Performance metrics']
    },
    {
      id: 'labs',
      title: 'CardShow Labs',
      description: 'Experimental features and cutting-edge tools',
      status: 'Experimental',
      route: '/labs',
      color: 'bg-red-500',
      icon: Zap,
      features: ['PSD processing', 'Advanced analysis', 'Experimental tools', 'Beta features']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-crd-green to-blue-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Welcome to CardShow</h1>
              <p className="text-gray-600">Create, collect, and share amazing trading cards</p>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-6">
              Transform your ideas into stunning digital trading cards with our professional-grade tools. 
              From simple designs to advanced 3D creations, CardShow has everything you need.
            </p>
            
            <div className="flex gap-3 justify-center mb-8">
              <Badge className="bg-crd-green/20 text-crd-green border-crd-green/50">
                <Play className="w-3 h-3 mr-1" />
                Get Started
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/50">
                <Sparkles className="w-3 h-3 mr-1" />
                Professional Tools
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Start CTA */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-crd-green/10 to-blue-500/10 border-crd-green/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-crd-green rounded-2xl flex items-center justify-center">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Start Creating Now</h3>
                    <p className="text-gray-600">Jump right into our enhanced card creator</p>
                  </div>
                </div>
                <Link to="/create/enhanced">
                  <Button className="bg-crd-green hover:bg-crd-green/90 text-white">
                    Create Your First Card
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
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
                        : feature.status === 'Beta'
                        ? 'border-blue-500/50 text-blue-600 bg-blue-50'
                        : 'border-orange-500/50 text-orange-600 bg-orange-50'
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
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features</h4>
                    <ul className="space-y-1">
                      {feature.features.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1 h-1 bg-crd-green rounded-full mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link to={feature.route}>
                    <Button 
                      variant="outline"
                      className="w-full border-gray-200 hover:border-crd-green hover:bg-crd-green hover:text-white transition-colors"
                    >
                      Explore
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Start Guide */}
        <Card className="bg-white border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Play className="w-5 h-5 text-crd-green" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-crd-green font-bold">1</span>
                </div>
                <h3 className="text-gray-900 font-medium mb-2">Choose Your Tool</h3>
                <p className="text-gray-600 text-sm">Select from our creation tools based on your needs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-crd-green font-bold">2</span>
                </div>
                <h3 className="text-gray-900 font-medium mb-2">Design & Create</h3>
                <p className="text-gray-600 text-sm">Use our intuitive tools to bring your vision to life</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-crd-green font-bold">3</span>
                </div>
                <h3 className="text-gray-900 font-medium mb-2">Share & Collect</h3>
                <p className="text-gray-600 text-sm">Export your creations and build your collection</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
