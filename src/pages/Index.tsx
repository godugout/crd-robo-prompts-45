import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Palette, Users, Trophy, Camera, Target, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-[#0a0a0b] to-[#131316]">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">CardShow</h1>
              <span className="text-crd-green text-sm">Create • Design • Share</span>
            </div>
            
            <div className="flex gap-3">
              {user ? (
                <Button
                  onClick={() => window.location.href = '/auth/signin'}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => window.location.href = '/auth/signin'}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/auth/signup'}
                    size="sm"
                    className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Create Amazing <span className="text-crd-green">Trading Cards</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Design, customize, and share your own digital trading cards with our powerful creation tools.
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex gap-6 justify-center mb-16">
            <Button
              onClick={() => window.location.href = '/create/enhanced'}
              size="lg"
              className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold px-8 py-4 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Enhanced Creator
            </Button>
            
            <Button
              onClick={() => window.location.href = '/create'}
              size="lg"
              variant="outline"
              className="border-crd-green text-crd-green hover:bg-crd-green/10 px-8 py-4 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Quick Create
            </Button>
            
            <Button
              onClick={() => window.location.href = '/studio'}
              size="lg"
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-4 text-lg"
            >
              <Palette className="w-5 h-5 mr-2" />
              Advanced Studio
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer"
                 onClick={() => window.location.href = '/creator-dashboard'}>
              <div className="w-12 h-12 bg-purple-600/30 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Creator Dashboard</h3>
              <p className="text-gray-300 text-sm">
                Track your progress, develop skills, and see your creation journey.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-6 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all cursor-pointer"
                 onClick={() => window.location.href = '/community'}>
              <div className="w-12 h-12 bg-blue-600/30 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Community Hub</h3>
              <p className="text-gray-300 text-sm">
                Connect with creators, join challenges, and share your work.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 p-6 rounded-xl border border-green-500/30 hover:border-green-400/50 transition-all cursor-pointer"
                 onClick={() => window.location.href = '/create/enhanced'}>
              <div className="w-12 h-12 bg-green-600/30 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Enhanced Creator</h3>
              <p className="text-gray-300 text-sm">
                Step-by-step creation with templates, effects, and real-time preview.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 p-6 rounded-xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all cursor-pointer"
                 onClick={() => window.location.href = '/collections'}>
              <div className="w-12 h-12 bg-yellow-600/30 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Collections</h3>
              <p className="text-gray-300 text-sm">
                Organize your cards into themed collections and galleries.
              </p>
            </div>
          </div>

          {/* Core Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-crd-green/20 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-crd-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Template Selection</h3>
              <p className="text-gray-400">
                Choose from professional templates including nostalgic Oakland A's designs and modern styles.
              </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-crd-green/20 rounded-full flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-crd-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Visual Effects</h3>
              <p className="text-gray-400">
                Add holographic, metallic, chrome effects and particle animations with real-time preview.
              </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-crd-green/20 rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-crd-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Workflow</h3>
              <p className="text-gray-400">
                Guided step-by-step creation process with intelligent suggestions and quality checks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
