
import React from 'react';
import { CRDButton, Typography } from '@/components/ui/design-system';

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
          <Typography as="h2" variant="h4" className="mb-3">
            Creator
          </Typography>
          <div className="flex items-center gap-3">
            <img 
              src={avatar} 
              alt="Creator avatar" 
              className="w-16 h-16 rounded-full"
            />
            <div>
              <Typography variant="body" className="font-semibold">{username}</Typography>
              <Typography variant="caption" className="text-crd-lightGray">{fullName}</Typography>
              <Typography variant="caption" className="text-crd-lightGray mt-1">{role}</Typography>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-editor-darker rounded-xl">
          <Typography variant="caption" className="text-crd-lightGray mb-2 block">
            IS THIS A FAN SUBMISSION?
          </Typography>
          <CRDButton 
            variant="outline" 
            className="w-full bg-editor-dark hover:bg-editor-dark/90 text-crd-green"
          >
            Add the original creator now.
          </CRDButton>
        </div>
      </div>
    </div>
  );
};
