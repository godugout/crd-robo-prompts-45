
import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Share, Grid3x3, Zap, Sparkles, PaintBucket, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface CanvasProps {
  zoom: number;
}

export const Canvas = ({ zoom }: CanvasProps) => {
  const scale = zoom / 100;
  const [title, setTitle] = useState('No roads needed');
  const [description, setDescription] = useState('Where we\'re going, there are only cards. An original digital art piece inspired by BTTF.');
  const [rotation, setRotation] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [showEffects, setShowEffects] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });

  // Card animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (showEffects && cardRef.current) {
        const particles = document.createElement('div');
        particles.className = 'absolute w-2 h-2 bg-cardshow-orange rounded-full opacity-70 animate-fade-out';
        particles.style.left = `${Math.random() * 320}px`;
        particles.style.top = `${Math.random() * 420}px`;
        cardRef.current.appendChild(particles);
        
        // Remove particle after animation
        setTimeout(() => {
          particles.remove();
        }, 1500);
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [showEffects]);
  
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
    toast.success('Card rotated!');
  };
  
  const handleShare = () => {
    toast.success('Sharing options coming soon!');
  };
  
  const handleToggleGrid = () => {
    setShowGrid(prev => !prev);
  };
  
  const handleToggleEffects = () => {
    setShowEffects(prev => !prev);
    if (!showEffects) {
      toast('✨ Particle effects enabled!');
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      setCardPos(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  return (
    <div 
      className="flex-1 bg-editor-darker overflow-auto flex items-start justify-center py-8"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="flex flex-col gap-8">
        <div className="bg-editor-dark rounded-xl p-6 w-[400px]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-white text-2xl font-bold">Preview</h2>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-cardshow-lightGray hover:text-white" onClick={handleToggleGrid}>
                    <Grid3x3 size={18} className={showGrid ? "text-cardshow-green" : ""} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle Grid</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-cardshow-lightGray hover:text-white" onClick={handleToggleEffects}>
                    <Sparkles size={18} className={showEffects ? "text-cardshow-orange" : ""} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle Effects</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-cardshow-lightGray hover:text-white" onClick={handleRotate}>
                    <RotateCw size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Rotate Card</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-cardshow-lightGray hover:text-white" onClick={handleShare}>
                    <Share size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share Card</TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          <div 
            ref={cardRef}
            className="relative bg-editor-canvas rounded-xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
            style={{
              width: 320,
              height: 420,
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: 'top center',
              transition: 'transform 0.3s ease-in-out',
              filter: `brightness(${brightness}%) contrast(${contrast}%)`,
              position: 'relative',
              left: `${cardPos.x}px`,
              top: `${cardPos.y}px`
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Card content */}
            <img 
              src="public/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png" 
              alt="Card preview" 
              className="w-full h-full object-cover"
            />
            
            {/* Grid overlay - togglable with a button */}
            {showGrid && (
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 0',
                  backgroundBlendMode: 'normal',
                }}
              />
            )}
            
            {/* Particle effects container */}
            {showEffects && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Particles are added dynamically via JS */}
              </div>
            )}
          </div>
          
          <div className="mt-6 text-left">
            <h3 className="text-white text-xl font-bold">{title}</h3>
            <p className="text-cardshow-lightGray text-sm mt-2">{description}</p>
            
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-cardshow-lightGray">BRIGHTNESS</label>
                  <span className="text-xs text-cardshow-lightGray">{brightness}%</span>
                </div>
                <Slider 
                  value={[brightness]} 
                  onValueChange={(val) => setBrightness(val[0])} 
                  min={50} 
                  max={150} 
                  step={5}
                  className="py-0"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-cardshow-lightGray">CONTRAST</label>
                  <span className="text-xs text-cardshow-lightGray">{contrast}%</span>
                </div>
                <Slider 
                  value={[contrast]} 
                  onValueChange={(val) => setContrast(val[0])} 
                  min={50} 
                  max={150} 
                  step={5}
                  className="py-0"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1 rounded-full border border-editor-border text-cardshow-white">
                Add back
              </Button>
              <Button variant="outline" className="rounded-full border border-editor-border text-cardshow-green">
                <PaintBucket size={16} />
              </Button>
              <Button variant="outline" className="rounded-full border border-editor-border text-cardshow-purple">
                <Palette size={16} />
              </Button>
            </div>
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
