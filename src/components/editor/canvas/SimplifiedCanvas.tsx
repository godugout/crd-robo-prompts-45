
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useCardEditor } from '@/hooks/useCardEditor';
import { PaintBucket, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SimplifiedCanvasProps {
  zoom: number;
  cardEditor?: ReturnType<typeof useCardEditor>;
  onAddElement?: (elementType: string, elementId: string) => void;
}

export const SimplifiedCanvas = ({ zoom, cardEditor, onAddElement }: SimplifiedCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  const scale = zoom / 100;
  const cardWidth = 250; // 2.5 inches at 100 DPI
  const cardHeight = 350; // 3.5 inches at 100 DPI

  const title = cardEditor?.cardData.title || 'Untitled Card';

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: cardWidth,
      height: cardHeight,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    setFabricCanvas(canvas);

    // Auto-save canvas changes
    canvas.on('object:modified', () => {
      if (cardEditor) {
        const canvasData = JSON.stringify(canvas.toJSON());
        cardEditor.updateDesignMetadata('canvasData', canvasData);
      }
    });

    // Handle adding elements from sidebar
    if (onAddElement) {
      const handleAddElement = (elementType: string, elementId: string) => {
        // Basic element adding logic can be implemented here
        toast.success(`${elementId} added to canvas`);
      };
      (window as any).handleCanvasAddElement = handleAddElement;
    }

    toast.success('Canvas ready for editing!');

    return () => {
      canvas.dispose();
    };
  }, [cardWidth, cardHeight, cardEditor, onAddElement]);

  return (
    <div className="flex-1 bg-editor-darker overflow-auto flex items-center justify-center py-8">
      <div className="relative">
        {/* Crafting table grid background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #8B5CF6 1px, transparent 1px),
              linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            transform: 'translate(-100px, -100px)',
            width: 'calc(100% + 200px)',
            height: 'calc(100% + 200px)',
          }}
        />
        
        {/* Card container with padding */}
        <div className="bg-editor-dark rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-crd-green">
                <PaintBucket size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-crd-purple">
                <Palette size={16} />
              </Button>
            </div>
          </div>
          
          {/* Simple card outline */}
          <div 
            className="relative bg-white rounded-lg shadow-lg overflow-hidden"
            style={{
              width: cardWidth * scale,
              height: cardHeight * scale,
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            />
            
            {/* Subtle corner guides */}
            <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-gray-300 opacity-50" />
            <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-gray-300 opacity-50" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-gray-300 opacity-50" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-gray-300 opacity-50" />
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-crd-lightGray text-sm">
              {title} • 2.5" × 3.5"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
