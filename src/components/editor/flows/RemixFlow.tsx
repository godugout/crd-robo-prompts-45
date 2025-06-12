
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RemixFlow = () => {
  const navigate = useNavigate();
  
  console.log('RemixFlow component loaded');

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/cards')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>
        </div>
        
        <Card className="max-w-2xl mx-auto bg-editor-dark border-editor-border p-8 text-center">
          <div className="p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg w-16 h-16 mx-auto mb-4">
            <Layers className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            Remix Template
          </h1>
          
          <p className="text-gray-300 mb-6">
            Start with a professional template and customize it to make it your own. Choose from our curated collection.
          </p>
          
          <div className="space-y-4">
            <div className="text-sm text-gray-400 bg-editor-darker p-4 rounded-lg">
              <strong>Coming Soon:</strong> Template gallery with sports cards, trading cards, and custom designs.
            </div>
            
            <Button 
              onClick={() => navigate('/gallery')}
              className="bg-crd-green text-black hover:bg-crd-green/90"
            >
              Browse Gallery for Inspiration
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
