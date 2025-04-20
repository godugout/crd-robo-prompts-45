
import React, { useState } from 'react';
import { RotateCw, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CanvasProps {
  zoom: number;
}

export const Canvas = ({ zoom }: CanvasProps) => {
  const scale = zoom / 100;
  const [title, setTitle] = useState('No roads needed');
  const [description, setDescription] = useState('Where we\'re going, there are only cards. An original digital art piece inspired by BTTF.');
  
  return (
    <div className="flex-1 bg-editor-darker overflow-auto flex items-start justify-center py-8">
      <div className="flex flex-col gap-8">
        <div className="bg-editor-dark rounded-xl p-6 w-[400px]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-white text-2xl font-bold">Preview</h2>
            <Button variant="ghost" size="icon" className="text-cardshow-lightGray hover:text-white">
              <RotateCw size={18} />
            </Button>
          </div>
          
          <div 
            className="relative bg-editor-canvas rounded-xl shadow-xl overflow-hidden"
            style={{
              width: 320,
              height: 420,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            {/* Card content */}
            <img 
              src="public/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png" 
              alt="Card preview" 
              className="w-full h-full object-cover"
            />
            
            {/* Grid overlay - togglable with a button */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 0',
                backgroundBlendMode: 'normal',
              }}
            />
          </div>
          
          <div className="mt-6 text-left">
            <h3 className="text-white text-xl font-bold">{title}</h3>
            <p className="text-cardshow-lightGray text-sm mt-2">{description}</p>
            
            <Button variant="outline" className="w-full mt-4 rounded-full border border-editor-border text-cardshow-white">
              Add back
            </Button>
          </div>
        </div>
        
        <div className="bg-editor-dark rounded-xl p-6 w-[400px]">
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-white text-xl font-bold mb-3">Creator</h2>
              <div className="flex items-center gap-3">
                <img 
                  src="public/lovable-uploads/4db063a6-f43a-42c6-8670-41f27f772be8.png" 
                  alt="Creator avatar" 
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <div className="text-white font-semibold">@jaybhai</div>
                  <div className="text-cardshow-lightGray text-sm">Jay Patel</div>
                  <div className="text-cardshow-lightGray text-xs mt-1">CRD Maker and Collector</div>
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
      </div>
    </div>
  );
};
