
import React, { useState, useRef, useEffect } from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { CanvasToolbar } from './canvas/CanvasToolbar';
import { CanvasPreview } from './canvas/CanvasPreview';
import { CanvasControls } from './canvas/CanvasControls';
import { CanvasCreator } from './canvas/CanvasCreator';
import { CanvasWrapper } from './canvas/CanvasWrapper';
import { CanvasDragArea } from './canvas/CanvasDragArea';
import { CanvasPreviewArea } from './canvas/CanvasPreviewArea';
import { toast } from 'sonner';

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
    <CanvasWrapper title={title} description={description} onActionClick={() => {}}>
      <CanvasToolbar 
        showGrid={showGrid}
        showEffects={showEffects}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onToggleEffects={() => setShowEffects(!showEffects)}
        onRotate={handleRotate}
        onShare={() => toast.success('Sharing options coming soon!')}
      />
      
      <CanvasDragArea
        isDragging={isDragging}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <CanvasPreviewArea
          cardRef={cardRef}
          scale={scale}
          rotation={rotation}
          brightness={brightness}
          contrast={contrast}
          cardPos={cardPos}
          showGrid={showGrid}
          showEffects={showEffects}
          title={title}
          description={description}
        />
      </CanvasDragArea>
      
      <CanvasControls 
        brightness={brightness}
        contrast={contrast}
        onBrightnessChange={(values) => setBrightness(values[0])}
        onContrastChange={(values) => setContrast(values[0])}
        title={title}
        description={description}
      />
      
      <CanvasCreator />
    </CanvasWrapper>
  );
};
