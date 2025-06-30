
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Users, 
  Trophy,
  Plus,
  Grid,
  User,
  Beaker,
  cn
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const features = [
    {
      id: 'create',
      title: 'Create Cards',
      description: 'Design stunning cards with our advanced creation tools',
      icon: Plus,
      color: 'bg-crd-green',
      href: '/create'
    },
    {
      id: 'collections',
      title: 'Manage Collections',
      description: 'Organize and showcase your card collections',
      icon: Grid,
      color: 'bg-blue-500',
      href: '/collections'
    },
    {
      id: 'community',
      title: 'Join Community',
      description: 'Connect with other creators and collectors',
      icon: Users,
      color: 'bg-purple-500',
      href: '/community'
    },
    {
      id: 'labs',
      title: 'Explore Labs',
      description: 'Try experimental features and cutting-edge tools',
      icon: Beaker,
      color: 'bg-orange-500',
      href: '/labs'
    }
  ];

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      theme === 'labs' ? "text-white" : "theme-text-primary"
    )}>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-crd-green to-blue-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={cn(
                "text-4xl font-bold mb-2",
                theme === 'labs' ? "text-white" : "theme-text-primary"
              )}>
                Welcome to CardShow
              </h1>
              <p className={cn(
                "text-lg",
                theme === 'labs' ? "text-slate-300" : "theme-text-secondary"
              )}>
                Create, collect, and share amazing digital cards
              </p>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto mb-8">
            <p className={cn(
              "text-lg mb-6",
              theme === 'labs' ? "text-slate-300" : "theme-text-secondary"
            )}>
              Join thousands of creators building the future of digital collectibles with 
              professional-grade tools and a vibrant community.
            </p>
            
            <Badge className={cn(
              "mb-8",
              theme === 'labs' 
                ? "bg-crd-green/20 text-crd-green border-crd-green/50" 
                : "bg-crd-green/20 text-crd-green border-crd-green/50"
            )}>
              <Zap className="w-3 h-3 mr-1" />
              Powered by AI
            </Badge>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <>
                <Button 
                  asChild 
                  className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                >
                  <Link to="/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Card
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className={cn(
                    theme === 'labs' 
                      ? "border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white" 
                      : "border-slate-300 hover:bg-slate-100"
                  )}
                >
                  <Link to="/creator-dashboard">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  asChild 
                  className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                >
                  <Link to="/auth/signup">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className={cn(
                    theme === 'labs' 
                      ? "border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white" 
                      : "border-slate-300 hover:bg-slate-100"
                  )}
                >
                  <Link to="/auth/signin">
                    Sign In
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature) => (
            <Card 
              key={feature.id} 
              className={cn(
                "transition-all duration-300 hover:shadow-lg group",
                theme === 'labs' 
                  ? "bg-slate-800/50 border-slate-700 hover:border-slate-600" 
                  : "theme-bg-secondary theme-border hover:border-slate-300"
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <CardTitle className={cn(
                  "text-lg mb-2",
                  theme === 'labs' ? "text-white" : "theme-text-primary"
                )}>
                  {feature.title}
                </CardTitle>
                <p className={cn(
                  "text-sm",
                  theme === 'labs' ? "text-slate-300" : "theme-text-secondary"
                )}>
                  {feature.description}
                </p>
              </CardHeader>
              
              <CardContent>
                <Button 
                  asChild
                  variant="outline"
                  className={cn(
                    "w-full transition-colors",
                    theme === 'labs' 
                      ? "border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white" 
                      : "border-slate-300 hover:bg-slate-100"
                  )}
                >
                  <Link to={feature.href}>
                    Explore
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <Card className={cn(
          "mb-8",
          theme === 'labs' 
            ? "bg-slate-800/50 border-slate-700" 
            : "theme-bg-secondary theme-border"
        )}>
          <CardHeader>
            <CardTitle className={cn(
              "text-center flex items-center justify-center gap-2",
              theme === 'labs' ? "text-white" : "theme-text-primary"
            )}>
              <Trophy className="w-5 h-5 text-crd-green" />
              Community Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className={cn(
                  "text-2xl font-bold mb-1",
                  theme === 'labs' ? "text-white" : "theme-text-primary"
                )}>
                  10K+
                </div>
                <div className={cn(
                  "text-sm",
                  theme === 'labs' ? "text-slate-300" : "theme-text-secondary"
                )}>
                  Cards Created
                </div>
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-bold mb-1",
                  theme === 'labs' ? "text-white" : "theme-text-primary"
                )}>
                  2.5K+
                </div>
                <div className={cn(
                  "text-sm",
                  theme === 'labs' ? "text-slate-300" : "theme-text-secondary"
                )}>
                  Active Creators
                </div>
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-bold mb-1",
                  theme === 'labs' ? "text-white" : "theme-text-primary"
                )}>
                  500+
                </div>
                <div className={cn(
                  "text-sm",
                  theme === 'labs' ? "text-slate-300" : "theme-text-secondary"
                )}>
                  Collections
                </div>
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-bold mb-1",
                  theme === 'labs' ? "text-white" : "theme-text-primary"
                )}>
                  24/7
                </div>
                <div className={cn(
                  "text-sm",
                  theme === 'labs' ? "text-slate-300" : "theme-text-secondary"
                )}>
                  Support
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
