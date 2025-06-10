
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Bug, 
  Sparkles, 
  Palette, 
  Beaker,
  ArrowRight
} from 'lucide-react';

const Labs = () => {
  const labFeatures = [
    {
      title: "Bulk Card Upload",
      description: "Upload multiple trading card images at once with AI-powered detection and batch processing.",
      icon: Upload,
      path: "/labs/bulk-upload",
      status: "beta",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Detection Debug",
      description: "Debug and test card detection algorithms with detailed analysis and visual feedback.",
      icon: Bug,
      path: "/labs/debug-detection",
      status: "experimental",
      color: "from-red-500 to-pink-500"
    },
    {
      title: "Effects Laboratory",
      description: "Experiment with cutting-edge visual effects and material shaders for your cards.",
      icon: Sparkles,
      path: "/labs/effects",
      status: "coming-soon",
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Template Studio",
      description: "Create and test experimental card templates with advanced customization options.",
      icon: Palette,
      path: "/labs/templates",
      status: "coming-soon",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'beta':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">Beta</Badge>;
      case 'experimental':
        return <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">Experimental</Badge>;
      case 'coming-soon':
        return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/30">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-darker to-crd-darkest">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-crd-green/10 via-transparent to-crd-blue/10" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Beaker className="w-12 h-12 text-crd-green" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-crd-green to-crd-blue bg-clip-text text-transparent">
                CRD Labs
              </h1>
            </div>
            <p className="text-xl text-crd-lightGray max-w-3xl mx-auto leading-relaxed">
              Explore experimental features, beta tools, and cutting-edge technology. 
              Help us shape the future of card creation and discovery.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-crd-darkGray/50 rounded-full border border-crd-mediumGray">
              <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse" />
              <span className="text-sm text-crd-lightGray">Experimental features may change without notice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {labFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            const isDisabled = feature.status === 'coming-soon';
            
            const CardWrapper = isDisabled ? 'div' : Link;
            const cardProps = isDisabled ? {} : { to: feature.path };

            return (
              <CardWrapper key={index} {...cardProps}>
                <Card className={`h-full bg-editor-dark/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 ${
                  isDisabled 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:scale-105 hover:shadow-2xl cursor-pointer'
                }`}>
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      {getStatusBadge(feature.status)}
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white mb-2 flex items-center gap-2">
                        {feature.title}
                        {!isDisabled && <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-crd-lightGray leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </CardWrapper>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center space-y-6">
          <h2 className="text-2xl font-bold text-white">Join the Experiment</h2>
          <p className="text-crd-lightGray max-w-2xl mx-auto">
            CRD Labs features are experimental and may change based on user feedback. 
            Help us improve by sharing your thoughts and reporting any issues you encounter.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-crd-lightGray">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Beta - Stable but evolving</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span>Experimental - Unstable, testing only</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
              <span>Coming Soon - In development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labs;
