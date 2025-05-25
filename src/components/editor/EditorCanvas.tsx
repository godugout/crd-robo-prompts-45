
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, FabricText } from 'fabric';
import { useCardEditor } from '@/hooks/useCardEditor';
import { Button } from '@/components/ui/button';
import { Grid3x3, Share, RotateCw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface EditorCanvasProps {
  zoom: number;
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const EditorCanvas = ({ zoom, cardEditor }: EditorCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showEffects, setShowEffects] = useState(false);

  const scale = zoom / 100;
  const cardWidth = 320;
  const cardHeight = 420;

  const title = cardEditor?.cardData.title || 'Untitled Card';
  const description = cardEditor?.cardData.description || 'A beautiful custom card created with Cardshow editor.';

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: cardWidth,
      height: cardHeight,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    canvas.freeDrawingBrush.color = '#000000';
    canvas.freeDrawingBrush.width = 2;

    setFabricCanvas(canvas);
    toast.success('Canvas ready for editing!');

    canvas.on('object:modified', () => {
      if (cardEditor) {
        const canvasData = JSON.stringify(canvas.toJSON());
        cardEditor.updateDesignMetadata('canvasData', canvasData);
      }
    });

    return () => {
      canvas.dispose();
    };
  }, [cardWidth, cardHeight]);

  const handleRotate = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      activeObject.rotate((activeObject.angle || 0) + 90);
      fabricCanvas.renderAll();
      toast.success('Object rotated!');
    } else {
      toast.info('Select an object to rotate');
    }
  };

  const handleShare = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    const link = document.createElement('a');
    link.download = `${title.replace(/\s+/g, '_')}_card.png`;
    link.href = dataURL;
    link.click();
    
    toast.success('Card exported successfully!');
  };

  return (
    <div className="flex-1 bg-editor-darker overflow-auto flex items-start justify-center py-8">
      <div className="flex flex-col gap-8">
        <div className="bg-editor-dark rounded-xl p-6 w-[400px]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-white text-xl font-semibold">Preview</h2>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-crd-lightGray hover:text-white ${showGrid ? "text-crd-green" : ""}`}
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-crd-lightGray hover:text-white ${showEffects ? "text-crd-orange" : ""}`}
                onClick={() => setShowEffects(!showEffects)}
              >
                <Sparkles className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-crd-lightGray hover:text-white"
                onClick={handleRotate}
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-crd-lightGray hover:text-white"
                onClick={handleShare}
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div 
              className="relative"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.3s ease-in-out'
              }}
            >
              <canvas 
                ref={canvasRef} 
                className="border border-editor-border rounded-lg shadow-lg"
              />
              {showEffects && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-crd-orange/5 to-transparent animate-pulse" />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 text-left">
            <h3 className="text-white text-xl font-bold">{title}</h3>
            <p className="text-crd-lightGray text-sm mt-2">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
