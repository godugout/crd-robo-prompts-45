
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  Palette, 
  Shuffle,
  ArrowRight,
  Sparkles,
  Image
} from 'lucide-react';

interface CreationOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  color: string;
  features: string[];
}

const CREATION_OPTIONS: CreationOption[] = [
  {
    id: 'upload-style',
    title: 'Upload & Style',
    description: 'Upload your photo and apply preset styles',
    icon: Upload,
    route: '/cards/create?mode=upload-style',
    color: 'bg-crd-green',
    features: ['Full-bleed photo cards', 'Smart cropping', 'Preset overlays', 'One-click creation']
  },
  {
    id: 'design-scratch',
    title: 'Design from Scratch',
    description: 'Choose frames and customize every detail',
    icon: Palette,
    route: '/cards/create?mode=design-scratch',
    color: 'bg-crd-purple',
    features: ['Frame selection', 'Custom layouts', 'Layer effects', 'Full customization']
  },
  {
    id: 'remix-existing',
    title: 'Remix Existing',
    description: 'Start with an existing card design',
    icon: Shuffle,
    route: '/cards/create?mode=remix',
    color: 'bg-crd-blue',
    features: ['Browse gallery', 'Random selection', 'Fork designs', 'Original attribution']
  }
];

export const SimplifiedCardCreationHub = () => {
  const navigate = useNavigate();

  const handleOptionSelect = (option: CreationOption) => {
    navigate(option.route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-editor-dark to-crd-darkest">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create Your Card
          </h1>
          <p className="text-crd-lightGray text-lg max-w-2xl mx-auto">
            Choose your creation style. Each path is designed for different creative needs.
          </p>
        </div>

        {/* Creation Options Grid */}
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {CREATION_OPTIONS.map((option) => (
            <Card 
              key={option.id}
              className="bg-editor-dark border-editor-border hover:border-crd-green/50 transition-all duration-300 cursor-pointer group overflow-hidden h-full"
              onClick={() => handleOptionSelect(option)}
            >
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-center mb-6">
                  <div className={`p-4 rounded-xl ${option.color} text-white`}>
                    <option.icon className="w-8 h-8" />
                  </div>
                </div>
                
                <h3 className="text-white font-semibold text-xl mb-3 text-center">
                  {option.title}
                </h3>
                
                <p className="text-crd-lightGray mb-6 text-center flex-grow">
                  {option.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {option.features.map((feature, index) => (
                    <li key={index} className="text-crd-lightGray text-sm flex items-center">
                      <div className="w-1.5 h-1.5 bg-crd-green rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full bg-editor-border hover:bg-crd-green hover:text-black transition-all group-hover:bg-crd-green group-hover:text-black mt-auto"
                >
                  Start Creating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <div className="bg-editor-dark rounded-xl p-6 border border-editor-border">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-crd-green" />
            Need Help Choosing?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <Image className="w-8 h-8 mx-auto mb-2 text-crd-green" />
              <div className="text-white font-medium mb-1">Got a Great Photo?</div>
              <div className="text-sm text-crd-lightGray">Use Upload & Style</div>
            </div>
            
            <div className="text-center">
              <Palette className="w-8 h-8 mx-auto mb-2 text-crd-purple" />
              <div className="text-white font-medium mb-1">Want Full Control?</div>
              <div className="text-sm text-crd-lightGray">Choose Design from Scratch</div>
            </div>
            
            <div className="text-center">
              <Shuffle className="w-8 h-8 mx-auto mb-2 text-crd-blue" />
              <div className="text-white font-medium mb-1">Need Inspiration?</div>
              <div className="text-sm text-crd-lightGray">Try Remix Existing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
