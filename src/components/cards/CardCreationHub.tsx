
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Camera, 
  Palette, 
  Upload, 
  Image, 
  Sparkles, 
  ArrowRight,
  Zap,
  Users
} from 'lucide-react';

interface CreationOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  color: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  features: string[];
}

const CREATION_OPTIONS: CreationOption[] = [
  {
    id: 'quick',
    title: 'Quick Create',
    description: 'Simple card creation with AI assistance',
    icon: Zap,
    route: '/cards/enhanced',
    color: 'bg-crd-green',
    difficulty: 'Beginner',
    features: ['AI photo analysis', 'Auto templates', 'One-click export']
  },
  {
    id: 'studio',
    title: 'Professional Studio',
    description: 'Advanced creation with full customization',
    icon: Palette,
    route: '/studio',
    color: 'bg-crd-purple',
    difficulty: 'Advanced',
    features: ['Layer effects', 'Advanced lighting', '3D preview', 'HD export']
  },
  {
    id: 'bulk',
    title: 'Bulk Upload',
    description: 'Process multiple cards at once',
    icon: Upload,
    route: '/cards?tab=upload',
    color: 'bg-blue-500',
    difficulty: 'Intermediate',
    features: ['Card detection', 'Batch processing', 'Auto-cropping']
  },
  {
    id: 'collaborative',
    title: 'Collaborative Project',
    description: 'Work on cards with your team',
    icon: Users,
    route: '/cards/enhanced?mode=collaborative',
    color: 'bg-orange-500',
    difficulty: 'Intermediate',
    features: ['Real-time editing', 'Team reviews', 'Version control']
  }
];

export const CardCreationHub = () => {
  const navigate = useNavigate();

  const handleOptionSelect = (option: CreationOption) => {
    navigate(option.route);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Beginner': 'text-green-400 bg-green-400/10',
      'Intermediate': 'text-yellow-400 bg-yellow-400/10',
      'Advanced': 'text-red-400 bg-red-400/10'
    };
    return colors[difficulty as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-editor-dark to-crd-darkest">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create Amazing Cards
          </h1>
          <p className="text-crd-lightGray text-lg max-w-2xl mx-auto">
            Choose your creation path. From quick AI-powered cards to professional studio experiences.
          </p>
        </div>

        {/* Creation Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {CREATION_OPTIONS.map((option) => (
            <Card 
              key={option.id}
              className="bg-editor-dark border-editor-border hover:border-crd-green/50 transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={() => handleOptionSelect(option)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${option.color} text-white`}>
                    <option.icon className="w-6 h-6" />
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(option.difficulty)}`}>
                    {option.difficulty}
                  </div>
                </div>
                
                <h3 className="text-white font-semibold text-xl mb-2">
                  {option.title}
                </h3>
                
                <p className="text-crd-lightGray mb-4">
                  {option.description}
                </p>
                
                <ul className="space-y-1 mb-6">
                  {option.features.map((feature, index) => (
                    <li key={index} className="text-crd-lightGray text-sm flex items-center">
                      <div className="w-1 h-1 bg-crd-green rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full bg-editor-border hover:bg-crd-green hover:text-black transition-all group-hover:bg-crd-green group-hover:text-black"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-editor-dark rounded-xl p-6 border border-editor-border">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-crd-green" />
            Need Help Choosing?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="border-editor-border text-white hover:bg-editor-border h-auto p-4 flex flex-col items-start"
              onClick={() => navigate('/cards/enhanced')}
            >
              <Camera className="w-5 h-5 mb-2 text-crd-green" />
              <div className="text-left">
                <div className="font-medium">First Time?</div>
                <div className="text-sm text-crd-lightGray">Start with Quick Create</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="border-editor-border text-white hover:bg-editor-border h-auto p-4 flex flex-col items-start"
              onClick={() => navigate('/gallery')}
            >
              <Image className="w-5 h-5 mb-2 text-crd-purple" />
              <div className="text-left">
                <div className="font-medium">Browse Examples</div>
                <div className="text-sm text-crd-lightGray">See what's possible</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="border-editor-border text-white hover:bg-editor-border h-auto p-4 flex flex-col items-start"
              onClick={() => navigate('/studio')}
            >
              <Palette className="w-5 h-5 mb-2 text-crd-green" />
              <div className="text-left">
                <div className="font-medium">Advanced User?</div>
                <div className="text-sm text-crd-lightGray">Jump to Studio</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
