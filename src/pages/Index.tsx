
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Palette, Users, Trophy, Camera, Target, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Trophy,
      title: "Creator Dashboard",
      description: "Track your progress, develop skills, and see your creation journey.",
      href: "/creator-dashboard",
      gradient: "from-purple-900/50 to-pink-900/50",
      border: "border-purple-500/30",
      hoverBorder: "hover:border-purple-400/50"
    },
    {
      icon: Users,
      title: "Community Hub",
      description: "Connect with creators, join challenges, and share your work.",
      href: "/community",
      gradient: "from-blue-900/50 to-cyan-900/50",
      border: "border-blue-500/30",
      hoverBorder: "hover:border-blue-400/50"
    },
    {
      icon: Sparkles,
      title: "Enhanced Creator",
      description: "Step-by-step creation with templates, effects, and real-time preview.",
      href: "/create/enhanced",
      gradient: "from-green-900/50 to-emerald-900/50",
      border: "border-green-500/30",
      hoverBorder: "hover:border-green-400/50"
    },
    {
      icon: Camera,
      title: "Collections",
      description: "Organize your cards into themed collections and galleries.",
      href: "/collections",
      gradient: "from-yellow-900/50 to-orange-900/50",
      border: "border-yellow-500/30",
      hoverBorder: "hover:border-yellow-400/50"
    }
  ];

  const coreFeatures = [
    {
      icon: Plus,
      title: "Template Selection",
      description: "Choose from professional templates including nostalgic Oakland A's designs and modern styles."
    },
    {
      icon: Palette,
      title: "Visual Effects",
      description: "Add holographic, metallic, chrome effects and particle animations with real-time preview."
    },
    {
      icon: Target,
      title: "Smart Workflow",
      description: "Guided step-by-step creation process with intelligent suggestions and quality checks."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-crd-green/10 border border-crd-green/20 rounded-full text-crd-green text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              The Future of Digital Card Creation
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Create Amazing{' '}
              <span className="text-transparent bg-gradient-to-r from-crd-green to-blue-400 bg-clip-text">
                Trading Cards
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Design, customize, and share your own digital trading cards with our powerful creation tools. 
              From nostalgic baseball cards to modern artistic masterpieces.
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/create/enhanced">
              <Button
                size="lg"
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold px-8 py-4 text-lg group"
              >
                <Plus className="w-5 h-5 mr-2" />
                Start Creating
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link to="/collections">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                Browse Collections
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} to={feature.href}>
                  <div className={`bg-gradient-to-br ${feature.gradient} p-6 rounded-xl border ${feature.border} ${feature.hoverBorder} transition-all cursor-pointer group hover:scale-105`}>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Core Features */}
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Everything You Need to Create</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Professional-grade tools designed for both beginners and experienced creators
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {coreFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:bg-gray-800/70 transition-all">
                    <div className="w-14 h-14 bg-crd-green/20 rounded-full flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-crd-green" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-crd-green/10 to-blue-500/10 border border-crd-green/20 rounded-2xl p-8 mt-16">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Creating?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Join thousands of creators who are already making amazing cards with CardShow
            </p>
            <Link to="/create/enhanced">
              <Button
                size="lg"
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold px-8 py-3"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
