
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gallery as GalleryIcon, Grid, List } from 'lucide-react';

const Gallery = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-crd-green rounded-xl flex items-center justify-center">
                <GalleryIcon className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Gallery</h1>
                <p className="text-crd-lightGray">Explore and discover amazing cards</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Grid className="w-4 h-4 mr-2" />
                Grid View
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <List className="w-4 h-4 mr-2" />
                List View
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }, (_, i) => (
            <Card key={i} className="bg-crd-dark border-crd-mediumGray overflow-hidden hover:bg-crd-mediumGray/20 transition-colors cursor-pointer">
              <div className="aspect-[2.5/3.5] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <img
                  src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png"
                  alt={`Card ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1">Card {i + 1}</h3>
                <p className="text-crd-lightGray text-sm">Sample card description</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-crd-green text-sm font-medium">Rare</span>
                  <span className="text-crd-lightGray text-xs">2 days ago</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
