
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, ArrowRight, Layers, Wand2 } from 'lucide-react';

const CardCreation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-[#0a0a0b] to-[#131316]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-crd-green" />
            <h1 className="text-4xl font-bold text-white">Card Creation Studio</h1>
          </div>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Create professional trading cards with advanced tools and effects
          </p>
        </div>

        {/* Creation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-slate-800 border-slate-700 p-8 hover:border-crd-green/50 transition-colors">
            <div className="text-center">
              <div className="w-16 h-16 bg-crd-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-crd-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Enhanced Studio</h3>
              <p className="text-slate-400 mb-6">
                Professional card creation with advanced 3D effects and materials
              </p>
              <Button 
                className="w-full bg-crd-green text-black hover:bg-crd-green/90"
                onClick={() => window.location.href = '/labs'}
              >
                Launch Studio
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-8 hover:border-crd-green/50 transition-colors">
            <div className="text-center">
              <div className="w-16 h-16 bg-crd-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-8 h-8 text-crd-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">PSD Analysis</h3>
              <p className="text-slate-400 mb-6">
                Upload PSD files for advanced layer analysis and CRD frame building
              </p>
              <Button 
                className="w-full bg-crd-green text-black hover:bg-crd-green/90"
                onClick={() => window.location.href = '/debug/unified-analysis'}
              >
                Analyze PSD
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-8 hover:border-crd-green/50 transition-colors">
            <div className="text-center">
              <div className="w-16 h-16 bg-crd-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-crd-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Labs</h3>
              <p className="text-slate-400 mb-6">
                Experimental features and advanced creation tools
              </p>
              <Button 
                className="w-full bg-crd-green text-black hover:bg-crd-green/90"
                onClick={() => window.location.href = '/labs'}
              >
                Explore Labs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">What You Can Create</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎨</span>
              </div>
              <h4 className="text-white font-medium mb-2">Professional Cards</h4>
              <p className="text-sm text-slate-400">High-quality trading cards with custom frames</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✨</span>
              </div>
              <h4 className="text-white font-medium mb-2">3D Effects</h4>
              <p className="text-sm text-slate-400">Holographic, metallic, and chrome finishes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔧</span>
              </div>
              <h4 className="text-white font-medium mb-2">PSD Integration</h4>
              <p className="text-sm text-slate-400">Import and analyze professional PSD files</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="text-white font-medium mb-2">Export Ready</h4>
              <p className="text-sm text-slate-400">Multiple formats for print and digital use</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCreation;
