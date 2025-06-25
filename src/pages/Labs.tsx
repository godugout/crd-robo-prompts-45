
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Beaker, 
  Home, 
  Sparkles, 
  ArrowRight,
  Code,
  Palette
} from 'lucide-react';

const Labs: React.FC = () => {
  const experiments = [
    {
      id: 'embedded-home',
      title: 'Embedded Card Creator',
      description: 'The card creation component embedded in the homepage',
      status: 'Active',
      link: '/?lab=embedded',
      color: 'bg-blue-500',
      icon: Home,
      features: ['Embedded design', 'Quick creation', 'Homepage integration']
    },
    {
      id: 'studio-concept',
      title: 'Advanced Studio Concept',
      description: 'The original advanced studio with 3D preview and effects',
      status: 'Prototype',
      link: '/create',
      color: 'bg-purple-500',
      icon: Sparkles,
      features: ['3D rendering', 'Advanced effects', 'Professional tools']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-dark to-crd-darkest">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-crd-green to-blue-500 rounded-2xl flex items-center justify-center">
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">CRD Labs</h1>
              <p className="text-crd-lightGray">Experimental card creation concepts</p>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-crd-lightGray mb-6">
              Welcome to our experimental playground! Here you can explore different 
              card creation concepts and prototypes before they make it to the main platform.
            </p>
            
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 mb-8">
              <Code className="w-3 h-3 mr-1" />
              Experimental Features
            </Badge>
          </div>
        </div>

        {/* Navigation to Main Creator */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-crd-green/20 to-blue-500/20 border-crd-green/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-crd-green rounded-2xl flex items-center justify-center">
                    <Palette className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Enhanced Card Creator</h3>
                    <p className="text-crd-lightGray">The main card creation experience</p>
                  </div>
                </div>
                <Link to="/cards/enhanced">
                  <Button className="bg-crd-green hover:bg-crd-green/90 text-black">
                    Create Cards
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Experiments Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {experiments.map((experiment) => (
            <Card key={experiment.id} className="bg-crd-mediumGray border-crd-mediumGray hover:border-crd-green/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${experiment.color} rounded-lg flex items-center justify-center`}>
                    <experiment.icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      experiment.status === 'Active' 
                        ? 'border-green-500/50 text-green-400'
                        : 'border-yellow-500/50 text-yellow-400'
                    }
                  >
                    {experiment.status}
                  </Badge>
                </div>
                <CardTitle className="text-white">{experiment.title}</CardTitle>
                <p className="text-crd-lightGray">{experiment.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Features</h4>
                    <ul className="space-y-1">
                      {experiment.features.map((feature, index) => (
                        <li key={index} className="text-sm text-crd-lightGray flex items-center">
                          <div className="w-1 h-1 bg-crd-green rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link to={experiment.link}>
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      Explore Concept
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back to Main */}
        <div className="text-center">
          <Link to="/">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Labs;
