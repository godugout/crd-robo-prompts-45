
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, FabricText, FabricImage, Line } from 'fabric';
import { useCardEditor } from '@/hooks/useCardEditor';
import { toast } from 'sonner';

interface FabricCanvasProps {
  width: number;
  height: number;
  showGrid: boolean;
  showEffects: boolean;
  cardEditor?: ReturnType<typeof useCardEditor>;
  onCanvasReady?: (canvas: FabricCanvas) => void;
}

export const FabricCanvasComponent = ({ 
  width, 
  height, 
  showGrid, 
  showEffects, 
  cardEditor,
  onCanvasReady 
}: FabricCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    // Initialize drawing brush
    canvas.freeDrawingBrush.color = '#000000';
    canvas.freeDrawingBrush.width = 2;

    setFabricCanvas(canvas);
    setIsReady(true);
    onCanvasReady?.(canvas);

    // Auto-save canvas changes
    canvas.on('object:modified', () => {
      if (cardEditor) {
        const canvasData = JSON.stringify(canvas.toJSON());
        cardEditor.updateDesignMetadata('canvasData', canvasData);
      }
    });

    return () => {
      canvas.dispose();
    };
  }, [width, height]);

  // Update grid overlay
  useEffect(() => {
    if (!fabricCanvas) return;

    if (showGrid) {
      const gridSize = 20;
      const gridOptions = {
        stroke: 'rgba(255,255,255,0.1)',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      };

      // Add vertical lines
      for (let i = 0; i <= width; i += gridSize) {
        const line = new Line([i, 0, i, height], gridOptions);
        fabricCanvas.add(line);
        fabricCanvas.sendObjectToBack(line);
      }

      // Add horizontal lines
      for (let i = 0; i <= height; i += gridSize) {
        const line = new Line([0, i, width, i], gridOptions);
        fabricCanvas.add(line);
        fabricCanvas.sendObjectToBack(line);
      }
    } else {
      // Remove grid lines
      const objects = fabricCanvas.getObjects();
      objects.forEach(obj => {
        if (obj.stroke === 'rgba(255,255,255,0.1)') {
          fabricCanvas.remove(obj);
        }
      });
    }

    fabricCanvas.renderAll();
  }, [showGrid, fabricCanvas, width, height]);

  // Load existing canvas data
  useEffect(() => {
    if (!fabricCanvas || !cardEditor || !isReady) return;

    const canvasData = cardEditor.cardData.design_metadata?.canvasData;
    if (canvasData) {
      try {
        fabricCanvas.loadFromJSON(canvasData, () => {
          fabricCanvas.renderAll();
        });
      } catch (error) {
        console.error('Failed to load canvas data:', error);
      }
    }
  }, [fabricCanvas, cardEditor, isReady]);

  return (
    <div className="relative">
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
  );
};
