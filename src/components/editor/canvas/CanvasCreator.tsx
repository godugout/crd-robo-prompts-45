
import React from 'react';
import { Button } from '@/components/ui/button';

interface CanvasCreatorProps {
  avatar?: string;
  username?: string;
  fullName?: string;
  role?: string;
}

export const CanvasCreator = ({ 
  avatar = "public/lovable-uploads/4db063a6-f43a-42c6-8670-41f27f772be8.png",
  username = "@jaybhai",
  fullName = "Jay Patel",
  role = "CRD Maker and Collector"
}: CanvasCreatorProps) => {
  return (
    <div className="bg-editor-dark rounded-xl p-6 w-[400px]">
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-white text-xl font-bold mb-3">Creator</h2>
          <div className="flex items-center gap-3">
            <img 
              src={avatar} 
              alt="Creator avatar" 
              className="w-16 h-16 rounded-full"
            />
            <div>
              <div className="text-white font-semibold">{username}</div>
              <div className="text-cardshow-lightGray text-sm">{fullName}</div>
              <div className="text-cardshow-lightGray text-xs mt-1">{role}</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-editor-darker rounded-xl">
          <div className="text-cardshow-lightGray text-sm mb-2">IS THIS A FAN SUBMISSION?</div>
          <Button variant="default" className="w-full bg-editor-dark hover:bg-editor-dark/90 border border-editor-border text-cardshow-green">
            Add the original creator now.
          </Button>
        </div>
      </div>
    </div>
  );
};
