
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus, Palette } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/home/Navbar';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-[#0a0a0b] to-[#131316]">
      {/* Use the themed Navbar component */}
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Create Amazing <span className="text-crd-green">Trading Cards</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Design professional-quality trading cards with our powerful creation tools and stunning 3D effects.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6 justify-center">
            <Button
              onClick={() => window.location.href = '/create'}
              size="lg"
              className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold px-8 py-4 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Card
            </Button>
            
            <Button
              onClick={() => window.location.href = '/studio'}
              size="lg"
              variant="outline"
              className="border-crd-green text-crd-green hover:bg-crd-green/10 px-8 py-4 text-lg"
            >
              <Palette className="w-5 h-5 mr-2" />
              Enhanced Studio
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-crd-green/20 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-crd-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Creation</h3>
              <p className="text-gray-400">
                Upload your image and create stunning cards with our intuitive step-by-step process.
              </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-crd-green/20 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-crd-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium Effects</h3>
              <p className="text-gray-400">
                Add holographic, metallic, and chrome effects to make your cards truly spectacular.
              </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-crd-green/20 rounded-full flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-crd-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Advanced Studio</h3>
              <p className="text-gray-400">
                Professional editing tools with sample templates to get you started quickly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
