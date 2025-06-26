
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Settings, Grid, Heart, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Profile Header */}
        <Card className="bg-crd-dark border-crd-mediumGray mb-8">
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-crd-green rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-black" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
                  <p className="text-crd-lightGray mb-4">Card creator and collector</p>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">24</div>
                      <div className="text-sm text-crd-lightGray">Cards Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">156</div>
                      <div className="text-sm text-crd-lightGray">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">89</div>
                      <div className="text-sm text-crd-lightGray">Followers</div>
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/settings')} 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </Card>

        {/* Profile Tabs */}
        <div className="mb-6">
          <div className="flex items-center space-x-6 border-b border-crd-mediumGray">
            <button className="pb-4 px-2 border-b-2 border-crd-green text-crd-green font-medium">
              My Cards
            </button>
            <button className="pb-4 px-2 text-crd-lightGray hover:text-white">
              Liked Cards
            </button>
            <button className="pb-4 px-2 text-crd-lightGray hover:text-white">
              Collections
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }, (_, i) => (
            <Card key={i} className="bg-crd-dark border-crd-mediumGray overflow-hidden hover:bg-crd-mediumGray/20 transition-colors cursor-pointer group">
              <div className="aspect-[2.5/3.5] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                <img
                  src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png"
                  alt={`My Card ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">My Card {i + 1}</h3>
                  <Badge className="bg-crd-green/20 text-crd-green border-crd-green/30">
                    Rare
                  </Badge>
                </div>
                <p className="text-crd-lightGray text-sm mb-3">Custom card creation</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-crd-lightGray">3 days ago</span>
                  <div className="flex items-center space-x-1 text-crd-lightGray">
                    <Heart className="w-3 h-3" />
                    <span>{12 + i}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
