import React, { useState, useRef, useEffect } from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { CanvasToolbar } from './canvas/CanvasToolbar';
import { CanvasPreview } from './canvas/CanvasPreview';
import { CanvasControls } from './canvas/CanvasControls';
import { CanvasCreator } from './canvas/CanvasCreator';

interface CanvasProps {
  zoom: number;
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const Canvas = ({ zoom, cardEditor }: CanvasProps) => {
  const scale = zoom / 100;
  const [rotation, setRotation] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [showEffects, setShowEffects] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });

  const title = cardEditor?.cardData.title || 'No roads needed';
  const description = cardEditor?.cardData.description || 'Where we\'re going, there are only cards. An original digital art piece inspired by BTTF.';

  useEffect(() => {
    if (cardEditor) {
      cardEditor.updateDesignMetadata('canvasSettings', {
        rotation,
        brightness, 
        contrast,
        showEffects
      });
    }
  }, [rotation, brightness, contrast, showEffects, cardEditor]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (showEffects && cardRef.current) {
        const particles = document.createElement('div');
        particles.className = 'absolute w-2 h-2 bg-cardshow-orange rounded-full opacity-70 animate-fade-out';
        particles.style.left = `${Math.random() * 320}px`;
        particles.style.top = `${Math.random() * 420}px`;
        cardRef.current.appendChild(particles);
        
        setTimeout(() => particles.remove(), 1500);
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
          <CanvasToolbar 
            showGrid={showGrid}
            showEffects={showEffects}
            onToggleGrid={() => setShowGrid(!showGrid)}
            onToggleEffects={() => setShowEffects(!showEffects)}
            onRotate={handleRotate}
            onShare={handleShare}
          />
          
          <CanvasPreview 
            cardRef={cardRef}
            scale={scale}
            rotation={rotation}
            brightness={brightness}
            contrast={contrast}
            cardPos={cardPos}
            showGrid={showGrid}
            showEffects={showEffects}
            onMouseDown={handleMouseDown}
            title={title}
            description={description}
          />
          
          <CanvasControls 
            brightness={brightness}
            contrast={contrast}
            onBrightnessChange={(values) => setBrightness(values[0])}
            onContrastChange={(values) => setContrast(values[0])}
            title={title}
            description={description}
          />
          
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
        
        <CanvasCreator />
      </div>
    </div>
  );
};
