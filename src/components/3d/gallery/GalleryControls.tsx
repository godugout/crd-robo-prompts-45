
import React from 'react';
import { Camera, Users, VolumeX, Volume2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';

interface GalleryControlsProps {
  onNavigateToPosition: (position: THREE.Vector3, target?: THREE.Vector3) => void;
  navigationState: any;
  enableVR?: boolean;
  enableMultiUser?: boolean;
}

export const GalleryControls: React.FC<GalleryControlsProps> = ({
  onNavigateToPosition,
  navigationState,
  enableVR,
  enableMultiUser
}) => {
  const handleCenterView = () => {
    onNavigateToPosition(
      new THREE.Vector3(0, 5, 10),
      new THREE.Vector3(0, 0, 0)
    );
  };
  
  return (
    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
      <div className="flex flex-col space-y-2">
        {/* Center view */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCenterView}
          className="bg-black/80 backdrop-blur-sm text-white hover:bg-white/20 w-12 h-12 p-0"
          title="Center View"
        >
          <Camera className="w-5 h-5" />
        </Button>
        
        {/* Reset rotation */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCenterView}
          className="bg-black/80 backdrop-blur-sm text-white hover:bg-white/20 w-12 h-12 p-0"
          title="Reset View"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        
        {/* Multi-user (if enabled) */}
        {enableMultiUser && (
          <Button
            variant="ghost"
            size="sm"
            className="bg-black/80 backdrop-blur-sm text-white hover:bg-white/20 w-12 h-12 p-0"
            title="Multi-User Mode"
          >
            <Users className="w-5 h-5" />
          </Button>
        )}
        
        {/* Audio toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="bg-black/80 backdrop-blur-sm text-white hover:bg-white/20 w-12 h-12 p-0"
          title="Toggle Audio"
        >
          <Volume2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
