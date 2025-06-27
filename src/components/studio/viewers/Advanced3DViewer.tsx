
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Maximize2, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Advanced3DViewerProps {
  card: {
    id: string;
    name: string;
    image: string;
    type: string;
  };
  viewMode: '2d' | '3d';
}

export const Advanced3DViewer: React.FC<Advanced3DViewerProps> = ({
  card,
  viewMode
}) => {
  return (
    <div className="h-full relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Viewer Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Badge className="bg-black/50 text-white border-white/20">
          {viewMode.toUpperCase()} Mode
        </Badge>
        <Badge className="bg-black/50 text-white border-white/20">
          {card.type}
        </Badge>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button size="sm" variant="ghost" className="bg-black/50 text-white hover:bg-white/20">
          <Eye className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="bg-black/50 text-white hover:bg-white/20">
          <RotateCw className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="bg-black/50 text-white hover:bg-white/20">
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Viewer Area */}
      <div className="h-full flex items-center justify-center p-8">
        {viewMode === '2d' ? (
          <Card className="p-6 bg-black/20 border-white/10 max-w-md">
            <img
              src={card.image}
              alt={card.name}
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <div className="mt-4 text-center">
              <h3 className="text-white font-semibold">{card.name}</h3>
              <p className="text-gray-400 text-sm">{card.type}</p>
            </div>
          </Card>
        ) : (
          <div className="relative">
            {/* 3D Card Placeholder */}
            <div className="w-64 h-80 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-2xl transform rotate-y-12 hover:rotate-y-0 transition-transform duration-500">
              <div className="p-4 h-full flex flex-col">
                <img
                  src={card.image}
                  alt={card.name}
                  className="flex-1 w-full object-cover rounded-lg opacity-90"
                />
                <div className="mt-2 text-center">
                  <h3 className="text-white font-semibold text-sm">{card.name}</h3>
                  <p className="text-gray-400 text-xs">{card.type}</p>
                </div>
              </div>
              
              {/* Holographic effect overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 pointer-events-none animate-pulse" />
            </div>

            {/* 3D Environment indicators */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping animation-delay-200" />
                <div className="w-2 h-2 rounded-full bg-green-400 animate-ping animation-delay-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <Card className="p-3 bg-black/50 border-white/10">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white">
              <span className="font-medium">{card.name}</span>
              <span className="text-gray-400 ml-2">• {card.type}</span>
            </div>
            <div className="text-gray-400">
              {viewMode === '3d' ? 'Interactive 3D View' : '2D Preview'}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
