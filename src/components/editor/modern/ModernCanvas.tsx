
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, FabricText } from 'fabric';
import { useModernEditor } from './context/ModernEditorContext';
import { toast } from 'sonner';

export const ModernCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  
  const { selectedTool, zoom, showGrid, setSelectedElement, cardEditor } = useModernEditor();

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selection: selectedTool === 'select',
    });

    // Initialize drawing brush
    canvas.freeDrawingBrush.color = '#000000';
    canvas.freeDrawingBrush.width = 2;

    setFabricCanvas(canvas);

    // Handle object selection
    canvas.on('selection:created', (e) => {
      setSelectedElement(e.selected?.[0] || null);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedElement(e.selected?.[0] || null);
    });

    canvas.on('selection:cleared', () => {
      setSelectedElement(null);
    });

    // Auto-save changes
    canvas.on('object:modified', () => {
      if (cardEditor) {
        const canvasData = JSON.stringify(canvas.toJSON());
        cardEditor.updateDesignMetadata('canvasData', canvasData);
      }
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  // Update canvas based on selected tool
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = selectedTool === 'pen';
    fabricCanvas.selection = selectedTool === 'select';
    fabricCanvas.forEachObject((obj) => {
      obj.selectable = selectedTool === 'select';
      obj.evented = selectedTool === 'select';
    });
    fabricCanvas.renderAll();
  }, [selectedTool, fabricCanvas]);

  // Handle canvas clicks for shape creation
  const handleCanvasClick = useCallback((e: any) => {
    if (!fabricCanvas || selectedTool === 'select' || selectedTool === 'pen') return;

    const pointer = fabricCanvas.getPointer(e.e);
    let newObject;

    switch (selectedTool) {
      case 'rectangle':
        newObject = new Rect({
          left: pointer.x - 50,
          top: pointer.y - 25,
          width: 100,
          height: 50,
          fill: '#4ECDC4',
          stroke: '#45B7D1',
          strokeWidth: 2,
        });
        break;
      case 'circle':
        newObject = new Circle({
          left: pointer.x - 30,
          top: pointer.y - 30,
          radius: 30,
          fill: '#FF6B6B',
          stroke: '#E55353',
          strokeWidth: 2,
        });
        break;
      case 'text':
        newObject = new FabricText('Text', {
          left: pointer.x,
          top: pointer.y,
          fontSize: 20,
          fill: '#333333',
          fontFamily: 'Arial',
        });
        break;
    }

    if (newObject) {
      fabricCanvas.add(newObject);
      fabricCanvas.setActiveObject(newObject);
      fabricCanvas.renderAll();
      toast.success(`${selectedTool} added to canvas`);
    }
  }, [fabricCanvas, selectedTool]);

  // Handle drag and drop from left panel
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!fabricCanvas) return;

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = fabricCanvas.getElement().getBoundingClientRect();
      const pointer = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      let newObject;

      if (data.type === 'shape') {
        switch (data.shape) {
          case 'rectangle':
            newObject = new Rect({
              left: pointer.x - 50,
              top: pointer.y - 25,
              width: 100,
              height: 50,
              fill: '#4ECDC4',
              stroke: '#45B7D1',
              strokeWidth: 2,
            });
            break;
          case 'circle':
            newObject = new Circle({
              left: pointer.x - 30,
              top: pointer.y - 30,
              radius: 30,
              fill: '#FF6B6B',
              stroke: '#E55353',
              strokeWidth: 2,
            });
            break;
        }
      } else if (data.type === 'text') {
        const fontSize = data.textType === 'heading' ? 24 : data.textType === 'body' ? 16 : 12;
        newObject = new FabricText(data.textType === 'heading' ? 'Heading' : data.textType === 'body' ? 'Body Text' : 'Caption', {
          left: pointer.x,
          top: pointer.y,
          fontSize,
          fill: '#333333',
          fontFamily: 'Arial',
          fontWeight: data.textType === 'heading' ? 'bold' : 'normal',
        });
      }

      if (newObject) {
        fabricCanvas.add(newObject);
        fabricCanvas.setActiveObject(newObject);
        fabricCanvas.renderAll();
        toast.success(`${data.type} added to canvas`);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, [fabricCanvas]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 bg-gray-100 relative overflow-hidden">
      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ 
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center center'
        }}
      >
        <div className="relative bg-white rounded-lg shadow-lg">
          {/* Grid Background */}
          {showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #ddd 1px, transparent 1px),
                  linear-gradient(to bottom, #ddd 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />
          )}
          
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full shadow-lg text-sm text-gray-600">
        {zoom}%
      </div>
    </div>
  );
};
