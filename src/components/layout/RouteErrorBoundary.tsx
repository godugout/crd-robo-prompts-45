
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, ArrowLeft, Palette, Camera } from 'lucide-react';

export const RouteErrorBoundary = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const suggestions = [
    {
      title: 'Go Home',
      description: 'Return to the main page',
      icon: Home,
      action: () => navigate('/'),
      color: 'bg-crd-green'
    },
    {
      title: 'Create a Card',
      description: 'Start creating cards',
      icon: Camera,
      action: () => navigate('/cards/enhanced'),
      color: 'bg-blue-500'
    },
    {
      title: 'Open Studio',
      description: 'Access professional tools',
      icon: Palette,
      action: () => navigate('/studio'),
      color: 'bg-crd-purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-editor-dark to-crd-darkest flex items-center justify-center px-4">
      <Card className="max-w-md w-full bg-editor-dark border-editor-border p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚧</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-crd-lightGray">
            The page <code className="bg-editor-border px-2 py-1 rounded text-sm">{location.pathname}</code> doesn't exist or is temporarily unavailable.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              onClick={suggestion.action}
              variant="outline"
              className="w-full border-editor-border text-white hover:bg-editor-border justify-start h-auto p-4"
            >
              <div className={`p-2 rounded ${suggestion.color} text-white mr-3`}>
                <suggestion.icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-medium">{suggestion.title}</div>
                <div className="text-sm text-crd-lightGray">{suggestion.description}</div>
              </div>
            </Button>
          ))}
        </div>

        <Button
          onClick={() => window.history.back()}
          variant="ghost"
          className="text-crd-lightGray hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </Card>
    </div>
  );
};
