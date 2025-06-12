
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Paintbrush, 
  Layers,
  Scissors,
  ArrowRight 
} from 'lucide-react';

export const SimplifiedCardCreationHub = () => {
  const creationOptions = [
    {
      id: 'cutout',
      title: 'Photo Cutout Cards',
      description: 'Place your photo behind beautiful frame overlays with clickable regions for easy customization',
      icon: Scissors,
      color: 'from-green-500 to-emerald-600',
      href: '/cards/create?mode=cutout',
      recommended: true
    },
    {
      id: 'upload-style',
      title: 'Upload & Style',
      description: 'Upload an existing card or photo and apply professional styling',
      icon: Upload,
      color: 'from-blue-500 to-cyan-600',
      href: '/cards/create?mode=upload-style'
    },
    {
      id: 'design-scratch',
      title: 'Design from Scratch',
      description: 'Create a completely custom card with full creative control',
      icon: Paintbrush,
      color: 'from-purple-500 to-pink-600',
      href: '/cards/create?mode=design-scratch'
    },
    {
      id: 'remix',
      title: 'Remix Template',
      description: 'Start with a template and customize it to make it your own',
      icon: Layers,
      color: 'from-orange-500 to-red-600',
      href: '/cards/create?mode=remix'
    }
  ];

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create Your Card
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose how you'd like to create your card. Each option is designed to give you the perfect balance of ease and creativity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {creationOptions.map((option) => (
            <Card 
              key={option.id} 
              className="relative overflow-hidden bg-editor-dark border-editor-border hover:border-crd-green/50 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${option.color} flex-shrink-0`}>
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {option.title}
                      </h3>
                      {option.recommended && (
                        <span className="px-2 py-1 text-xs font-bold bg-crd-green text-black rounded-full">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {option.description}
                    </p>
                    <Link to={option.href}>
                      <Button 
                        className="bg-crd-green text-black hover:bg-crd-green/90 group-hover:translate-x-1 transition-transform"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
              
              {/* Decorative gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            New to card creation? Try the <strong className="text-crd-green">Photo Cutout Cards</strong> option for the easiest experience!
          </p>
        </div>
      </div>
    </div>
  );
};
